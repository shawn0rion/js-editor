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
function handleUserInput(text) {
  clearTimeout(timeout);

  timeout = setTimeout(() => executeUserCode(text), 300);
}

function executeUserCode(userCode) {
  // This function captures any console.log outputs if called
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
      console.log(logMessage);
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

// syntax highlighting object
const codeMirror = CodeMirror(textInput, {
  mode: "javascript",
  lineNumbers: true,
  lineWrapping: true,
});

// initialization example code
const example = `const heroes = [
  { name: 'Tracer', role: 'Damage' },
  { name: 'Reaper', role: 'Damage' },
  { name: 'Sombra', role: 'Damage' },
  { name: 'Genji', role: 'Damage' },
  { name: 'Mercy', role: 'Support' },
  { name: 'Moira', role: 'Support' },
  { name: 'Zenyatta', role: 'Support' },
  { name: 'Lucio', role: 'Support' },
  { name: 'Widowmaker', role: 'Damage' },
  { name: 'Winston', role: 'Tank' },
];


const mixedBag = [
  { name: 'Tracer'},
  { name: 'Genji', role: 'Damage' },
  { name: 'Lucio'},
  { name: 'Mercy', role: 'Support' },
  { role: 'Tank' },
];

function filterHeroes(arg1, arg2){
	return [...arg1.filter(obj => compareObjects(obj, arg2))];
}


function compareObjects(arg1, arg2){
 	return Object.keys(arg2).every(key => arg2[key] === arg1[key]); 
}

mixedBag.forEach(item => {
  const filteredHeroes = filterHeroes(heroes, item);

  if (filteredHeroes.length > 0) {
    filteredHeroes.forEach(hero => {
      const { name, role } = hero;
      console.log(\`Name: \${name}, Role: \${role}\`);
    });
  }
});`;

codeMirror.setValue(example);
executeUserCode(example);

// event for user input
codeMirror.on("change", (cm) => {
  handleUserInput(cm.getValue());
});
