//@ts-check
var error = "";
var token;
var editMode = false;
var id;
var data = undefined;
var attacks = undefined;
var evolves = undefined;

async function init() {
    resetAttack();
    resetMonster();
    token = getCookie("auth");
    await loadAttacks();
    await loadEvolves();
    createEvolveDicret();
    var errort = document.getElementById('error');
    errort.innerHTML = error;
}

function createEvolveDicret() {
    var li = document.getElementById("evdirects");

    for (let i = 0; i < evolves.length; i++) {
        var lbl = document.createElement("label");
        lbl.innerHTML = evolves[i].name;

        var brr = document.createElement("br");

        var btn = document.createElement("button");
        btn.setAttribute("class", "btn");
        btn.innerHTML = "Show";
        btn.onclick = function() {
            buildEvolve(evolves[i]);
        }

        li.appendChild(lbl);
        li.appendChild(btn);
        li.appendChild(brr);
    }
}

function buildEvolve(data) {
    var evsList = [
        [data]
    ];

    var findNew = true;
    while (findNew) {
        const d = findEvolveBevore(evsList[0]);
        if (d != undefined || d.length != 0) {
            evsList.unshift(d);
        } else {
            findNew = false;
        }
    }
    findNew = true;

    while (findNew) {
        const d = findEvolveAfter(evsList[evsList.length - 1]);
        if (d != undefined || d.length != 0) {
            evsList.push(d);
        } else {
            findNew = false;
        }
    }

    buildEv(evsList);
}

function buildEv(li) {
    var evhList = document.getElementById("evolves");
    for (let i = 0; i < li.length; i++) {
        const element = li[i];
        var evRow = document.createElement("div");
        for (let j = 0; j < element.length; j++) {
            const e = element[j];
            var div = document.createElement("div");
            buildOneEvForm(div);
            fillAttacksAndEvs(div, e);
            fillForm(div, e);
            evRow.appendChild(div);
        }
        evhList.appendChild(evRow);
    }
}

function fillForm(div, data) {
    div["name"].value = data.name;
    div["imageUrl"].value = data.imageUrl;
    div["baseHp"].value = data.baseHp;
    div["evolveLvl"].value = data.evolveLvl;
    div["shown"].checked = data.shown;
    div["initialLevel"].value = data.initialLevel;
    var rarity = div["rarity"];
    var type = div["monstertype"];

    for (let i = 1; i < type.options.length; i++) {
        if (type.options[i].value == data.monsterType) {
            type.selectedIndex = i;
        }
    }

    for (let i = 0; i < rarity.options.length; i++) {
        if (rarity.options[i].value == data.rarity) {
            rarity.selectedIndex = i;
        }
    }
}

function fillAttacksAndEvs(div, data) {
    for (let i = 0; i < attacks.length; i++) {
        const element = attacks[i];
        createAttack(element.name, element._id, div["attacksList"]);
    }

    for (let i = 0; i < evolves.length; i++) {
        const element = evolves[i];
        createEvolve(element.name, element._id, div["evList"]);
    }
    selectAttacks(data.attacks, div["attacksList"]);
    selectEvolves(data.evolves, div["evList"]);
}

function buildOneEvForm(div) {
    createField("name", "input", "Name", div);
    createField("imageUrl", "input", "Image URL", div);
    createField("baseHp", "number", "Base HP", div);
    createField("initialLevel", "number", "Initial Level", div);
    createField("evolveLvl", "number", "Evolve Level", div);
    div.innerHTML += '<div class=\"form__group field\"> <select id = \"rarity\"> <option > normal < /option> <option > epic < /option> <option > legendary < /option> <option > mystic < /option> </select> <label for = \"rarity\" class=\"form__label\">Rarity</label> </div> <div class = \"form__group field\"> <select id = \"monstertype\"> <option > normal < /option> <option > psychic < /option> <option > fighting < /option> <option > flying < /option> <option > poison < /option> <option > ground < /option> <option > rock < /option> <option > bug < /option> <option > ghost < /option> <option > steel < /option> <option > fire < /option> <option > water < /option> <option > grass < /option> <option > electric < /option> <option > ice < /option> <option > dragon < /option> <option > dark < /option> <option > fairy < /option> < /select > <label for = \"monstertype\" class=\"form__label\">Monstertype</label> < /div > ';
    createField("shown", "checkbox", "Shown", div);
    div.innerHTML += '<div class=\"listBody\"><label>Evolves to:</label> <div class = \"list\" id=\"evList\"></div> < /div > <div class = \"listBody\"><label>Attacks:</label> <div class = \"list\" id=\"attacksList\"></div> < /div > ';
}

function createField(name, type, place, ind) {
    var d = document.createElement("div");
    d.setAttribute("class", "form__group field");
    d.innerHTML = "<input type=\"" + type + "\" class=\"form__field\" placeholder=\"" + place + "\" name=\"" + place + "\" id=\"" + name + "\" required /><label for=\"" + name + "\" class=\"form__label\">" + place + "</label>"
    ind.appendChild(d);
}

function findEvolveAfter(data) {
    var evs = [];
    for (let a = 0; a < data.length; a++) {
        for (let i = 0; i < evolves.length; i++) {
            for (let j = 0; j < data[a].evolves; j++) {
                if (data[a].evolves[j]._id == evolves[i]._id) {
                    evs.push(evolves[i]);
                }
            }
        }
    }
    return evs;
}

function findEvolveBevore(data) {
    var evs = [];
    for (let a = 0; a < data.length; a++) {
        for (let i = 0; i < evolves.length; i++) {
            for (let j = 0; j < evolves[i].evolves.length; j++) {
                if (data[a]._id == evolves[i].evolves[j]) {
                    evs.push(evolves[i]);
                }
            }
        }
    }
    return evs;
}

async function loadAttacks() {
    document.getElementById('attacksList').innerHTML = "";
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
        attacks = json.data;
    } else {
        error += json.message;
    }
}

function createAttack(name, idd, list) {
    var id = document.createElement('p');
    id.setAttribute("hidden", "true");
    id.innerHTML = idd;
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

function createEvolve(name, idd, list) {
    var id = document.createElement('p');
    id.setAttribute("hidden", "true");
    id.innerHTML = idd;
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

async function loadEvolves() {
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
        evolves = json.data;
    } else {
        error += json.message;
    }
}

function getCheckedMonsters(list) {
    var divs = list.children["evlist"].getElementsByTagName('div');
    var ids = [];
    for (var i = 0; i < divs.length; i += 1) {
        var id = divs[i].getElementsByTagName('p')[0].innerHTML;
        if (divs[i].getElementsByTagName('input')[0].checked) {
            ids.push(id);
        }
    }
    return ids;
}

function getCheckedAttacks(list) {
    var divs = list.children["attacklist"].getElementsByTagName('div');
    var ids = [];
    for (var i = 0; i < divs.length; i += 1) {
        var id = divs[i].getElementsByTagName('p')[0].innerHTML;
        if (divs[i].getElementsByTagName('input')[0].checked) {
            ids.push(id);
        }
    }
    return ids;
}

async function submit(id) {
    const li = document.getElementById(id);

    const monsters = getCheckedMonsters(li);
    const attacks = getCheckedAttacks(li);
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
        monsterType: [monstertype]
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

function uncheckAll(list) {
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

function selectEvolves(evs, list) {
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

function selectAttacks(evs, list) {
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

function resetMonster(list) {
    list["name"].value = "";
    list["imageUrl"].value = "";
    list["baseHp"].value = 0;
    list["evolveLvl"].value = 0;
    list["shown"].value = false;
    list["rarity"].selectedIndex = 0;
    list["initialLevel"].value = 0;
    list["monstertype"].selectedIndex = 0;
}

function createAttackBtn() {
    var cl = document.getElementById("close");
    document.getElementById("createAttackButton").hidden = true;
    cl.hidden = true;
    var dialog = document.getElementById("attackDialog");
    setTimeout(function() {
        cl.hidden = false;
    }, 500);

    dialog.showModal();
}

function closeAttackBtn() {
    var cl = document.getElementById("close");
    cl.hidden = true;
    document.getElementById("createAttackButton").hidden = false;
    var dialog = document.getElementById("attackDialog");
    dialog.close();
}

var errorat = "";
var attackEditMode = false;
var atId;

function resetAttack() {
    document.getElementById("attackName").value = "";
    document.getElementById("attackDmg").value = 0;
    document.getElementById("attackLvl").value = 0;
    document.getElementById("attackUsage").value = 0;
    document.getElementById("monstertype").selectedIndex = 0;
    document.getElementById("attackStatusEffect").selectedIndex = 0;
}

async function submitAttack() {
    const name = document.getElementById("attackName").value;
    const dmg = document.getElementById("attackDmg").value;
    const lvl = document.getElementById("attackLvl").value;
    const usage = document.getElementById("attackUsage").value;
    var e = document.getElementById("attackStatusEffect");
    const select = e.options[e.selectedIndex].text;

    var ee = document.getElementById("attackmonstertype");
    const monstertype = ee.options[ee.selectedIndex].text;

    var json = {
        baseDmg: dmg,
        attackName: name,
        level: lvl,
        maxUsage: usage,
        attackType: monstertype,
        statusEffect: select
    }
    var options = undefined;

    if (attackEditMode) {
        var njson = {
            data: json,
            _id: atId
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

    const response = await fetch('/api/yuki/attacks', options);
    var errort = document.getElementById('aterror');
    if (response) {
        const js = await response.json();
        if (js.status == 200) {
            errort.innerHTML = "Succesfully added attack!";
            setTimeout(async function() {
                await loadAttacks();
                if (data != undefined) {
                    buildEdit(data);
                }
            }, 100);
        } else
            errort.innerHTML = "An error occured! " + JSON.stringify(js);
    } else
        errort.innerHTML = "An error occured! Fetching wasnt possible";
}

async function btnEditAt() {
    const tr = document.getElementById("editListRootAt");
    if (attackEditMode) {
        attackEditMode = false;
        document.getElementById("editListAt").innerHTML = "";
        atId = undefined;
        tr.style.visibility = "hidden";
        tr.style.display = "none";
        return;
    }
    attackEditMode = true;
    tr.style.visibility = "visible";
    tr.style.display = "block";

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        }
    };
    const response = await fetch('/api/yuki/attacks', options);
    const json = await response.json();

    for (let i = 0; i < json.data.length; i++) {
        createEditEntryAt(json.data[i].attackName, json.data[i]);
    }
}

function createEditEntryAt(name, data) {
    const br = document.getElementById("editListAt");

    var lbl = document.createElement("label");
    lbl.innerHTML = name;

    var brr = document.createElement("br");

    var btn = document.createElement("button");
    btn.setAttribute("class", "btn");
    btn.innerHTML = "Edit";
    btn.onclick = function() {
        buildEditAt(data);
    }

    br.appendChild(lbl);
    br.appendChild(btn);
    br.appendChild(brr);
}

function buildEditAt(data) {
    atId = data._id;
    const name = document.getElementById("attackName");
    const dmg = document.getElementById("attackDmg");
    const lvl = document.getElementById("attackLvl");
    const usage = document.getElementById("attackUsage");
    const type = document.getElementById("monstertype");
    const status = document.getElementById("attackStatusEffect");

    type.selectedIndex = 0;
    status.selectedIndex = 0;

    for (let i = 1; i < type.options.length; i++) {
        if (type.options[i].value == data.attackType) {
            type.selectedIndex = i;
        }
    }

    for (let i = 0; i < status.options.length; i++) {
        if (status.options[i].value == data.statusEffect) {
            status.selectedIndex = i;
        }
    }

    name.value = data.attackName;
    try {
        dmg.value = parseInt(data.baseDmg);
    } catch (e) {

    }
    try {
        lvl.value = parseInt(data.level);
    } catch (e) {

    }

    usage.value = parseInt(data.maxUsage);
}