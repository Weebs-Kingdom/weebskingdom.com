var error = "";
var token;

async function init() {
    token = getCookie("auth");
    await fillAttacks();
    await fillEvolves();
    console.log("hello!");
    createAttack("Test");
    var errort = document.getElementById('error');
    errort.innerHTML = error;
}

async function fillAttacks() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        }
    };
    const response = await fetch('/api/yuki/attacks', options);
    const json = await response.json();
    if (json.status == 200) {
        for (var i = 0; i < json.data.length; i++) {
            createAttack(json.data[i].attackName, json.data[i]._id);
        }
    } else {
        error += json.message;
    }
}

function createAttack(name, idd) {
    var id = document.createElement('p');
    id.setAttribute("hidden", true);
    id.innerHTML = idd;
    var list = document.getElementById('attacksList');
    var di = document.createElement('div');
    var lable = document.createElement('label');
    lable.innerHTML = name;
    var inp = document.createElement('input');
    inp.setAttribute("type", "checkbox");
    di.appendChild(inp);
    di.appendChild(lable);
    di.appendChild(id);
    list.appendChild(di);
}

function createEvolve(name, idd) {
    var id = document.createElement('p');
    id.setAttribute("hidden", true);
    id.innerHTML = idd;
    var list = document.getElementById('evList');
    var di = document.createElement('div');
    var lable = document.createElement('label');
    lable.innerHTML = name;
    var inp = document.createElement('input');
    inp.setAttribute("type", "checkbox");
    di.appendChild(inp);
    di.appendChild(lable);
    di.appendChild(id);
    list.appendChild(di);
}

async function fillEvolves() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        }
    };
    const response = await fetch('/api/yuki/monsters', options);
    const json = await response.json();
    if (json.status == 200) {
        for (var i = 0; i < json.data.length; i++) {
            createEvolve(json.data[i].name, json.data[i]._id);
        }
    } else {
        error += json.message;
    }
}

function getCheckedMonsters() {
    var list = document.getElementById('evList');
    var divs = list.getElementsByTagName('div');
    var ids = [];
    for (var i = 0; i < divs.length; i += 1) {
        var id = divs[i].getElementsByTagName('p')[0].innerHTML;
        if (divs[i].getElementsByTagName('input')[0].checked) {
            ids.push(id);
        }
    }
    return ids;
}

function getCheckedAttacks() {
    var list = document.getElementById('attacksList');
    var divs = list.getElementsByTagName('div');
    var ids = [];
    for (var i = 0; i < divs.length; i += 1) {
        var id = divs[i].getElementsByTagName('p')[0].innerHTML;
        if (divs[i].getElementsByTagName('input')[0].checked) {
            ids.push(id);
        }
    }
    return ids;
}

async function submit() {
    const monsters = getCheckedMonsters();
    const attacks = getCheckedAttacks();
    const name = document.getElementById("name").value;
    const image = document.getElementById("imageUrl").value;
    const hp = document.getElementById("baseHp").value;
    const evlvl = document.getElementById("evolveLvl").value;
    const shown = document.getElementById("shown").checked;

    const json = {
        name: name,
        imageUrl: image,
        baseHP: hp,
        evolveLvl: evlvl,
        shown: shown,
        evolves: monsters,
        attacks: attacks
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify(json)
    };

    const response = await fetch('/api/yuki/monsters', options);
    console.log(json);
    var errort = document.getElementById('error');
    if (response)
        if (response.status == 200)
            errort.innerHTML = "Succesfully added monster!";
        else
            errort.innerHTML = "An error occured! " + response.body;
    else
        errort.innerHTML = "An error occured! Fetching wasnt possible";
}