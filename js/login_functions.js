let loginForm = document.getElementById('loginForm');
let updateUsersBtn = document.getElementById('updateUsersBtn');

//Internet connection
const isOnline = require('is-online');

// DB config
let fs = require('fs');
let SQL = require('sql.js');
let path = require('path');
let filebuffer = fs.readFileSync(path.join(__dirname, './db_menzeri.db'));
let db = new SQL.Database(filebuffer);

function getUsers(event) {
    event.preventDefault();

    let request = require('request');
    let loading = require('sweetalert2');

    loading({
        title: 'Dohvacanje korisnika'
    });

    loading.showLoading();

    isOnline().then(online => {
        if (online) {
            request({
                url: "http://menze-api.herokuapp.com/get/users",
                method: "GET",
                headers: {'api-key': '/TT3ox07L:rxZaM3L/TnE"xFSnC2oO;c'},
            }, function (error, response, body) {
                if (error) {
                    console.log(error);
                    loading.close();
                } else {
                    console.log(response);
                    let usersData = response.body;
                    updateUsers(usersData);
                    loading.close();
                }
            });
        } else {
            loading.close();
            loading({
                type: "warning",
                title: "Niste spojeni na internet",
                text: "Spojite se na internet i pokusajte ponovno",
                showConfirmButton: false,
                timer: 3000
            })
        }
    });
}

function updateUsers(usersData) {
    let data = JSON.parse(usersData);

    for (let i = 0; i < data.users.length; i++) {
        let query = 'SELECT username,password FROM users WHERE username == "' + data.users[i]["username"] + '" AND password == "' + data.users[i]["password"] + '";';
        let dbUsers = db.exec(query);
        if (dbUsers.length === 0) {
            let addUserQuery = 'INSERT INTO users (username,password,menza_name) ' +
                'VALUES("' + data.users[i]["username"] + '","' + data.users[i]["password"] + '","' + data.users[i]["ime-menze"] + '");';
            if (db.run(addUserQuery)) {
                console.log('New user successfully added.');
            }
        }
    }

    // Writing new users data to a disc
    let exportData = db.export();
    let buffer = new Buffer(exportData);
    fs.writeFileSync("./db_menzeri.db", buffer);
}

function loginFormSubmit(event) {
    event.preventDefault();

    let loginAlert = require('sweetalert2');
    let usernameInput = document.getElementById('username').value;
    let passwordInput = document.getElementById('password').value;

    let query = 'SELECT username,password,menza_name FROM users WHERE username=="' + usernameInput + '" AND password=="' + passwordInput + '";';
    let users = db.exec(query);

    if (users.length === 0) {
        console.log('No user found');
        loginAlert({
            type: 'info',
            text: 'Krivo uneseno korisnicko ime ili lozinka !',
            showConfirmButton: false,
            timer: 3000
        });
        loginForm.reset();
    } else {
        let userMenza = users[0]['values'][0][2];
        let parameter = "?" + userMenza;
        window.location.href = __dirname + "/menu_builder.html" + parameter;
    }
}

exitAppBtn.addEventListener('click', exitApp, false);
minimizeBtn.addEventListener('click', minimizeWindow, false);
updateUsersBtn.addEventListener('click', getUsers, false);
loginForm.addEventListener('submit', loginFormSubmit, false);
