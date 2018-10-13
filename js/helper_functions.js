let exitBtns = document.getElementsByClassName("exit-app-btn");
let minimizeBtns = document.getElementsByClassName("minimize-app-btn");
let maximizeBtns = document.getElementsByClassName("maximize-app-btn");
const { getCurrentWindow } = require("electron").remote;
let clearBtn = document.getElementById("clearDataBtn");

clearBtn.addEventListener("click", function() {
  getCurrentWindow().reload();
});

let exitBtnArray = Array.from(exitBtns);
exitBtnArray.forEach(function(button) {
  button.addEventListener("click", exitApp, false);
});

let minimizeBtnArray = Array.from(minimizeBtns);
minimizeBtnArray.forEach(function(button) {
  button.addEventListener("click", minimizeWindow, false);
});

let maximizeBtnArray = Array.from(maximizeBtns);
maximizeBtnArray.forEach(function(button) {
  button.addEventListener("click", maximizeWindow, false);
});

function logout(event) {
  event.preventDefault();
  window.location.href = __dirname + "/index.html";
}

function maximizeWindow(event) {
  event.preventDefault();
  const remote = require("electron").remote;
  remote.BrowserWindow.getFocusedWindow().maximize();
}

function minimizeWindow(event) {
  event.preventDefault();
  const remote = require("electron").remote;
  remote.BrowserWindow.getFocusedWindow().minimize();
}

function exitApp(event) {
  event.preventDefault();
  let goodbyeAlert = require("sweetalert2");

  goodbyeAlert({
    type: "info",
    text: "Jeste li sigurni da zelite izaci iz aplikacije?",
    showCancelButton: true,
    confirmButtonText: "Da",
    cancelButtonText: "Ne"
  }).then(answer => {
    if (answer.value) {
      const remote = require("electron").remote;
      let window = remote.getCurrentWindow();
      window.close();
    }
  });
}

function todaysDate(separator) {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;

  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = dd + separator + mm + separator + yyyy;
  return today;
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getTimestamp(sep=". ", timesep=":") {
    let d = new Date();
    let dd = addZero(d.getDate());
    let mm = addZero(d.getMonth() + 1);

    let yyyy = d.getFullYear();
    let h = addZero(d.getHours());
    let m = addZero(d.getMinutes());
    // let s = addZero(d.getSeconds());

    return dd + sep + mm + sep + yyyy + sep + ' ' + h + timesep + m;
} 

function clear_data(event) {
  event.preventDefault();
  let textareas = document.getElementsByTagName("textarea");
  for (let i = 0; i < textareas.length; i++) {
    textareas[i].value = "";
  }
}

function change_function(event){
  event.preventDefault();
  console.log(event.target.value);

  event.target.value = event.target.value.replace(/["]+/g, "").trim();
}

function handle_paste_data(data) {
  let formatedPastedData = data.replace("/^\s*[\r\n]/gm", "");
  let formatedPastedData2 = formatedPastedData.replace(/['"]+/g, "");
  return formatedPastedData2.replace(/\t/g, "");
}

/*
PASTE EVENTS

function clipboard_function(event) {
  event.stopPropagation();
  event.preventDefault();

  let clipboardData = event.clipboardData || window.clipboardData;
  let pastedData = clipboardData.getData("Text");
  event.target.value += handle_paste_data(pastedData);

function handle_paste_data(data) {
  let formatedPastedData = data.replace("/^\s*[\r\n]/gm", "");
  let formatedPastedData2 = formatedPastedData.replace(/['"]+/g, "");
  return formatedPastedData2.replace(/\t/g, "");
}
*/

let textareas = document.getElementsByTagName("textarea");
let textareasArray = Array.from(textareas);
textareasArray.forEach(function(element) {
  element.addEventListener("change", change_function, false);
});

