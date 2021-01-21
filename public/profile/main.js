var input = null;
var input1 = null;

async function submit() {
    const token = getCookie("auth");
    const emailOpt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify({ email: getContent("input") })
    };
    const usernameOpt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify({ username: getContent("input") })
    };
    const passOpt = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify({ password: getContent("input"), repeat_password: getContent("input1") })
    };

    var res = null;
    if (ema) {
        const response = await fetch('/api/user/email', emailOpt);
        res = response;
    } else if (use) {
        const response = await fetch('/api/user/username', usernameOpt);
        res = response;
    } else if (pw) {
        const response = await fetch('/api/user/password', passOpt);
        res = response;
    } else {
        console.log("no button have been pushed");
        return;
    }

    const json = await res.json();
    console.log(json);
    if (json.status == 200) {
        var error = document.getElementById('error');
        error.innerHTML = "Erfolgreich geändert!";
    } else if (json.status == 401) {
        window.location.replace("/login");
    } else {
        var error = document.getElementById('error');
        error.innerHTML = json.message;
    }
}

var ema = false;
var use = false;
var pw = false;
var dbUser = undefined;

async function init() {
    input = document.getElementById("input");
    input1 = document.getElementById("input1");
    hide("input1");
    hide("input");

    try {
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
            dbUser = json.data;
        }
        if(dbUser.emailVerified){
            document.getElementById("resent").hidden = true;
        }
    } catch (e){
    }
}

async function resentEmail(){
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        };

        const response = await fetch('/api/user/resentAuthEmail', options);
        if(response.status === 200){
            var error = document.getElementById('error');
            error.innerHTML = "Sent auth email again!";
        }
    } catch (e){
    }
}

function btnPw() {
    show("input");
    show("input1");
    update("input", "Password", "input1", "Repeat Password");
    ema = false;
    use = false;
    pw = true;
}

function btnUser() {
    hide("input1");
    show("input");
    updateOne("input", "Username");
    ema = false;
    use = true;
    pw = false;
}

function btnEmail() {
    hide("input1");
    show("input");
    updateOne("input", "Email");
    ema = true;
    use = false;
    pw = false;
}


function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function hide(name) {
    try {
        var content = document.getElementById("cont");
        if (name == "input") {
            content.removeChild(input);
        } else {
            content.removeChild(input1);
        }
    } catch (e) {

    }
}

function show(name) {
    var content = document.getElementById("cont");
    if (name == "input") {
        content.appendChild(input);
    } else {
        content.appendChild(input1);
    }
}

function update(name, cont, name2, cont2) {
    updateOne(name, cont);
    updateOne(name2, cont2);
}

function getContent(name) {
    try {
        return document.getElementById("i" + name).value;
    } catch (e) {
        return 0;
    }
}

function updateOne(name, cont) {
    try {
        if (name == "input") {
            document.getElementById("l" + name).innerHTML = cont;
            document.getElementById("i" + name).placeholder = cont;
            if (cont == "Password" || cont == "Repeat Password") {
                document.getElementById("i" + name).type = "password";
            } else {
                document.getElementById("i" + name).type = "text";
            }
        } else {
            document.getElementById("l" + name).innerHTML = cont;
            document.getElementById("i" + name).placeholder = cont;
            if (cont == "Password" || cont == "Repeat Password") {
                document.getElementById("i" + name).type = "password";
            } else {
                document.getElementById("i" + name).type = "text";
            }
        }
    } catch (e) {

    }
}