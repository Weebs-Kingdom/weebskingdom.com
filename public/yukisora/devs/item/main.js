var error = "";
var token;

async function init() {
    token = getCookie("auth");
    await fillItem();
    var errort = document.getElementById('error');
    errort.innerHTML = error;
}

async function fillItem() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        }
    };
    const response = await fetch('/api/yuki/items', options);
    const json = await response.json();
    if (json.status == 200) {
        for (var i = 0; i < json.data.length; i++) {
            createItem(json.data[i].attackName, json.data[i]._id);
        }
    } else {
        error += json.message;
    }
}

function createItem(name, idd) {
    var id = document.createElement('p');
    id.setAttribute("hidden", true);
    id.innerHTML = idd;
    var list = document.getElementById('cooks');
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

function getCheckedItem() {
    var list = document.getElementById('cooks');
    var divs = list.getElementsByTagName('div');
    var ids = [];
    for (var i = 0; i < divs.length; i += 1) {
        var id = divs[i].getElementsByTagName('p')[0].innerHTML;
        if (divs[i].getElementsByTagName('input')[0].checked) {
            ids.push(id);
        }
    }
    if (ids.length > 1) {
        var errort = document.getElementById('error');
        errort.innerHTML = "Please select only one item!";
        return undefined;
    } else
        return ids;
}

async function submit() {
    const item = getCheckedItem();
    const name = document.getElementById("name").value;
    const image = document.getElementById("imageUrl").value;
    const cookable = document.getElementById("cookable").checked;
    const des = document.getElementById("description").value;
    var e = document.getElementById("rarity");
    const select = e.options[e.selectedIndex].text;

    if (!item && cookable) {
        var errort = document.getElementById('error');
        errort.innerHTML = "Please select one item!";
        return;
    }

    const json = {
        itemName: name,
        itemRarity: select,
        itemImageURL: image,
        itemDescription: des,
        isitemCookable: cookable,
        cooksInto: item
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify(json)
    };

    const response = await fetch('/api/yuki/items', options);
    var errort = document.getElementById('error');
    if (response)
        if (response.status == 200)
            errort.innerHTML = "Succesfully added item!";
        else
            errort.innerHTML = "An error occured! " + response.body;
    else
        errort.innerHTML = "An error occured! Fetching wasnt possible";
}