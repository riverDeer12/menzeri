let getLastDataBtn = document.getElementById('getLastDataBtn');

// DB config
let fs = require('fs');
let SQL = require('sql.js');
let path = require('path');
let filebuffer = fs.readFileSync(path.join(__dirname, './db_menzeri.db'));
let db = new SQL.Database(filebuffer);

function last_data() {
    let query = 'SELECT data FROM entry_data WHERE menza=="' + menzaParameter + '";';
    let lastData = db.exec(query);
    return lastData[0]['values'][0][0];
}

// see how to use this function without repeating
function add_menu() {
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


    newMenu.onchange = change_function;
    newMenuEng.onchange = change_function;

    mainMenuCounter++;
}

function write_to_textarea(event) {
    event.preventDefault();

    let menus = document.getElementsByClassName('menu-data');
    let menusEng = document.getElementsByClassName('menu-data-eng');
    let extraMeals = document.getElementById('extra-meals');
    let extraMealsEng = document.getElementById('extra-meals-eng');
    let sideDishes = document.getElementById('side-dishes');
    let sideDishesEng = document.getElementById('side-dishes-eng');
    let brunches = document.getElementById('brunches');
    let brunchesEng = document.getElementById('brunches-eng');
    let getLastDataBtn = document.getElementById('getLastDataBtn');

    let dbJSONObject = JSON.parse(last_data());

    console.log(dbJSONObject.data.menus);
    console.log(dbJSONObject.data.menus.length);

    console.log(menus);
    console.log(menus.length);

    if (dbJSONObject.data.menus.length > 1) {
        for (let i = 0; i < dbJSONObject.data.menus.length - 1; i++) {
            add_menu();
        }

        for (let i = 0; i < dbJSONObject.data.menus.length - 1; i++) {
            for (let j = 0; j < menus.length; j++) {
                menus[j].value = dbJSONObject.data.menus[j].join("\r\n");
            }
        }

        for (let i = 0; i < dbJSONObject.dataEng.menusEng.length - 1; i++) {
            for (let j = 0; j < menusEng.length; j++) {
                menusEng[j].value = dbJSONObject.dataEng.menusEng[j].join("\r\n");
            }
        }
    }
    else {
        for (let j = 0; j < menus.length; j++) {
            menus[j].value = dbJSONObject.data.menus[j].join("\r\n");
        }
        for (let j = 0; j < menusEng.length; j++) {
            menusEng[j].value = dbJSONObject.dataEng.menusEng[j].join("\r\n");
        }
    }


    for (let i = 0; i < dbJSONObject.data.pojedinacna.length; i++) {
        if (i === dbJSONObject.data.pojedinacna.length - 1) {
            extraMeals.value += dbJSONObject.data.pojedinacna[dbJSONObject.data.pojedinacna.length - 1];
            break;
        }
        extraMeals.value += dbJSONObject.data.pojedinacna[i] + "\n";
    }

    for (let i = 0; i < dbJSONObject.dataEng.extraMeals.length; i++) {
        if (i === dbJSONObject.dataEng.extraMeals.length - 1) {
            extraMealsEng.value += dbJSONObject.dataEng.extraMeals[dbJSONObject.dataEng.extraMeals.length - 1];
            break;
        }
        extraMealsEng.value += dbJSONObject.dataEng.extraMeals[i] + "\n";
    }

    for (let i = 0; i < dbJSONObject.data.prilozi.length; i++) {
        if (i === dbJSONObject.data.prilozi.length - 1) {
            sideDishes.value += dbJSONObject.data.prilozi[dbJSONObject.data.prilozi.length - 1];
            break;
        }
        sideDishes.value += dbJSONObject.data.prilozi[i] + "\n";
    }

    for (let i = 0; i < dbJSONObject.dataEng.sideDishes.length; i++) {
        if (i === dbJSONObject.dataEng.sideDishes.length - 1) {
            sideDishesEng.value += dbJSONObject.dataEng.sideDishes[dbJSONObject.dataEng.sideDishes.length - 1];
            break;
        }
        sideDishesEng.value += dbJSONObject.dataEng.sideDishes[i] + "\n";
    }

    for (let i = 0; i < dbJSONObject.data.marende.length; i++) {
        if (i === dbJSONObject.data.marende.length - 1) {
            brunches.value += dbJSONObject.data.marende[dbJSONObject.data.marende.length - 1];
            break;
        }
        brunches.value += dbJSONObject.data.marende[i] + "\n";
    }

    for (let i = 0; i < dbJSONObject.dataEng.brunches.length; i++) {
        if (i === dbJSONObject.dataEng.brunches.length - 1) {
            brunchesEng.value += dbJSONObject.dataEng.brunches[dbJSONObject.dataEng.brunches.length - 1];
            break;
        }
        brunchesEng.value += dbJSONObject.dataEng.brunches[i] + "\n";
    }

    // disabling get last data to duplicated data
    getLastDataBtn.disabled = true;

}

getLastDataBtn.addEventListener('click', write_to_textarea, false);