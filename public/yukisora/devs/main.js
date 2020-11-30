var error = "";
async function main() {
    await fillAttacks();
    await fillEvolves();
    var error = document.getElementById('error');
    error.innerHTML = error;
}

async function fillAttacks() {
    const options = {
        method: 'GET'
    };
    const response = await fetch('/api/yuki/users', options);
    const json = await response.json();
    if (json.status == 200) {
        var attacks = json.data;
        var sel = document.getElementById('attacks');
        for (var i = 0; i < attacks.length; i++) {
            createAttack(attacks[i]);
        }
    } else {
        error += json.message;
    }
}

function createAttack(name) {
    var list = document.getElementById('attacksList');
    var di = document.createElement('div');
    var lable = document.createElement('label');
    lable.innerHTML = name;
    var inp = document.createElement('input');
    inp.setAttribute("type", "checkbox");
    di.appendChild(inp);
    di.appendChild(lable);
    list.appendChild(di);
}

async function fillEvolves() {
    const options = {
        method: 'GET'
    };
    const response = await fetch('/api/yuki/monsters', options);
    const json = await response.json();
    if (json.status == 200) {
        var attacks = json.data;
        var sel = document.getElementById('evolves');
        for (var i = 0; i < attacks.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = attacks[i];
            opt.value = attacks[i];
            sel.appendChild(opt);
        }
    } else {
        error += json.message;
    }
}