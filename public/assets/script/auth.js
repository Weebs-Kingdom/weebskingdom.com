var loggedIn = false;
var isAdmin = false;
var token;
var dbUser;

function changeTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
}

async function auth(goToLoginOnFail) {
    token = getCookie("auth");
    if (!token) {
        if (goToLoginOnFail) {
            window.location.replace("/login");
        }
        return;
    }
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

        if (json.status === 200) {
            loggedIn = true;
            console.log("logged in!");
            try {
                dbUser = await loadUser();
            } catch (e){
            }
            var login = document.getElementById('login');
            var regi = document.getElementById('regi');
            regi.remove();
            login.innerHTML = "Logout";
            login.href = "";
            login.onclick = function () {
                deleteCookie("auth");
                if (goToLoginOnFail) {
                    window.location.replace("/");
                }
            }
            await setupLogin();
        } else {
            console.log("not logged in!");
            if (goToLoginOnFail) {
                window.location.replace("/login");
            }
        }
    } catch (e) {
        console.log(e);
        console.log("error");
    }
}

async function setupLogin() {
    if (await getIsDev()){
        addDev();
    }

    var accSub = document.getElementById('accSub');
    var home = document.getElementById('home');
    createLi(accSub, "/profile", "Profile");
    createLi(home, "/yukisora/shop", "Shop");
    createLi(home, "/yukisora/loot", "Lootbox");

    if (await getIsAdmin()){
        addAdmin();
    }
}

async function getIsAdmin() {
    return await getRoute("/api/user/isAdmin");
}

async function getIsDev() {
    return await getRoute("/api/user/isDev");
}

async function getRoute(link) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        }
    };
    const response = await fetch(link, options);
    return response.status === 200;
}

function addAdmin() {
    var menu = document.getElementById("menu");
    var adminLi = createLi(menu, "/admin", "Admin");
    var ul = createSubMenu(adminLi);
    createLi(ul, "/admin/gentoken", "Token");
}

function addDev() {
    var menu = document.getElementById("menu");
    var devs = createLi(menu, "/yukisora/devs", "Developer");
    var subMenu = createSubMenu(devs);
    createLi(subMenu, "/yukisora/devs/monsterlist", "Monster");
    createLi(subMenu, "/yukisora/devs/item", "Item");
    createLi(subMenu, "/yukisora/devs/attacklist", "Attack");
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

async function loadUser(){
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        };

        const response = await fetch('/api/yuki/discuser', options);
        if(response.status === 200){
            const json = await response.json();
            return json.data;
        }
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

function deleteCookie(name) {
    setCookie(name, '', -1);
}

function isLoggedIn() {
    return loggedIn;
}

function ping(host) {
    var http = new XMLHttpRequest();
    http.open("GET", host, /*async*/true);
    http.onreadystatechange = function() {
        if (http.readyState == 4) {
        }
    };
    try {
        http.send(null);
    } catch(exception) {
       return true;
    }
    return false;
}