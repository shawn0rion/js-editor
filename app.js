class MessageLogger {
  constructor() {
    this.recentLog = "";
  }

  captureLog(message) {
    this.recentLog = message;
    return message;
  }
}

class DOMHandler {
  constructor(logDivId) {
    this.logDiv = document.getElementById(logDivId);
  }

  displayLog(message) {
    this.logDiv.innerHTML = message + "<br>";
  }
}

let timeout;
function handleUserInput(e) {
  clearTimeout(timeout);

  timeout = setTimeout(() => executeUserCode(e.target.innerText), 300);
}

function executeUserCode(userCode) {
  // This function captures any console.log outputs if called, unless
  function executeBody() {
    return new Function(userCode)();
  }

  // Override console.log
  const originalConsoleLog = console.log;
  let consoleLogOutput = [];
  console.log = function (message) {
    consoleLogOutput.push(message);
  };

  try {
    const result = executeBody(userCode);

    // Restore console.log
    console.log = originalConsoleLog;

    if (consoleLogOutput.length > 0) {
      const logMessage = messageLogger.captureLog(
        consoleLogOutput.join("<br>")
      );
      domHandler.displayLog(logMessage);
    } else if (result === undefined) {
      const logMessage = messageLogger.captureLog("");
      domHandler.displayLog(logMessage);
    } else if (result !== messageLogger.recentLog) {
      const logMessage = messageLogger.captureLog(result);
      domHandler.displayLog(logMessage);
    }
  } catch (error) {
    // Restore console.log
    console.log = originalConsoleLog;

    if (error.message !== messageLogger.recentLog) {
      const logMessage = messageLogger.captureLog(error);
      domHandler.displayLog(logMessage);
    }
  }
}

const messageLogger = new MessageLogger();
const domHandler = new DOMHandler("log-display");
const textInput = document.getElementById("text-input");
textInput.addEventListener("input", handleUserInput);
