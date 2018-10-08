const remote = require('electron').remote;
const app = remote.app;
let url = decodeURIComponent(window.location.search);
let loggedUser = document.getElementById('loggedUser');

const isOnline = require('is-online');


// Catching authenticated user
url = url.substring(1);
let menzaParameter = url.split("?");
loggedUser.innerHTML = "Prijavljeni ste kao: " + menzaParameter;

function add_menu(event) {
    event.preventDefault();

    let menuCounter = mainMenuCounter;
    let menusContainer = document.getElementById('menusContainer');
    let menusContainerEng = document.getElementById('menusContainerEng');
    let newMenu = document.createElement('textarea');
    let newMenuEng = document.createElement('textarea');
    let newMenuHeading = document.createElement('label');
    let newMenuHeadingEng = document.createElement('label');

    newMenuHeading.textContent += menuCounter + '.' + ' ' + 'MENI';
    newMenuHeading.className += 'control-label spacing menu-heading';
    newMenu.className += 'form-control menu-data';
    newMenu.rows = 5;

    newMenuHeadingEng.textContent += menuCounter + '.' + ' ' + 'MENU';
    newMenuHeadingEng.className += 'control-label spacing menu-heading-eng';
    newMenuEng.className += 'form-control menu-data-eng';
    newMenuEng.rows = 5;

    menusContainer.appendChild(newMenuHeading);
    menusContainer.appendChild(newMenu);

    menusContainerEng.appendChild(newMenuHeadingEng);
    menusContainerEng.appendChild(newMenuEng);

    newMenu.onpaste = clipboard_function;
    newMenuEng.onpaste = clipboard_function;

    mainMenuCounter++;
}

function remove_menu(event) {
    event.preventDefault();

    let menuAlert = require('sweetalert2');
    let menusContainer = document.getElementById('menusContainer');
    let menusContainerEng = document.getElementById('menusContainerEng');
    let menuNumber = menusContainer.childElementCount;

    if (menuNumber <= 2) {
        menuAlert({
            type: 'warning',
            text: 'Ne mozete izbrisati poslijednji meni.',
            showConfirmButton: false,
            timer: 2000
        });
        mainMenuCounter++;
    } else {
        menusContainer.removeChild(menusContainer.lastChild);
        menusContainer.removeChild(menusContainer.lastChild);
        menusContainerEng.removeChild(menusContainerEng.lastChild);
        menusContainerEng.removeChild(menusContainerEng.lastChild);
    }

    mainMenuCounter--;
}

function create_pdf_document() {
    let menuAlert = require('sweetalert2');

    let mealType = document.getElementsByName('meal-type');
    let menus = document.getElementsByClassName('menu-data');
    let menusEng = document.getElementsByClassName('menu-data-eng');
    let menusHeadings = document.getElementsByClassName('menu-heading');
    let menusHeadingsEng = document.getElementsByClassName('menu-heading-eng');
    let extraMeals = document.getElementById('extra-meals');
    let extraMealsEng = document.getElementById('extra-meals-eng');
    let sideDishes = document.getElementById('side-dishes');
    let sideDishesEng = document.getElementById('side-dishes-eng');
    let brunches = document.getElementById('brunches');
    let brunchesEng = document.getElementById('brunches-eng');

    //Check if first menu data is empty
    let firstMenu = document.getElementById('menu1');
    let firstMenuEng = document.getElementById('menu1eng');

    if (firstMenu.value === '' || firstMenuEng.value === '') {
        menuAlert({
            type: 'info',
            text: 'Prvi meni ne smije biti prazan.',
            confirmButtonText: 'U redu.',
            confirmButtonColor: '#158cba',
        });
        return 0;
    }

    let printData = "";
    let menuSeparator = '.';
    printData +=
        "<div>" +
        "<div style='float: right;'>" + todaysDate(menuSeparator) + "</div><br>" +
        "<h1 style='text-align: center;'>MENI ZA X-ICE</h1>";
    for (let i = 0; i < mealType.length; i++) {
        if (mealType[i].checked) {
            JSONObject.data.type = mealType[i].value;
            printData += "<h3 style='text-align: center;'>" + mealType[i].value + "</h3>";
            break;
        }
    }
    JSONObject['data']['menus'] = [];
    JSONObject['data']['menus-Eng'] = [];

    console.log(menus.length);

    for (let i = 0; i < menus.length; i++) {
        printData += "<div>" +
            "<div style='display: inline-block; text-align: left;'>" +
            "<span style='float: left;'><h4>" + menusHeadings[i].textContent + "</h4></span>" +
            "<span style='float: right; margin-left: 350px;'><h4>" + menusHeadingsEng[i].textContent + "</h4></span>" +
            "</div><br>";

        let menusLines = menus[i].value;
        menusLines = menusLines.replace("\n\n", "\n");
        menusLines = menusLines.split("\n");

        let menusLinesEng = menusEng[i].value;
        menusLinesEng = menusLinesEng.replace("\n\n", "\n");
        menusLinesEng = menusLinesEng.split("\n");

        if (menusLines.length !== 1) {
            JSONObject.data.menus.push(menusLines);
        }

        if (menusLinesEng.length !== 1) {
            JSONObject.dataEng.menusEng.push(menusLinesEng);
        }

        printData += "<div style='display: inline; text-align: left;'>";
        for (let j = 0; j < menusLines.length; j++) {
            try {
                printData += "<span style='float: left;'>" + menusLines[j].toUpperCase() + "</span>";
            } catch (error) {
                console.log("Empty line, don't use uppercase function.")
            }

            try {
                printData += "<span style='float: right; min-width: 365px;'>" + menusLinesEng[j].toUpperCase() + "</span><br>";
            } catch (error) {
                console.log("Empty line, don't use uppercase function.")
            }

        }
        printData += "</div>" +
            "</div></div>";
    }

    let printData2 = "<div style='float: right;' >" + todaysDate(menuSeparator) + "</div><br>" +
        "<div>" +
        "<h3 style='text-align: center;'>POJEDINACNA JELA/EXTRA MEALS</h3>" +
        "<div style='display: inline; text-align: left;'>";

    let extraMealsLines = extraMeals.value;
    extraMealsLines = extraMealsLines.replace("\n\n", "\n");
    extraMealsLines = extraMealsLines.split("\n");

    let extraMealsLinesEng = extraMealsEng.value;
    extraMealsLinesEng = extraMealsLinesEng.replace("\n\n", "\n");
    extraMealsLinesEng = extraMealsLinesEng.split("\n");

    if (extraMealsLines !== 1) {
        JSONObject.data.pojedinacna = extraMealsLines;
    }

    if (extraMealsLinesEng !== 1) {
        JSONObject.dataEng.extraMeals = extraMealsLinesEng;
    }

    for (let i = 0; i < extraMealsLines.length; i++) {
        try {
            printData2 += "<span style='float: left;'>" + extraMealsLines[i].toUpperCase() + "</span>";
        } catch (error) {
            console.log("Empty line, don't use uppercase function.")
        }

        try {
            printData2 += "<span style='float: right; min-width: 250px;'>" + extraMealsLinesEng[i].toUpperCase() + "</span><br>";
        } catch (error) {
            console.log("Empty line, don't use uppercase function.")
        }
    }
    printData2 += "</div>" +
        "</div><br>";

    printData2 += "<div> " +
        "<h3 style='text-align: center;'>PRILOZI/SIDEDISHES</h3>" +
        "<div style='display: inline; text-align: left;'>";

    let sideDishesLines = sideDishes.value;
    sideDishesLines = sideDishesLines.replace("\n\n", "\n");
    sideDishesLines = sideDishesLines.split("\n");

    let sideDishesLinesEng = sideDishesEng.value;
    sideDishesLinesEng = sideDishesLinesEng.replace("\n\n", "\n");
    sideDishesLinesEng = sideDishesLinesEng.split("\n");


    if (sideDishesLines !== 1) {
        JSONObject.data.prilozi = sideDishesLines;
    }

    if (sideDishesLinesEng !== 1) {
        JSONObject.dataEng.sideDishes = sideDishesLinesEng;
    }

    for (let i = 0; i < sideDishesLines.length; i++) {
        try {
            printData2 += "<span style='float: left;'>" + sideDishesLines[i].toUpperCase() + "</span>";

        } catch (error) {
            console.log("Empty line, don't use uppercase function.")
        }

        try {
            printData2 += "<span style='float: right; min-width: 250px;'>" + sideDishesLinesEng[i].toUpperCase() + "</span><br>";
        } catch (error) {
            console.log("Empty line, don't use uppercase function.")
        }
    }
    printData2 += "</div>" +
        "</div><br>";

    printData2 += "<div> " +
        "<h3 style='text-align: center;'>MARENDE/BRUNCHES</h3>" +
        "<div style='display: inline; text-align: left;'>";

    let brunchesLines = brunches.value;
    brunchesLines = brunchesLines.replace("\n\n", "\n");
    brunchesLines = brunchesLines.split("\n");

    let brunchesLinesEng = brunchesEng.value;
    brunchesLinesEng = brunchesLinesEng.replace("\n\n", "\n");
    brunchesLinesEng = brunchesLinesEng.split("\n");


    if (brunchesLines !== 1) {
        JSONObject.data.marende = brunchesLines;
    }

    if (brunchesLinesEng !== 1) {
        JSONObject.dataEng.brunches = brunchesLinesEng;
    }

    for (let i = 0; i < brunchesLines.length; i++) {
        try {
            printData2 += "<span style='float: left;'>" + brunchesLines[i].toUpperCase() + "</span>";
        } catch (error) {
            console.log("Empty line, don't use uppercase function.")
        }

        try {
            printData2 += "<span style='float: right; min-width: 250px;'>" + brunchesLinesEng[i].toUpperCase() + "</span><br>";
        } catch (error) {
            console.log("Empty line, don't use uppercase function.")
        }
    }
    printData2 += "</div>" +
        "</div><br>";

    printData2 += "<div style='text-align: center;'>Enjoy your meal!</div>";

    let pdf = require('html-pdf');
    let options = {format: 'A4'};
    let fileSeparator = '_';
    let desktopRoute = app.getPath('desktop');

    pdf.create(printData, options).toFile(desktopRoute + '/Meni - ' + todaysDate(fileSeparator) + '.pdf', function (err, res) {
        if (err)
            return console.log(err);
    });

    pdf.create(printData2, options).toFile(desktopRoute + '/Ostalo - ' + todaysDate(fileSeparator) + '.pdf', function (err, res) {
        if (err)
            return console.log(err);
    });
    console.log(JSONObject);

    save_data(JSONObject);
    return 1;
}

let JSONObject;

JSONObject = {
    "api-key": "<RD[2C`>}*vJr]1fjy-lhl.l@^OOW{F$",
    "menza": 'Kampus',
    "data": {
        "type": "",
        "menus": [],
        "pojedinacna": "",
        "prilozi": "",
        "marende": "",
    },
    "dataEng": {
        "menusEng": [],
        "extraMeals": "",
        "sideDishes": "",
        "brunches": ""
    }
};

// Menza of logged user
let menzaName = menzaParameter[0].toLowerCase();

function sendToApi() {
    let request = require('request');

    request({
        url: "http://menze-api.herokuapp.com/update/" + menzaName,
        method: "POST",
        json: true,
        body: JSONObject
    }, function (error, response, body) {
        if (error) {
            return false;
        } else {
            return true;
        }
    });
}

function try_sending() {

    isOnline().then(online => {
        let loading = require('sweetalert2');
        if (online) {
            console.log('Sending');
            sendToApi();
            loading.close();
        } else {
            console.log('NOT Sending');
            loading({
                type: 'info',
                text: 'PDF je spreman.\nMolimo nemojte gasiti aplikaciju.\nTrenutno nema interneta.',
                confirmButtonText: 'U redu',
            });
            setTimeout(try_sending, 60000);
        }
    });

}

function load_pdf(event) {
    event.preventDefault();
    let loading = require('sweetalert2');
    let pdfAlert = require('sweetalert2');

    loading({
        title: 'Izrada menija',
        onOpen: () => {
            loading.showLoading()
        },
        timer: 3000,
    }).then((result) => {
        if (create_pdf_document()) {
            try_sending(),
            result.dismiss === loading.DismissReason.timer
            pdfAlert({
                type: 'info',
                title: 'Dokumenti su spremni.',
                showConfirmButton: false,
                timer: 3000
            });
        }
        {
            //console.log('I was closed by the timer')
        }
    });
}

// Saving data after closing app
function save_data(json_data) {
    let fs = require('fs');
    let SQL = require('sql.js');
    let path = require('path');
    let filebuffer = fs.readFileSync(path.join(__dirname, './db_menzeri.db'));
    let db = new SQL.Database(filebuffer);

    let menzaParameterQuotes = '"' + menzaParameter + '"';

    let stringJSON = JSON.stringify(json_data);
    let query = "UPDATE entry_data SET data='" + stringJSON + "' WHERE menza=" + menzaParameterQuotes + ";";
    db.exec(query);

    let exportData = db.export();
    let buffer = new Buffer(exportData);
    fs.writeFileSync("./db_menzeri.db", buffer);
}

let newMenuBtn = document.getElementById('newMenuBtn');
let removeMenuBtn = document.getElementById('removeMenuBtn');
let printDayBtn = document.getElementById('printDayBtn');
let backBtn = document.getElementById('backBtn');
let mainMenuCounter = 2;

backBtn.addEventListener('click', logout, false);
newMenuBtn.addEventListener('click', add_menu, false);
removeMenuBtn.addEventListener('click', remove_menu, false);
printDayBtn.addEventListener('click', load_pdf, false);


