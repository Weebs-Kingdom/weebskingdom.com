var error = "";
var token;
var attackEditMode = false;
var atId;

async function init() {
    token = getCookie("auth");
}

async function submit() {
    const name = document.getElementById("attackName").value;
    const dmg = document.getElementById("attackDmg").value;
    const lvl = document.getElementById("attackLvl").value;
    const usage = document.getElementById("attackUsage").value;
    var e = document.getElementById("attackStatusEffect");
    const select = e.options[e.selectedIndex].text;

    var ee = document.getElementById("monstertype");
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
    var errort = document.getElementById('error');
    if (response) {
        const js = await response.json();
        if (js.status == 200) {
            errort.innerHTML = "Succesfully added attack!";
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
    if (attackEditMode) {
        attackEditMode = false;
        document.getElementById("editList").innerHTML = "";
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
        createEditEntry(json.data[i].attackName, json.data[i]);
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