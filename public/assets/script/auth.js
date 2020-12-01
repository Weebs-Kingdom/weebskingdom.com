var loggedIn = false;
var isAdmin = false;
var token;

async function auth(goToLoginOnFail) {
    token = getCookie("auth");
    if (!token) return;
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        }
    };

    try {
        const response = await fetch('/api/user/auth', options);
        const json = await response.json();

        if (json.status == 200) {
            loggedIn = true;
            console.log("logged in!");
            var login = document.getElementById('login');
            login.innerHTML = "Logout";
            login.href = "";
            login.onclick = function() {
                deleteCookie("auth");
                if (goToLoginOnFail) {
                    window.location.replace("/");
                }
            }
            setupLoggin();
        } else {
            if (goToLoginOnFail) {
                window.location.replace("/login");
            }
            console.log("not logged in!");
        }
    } catch (e) {

    }
}

async function setupLoggin() {
    addDev();
    var accSub = document.getElementById('accSub');

    createLi(accSub, "/profile", "Profile");

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        }
    };
    const response = await fetch('/api/user/isAdmin', options);

    if (response.status == 200) {
        var menu = document.getElementById("menu");
        var adminLi = createLi(menu, "/admin", "Admin");
        var ul = createSubMenu(adminLi);
        createLi(ul, "/admin/gentoken", "Token");
    }
}

function addDev() {
    var menu = document.getElementById("menu");
    var devs = createLi(menu, "/yukisora/devs", "Developer");
    var monster = createSubMenu(devs);
    createLi(monster, "/yukisora/devs/monster", "Monster");
    var attack = createSubMenu(devs);
    createLi(attack, "/yukisora/devs/attack", "Attack");
}

function createSubMenu(vin) {
    var ul = document.createElement("ul");
    ul.setAttribute("class", "submenu");
    if (!vin[0]) {
        vin.appendChild(ul);
    } else {
        vin.children[0].insertAdjacentElement("beforebegin", ul);
    }
    return ul;
}

function createLi(vin, href, inHtml) {
    var lis = document.createElement("li");
    lis.setAttribute("class", "menu__item");

    var as = document.createElement("a");
    as.innerHTML = inHtml;
    as.setAttribute("class", "menu__link");
    as.href = href;

    lis.appendChild(as);
    if (!vin.children[0]) {
        vin.appendChild(lis);
    } else {
        vin.children[0].insertAdjacentElement("beforebegin", lis);
    }
    return lis;
}

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function deleteCookie(name) { setCookie(name, '', -1); }

function isLoggedIn() {
    return loggedIn;
}