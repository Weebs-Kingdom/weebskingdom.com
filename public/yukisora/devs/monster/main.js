//@ts-check
var error = "";
var token;
var editMode = false;
var id;

async function init() {
    token = getCookie("auth");
    await fillAttacks();
    await fillEvolves();
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
    id.setAttribute("hidden", "true");
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
    id.setAttribute("hidden", "true");
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
    const lvl = document.getElementById("initialLevel").value;
    var e = document.getElementById("rarity");
    const select = e.options[e.selectedIndex].text;

    var ee = document.getElementById("monstertype");
    const monstertype = ee.options[ee.selectedIndex].text;


    var json = {
        initialLevel: lvl,
        rarity: select,
        name: name,
        imageUrl: image,
        baseHp: hp,
        evolveLvl: evlvl,
        shown: shown,
        evolves: monsters,
        attacks: attacks,
        monsterType: monstertype
    };

    var options = undefined;

    if (editMode) {
        var njson = {
            data: json,
            _id: id
        };

        json = njson;
        options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify(json)
        };
    } else {
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify(json)
        };
    }

    const response = await fetch('/api/yuki/monsters', options);
    var errort = document.getElementById('error');
    if (response) {
        const js = await response.json();

        if (js.status == 200) {
            errort.innerHTML = "Succesfully added monster!";
            setTimeout(function() {
                location.reload();
            }, 1000);
        } else
            errort.innerHTML = "An error occured! " + JSON.stringify(js);
    } else
        errort.innerHTML = "An error occured! Fetching wasnt possible";
}

async function btnEdit() {
    const tr = document.getElementById("editListRoot");
    if (editMode) {
        editMode = false;
        uncheckAll();
        document.getElementById("editList").innerHTML = "";
        id = undefined;
        tr.style.visibility = "hidden";
        tr.style.display = "none";
        return;
    }
    editMode = true;
    tr.style.visibility = "visible";
    tr.style.display = "block";

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        }
    };
    const response = await fetch('/api/yuki/monsters', options);
    const json = await response.json();

    for (let i = 0; i < json.data.length; i++) {
        createEditEntry(json.data[i].name, json.data[i]);
    }
}

function createEditEntry(name, data) {
    const br = document.getElementById("editList");

    var lbl = document.createElement("label");
    lbl.innerHTML = name;

    var brr = document.createElement("br");

    var btn = document.createElement("button");
    btn.setAttribute("class", "btn");
    btn.innerHTML = "Edit";
    btn.onclick = function() {
        buildEdit(data);
    }

    br.appendChild(lbl);
    br.appendChild(btn);
    br.appendChild(brr);
}

function buildEdit(data) {
    id = data._id;
    uncheckAll();
    const name = document.getElementById("name");
    const image = document.getElementById("imageUrl");
    const hp = document.getElementById("baseHp");
    const evlvl = document.getElementById("evolveLvl");
    const shown = document.getElementById("shown");
    const rarity = document.getElementById("rarity");
    const lvl = document.getElementById("initialLevel");
    const monstertype = document.getElementById("monstertype");

    for (let i = 0; i < rarity.options.length; i++) {
        if (rarity.options[i] == data.rarity) {
            rarity.selectedIndex = i;
        }
    }

    for (let i = 0; i < monstertype.options.length; i++) {
        if (monstertype.options[i] == data.monsterType) {
            monstertype.selectedIndex = i;
        }
    }

    selectEvolves(data.evolves);
    selectAttacks(data.attacks);

    lvl.value = data.initialLevel;
    rarity.value = data.rarity;
    name.value = data.name;
    image.value = data.imageUrl;
    hp.value = parseInt(data.baseHp);
    try {
        evlvl.value = parseInt(data.evolveLvl);
    } catch (e) {}
    shown.checked = data.shown;
}

function uncheckAll() {
    var list = document.getElementById('evList');
    var divs = list.getElementsByTagName('div');
    var ids = [];
    for (var i = 0; i < divs.length; i += 1) {
        divs[i].getElementsByTagName('input')[0].checked = false;
    }

    list = document.getElementById('attacksList');
    divs = list.getElementsByTagName('div');
    var ids = [];
    for (var i = 0; i < divs.length; i += 1) {
        divs[i].getElementsByTagName('input')[0].checked = false;
    }
}

function selectEvolves(evs) {
    var list = document.getElementById('evList');
    var divs = list.getElementsByTagName('div');
    var ids = [];
    for (var i = 0; i < divs.length; i += 1) {
        var id = divs[i].getElementsByTagName('p')[0].innerHTML;
        for (let j = 0; j < evs.length; j++) {
            if (id == evs[j]) {
                divs[i].getElementsByTagName('input')[0].checked = true;
                break;
            }
        }
    }
}

function selectAttacks(evs) {
    var list = document.getElementById('attacksList');
    var divs = list.getElementsByTagName('div');
    var ids = [];
    for (var i = 0; i < divs.length; i += 1) {
        var id = divs[i].getElementsByTagName('p')[0].innerHTML;
        for (let j = 0; j < evs.length; j++) {
            if (id == evs[j]) {
                divs[i].getElementsByTagName('input')[0].checked = true;
                break;
            }
        }
    }
}