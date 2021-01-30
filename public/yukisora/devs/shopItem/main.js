var error = "";
var token;
var parent = "";

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
    if (json.status === 200) {
        for (var i = 0; i < json.data.length; i++) {
            createItem(json.data[i]);
        }
    } else {
        error += json.message;
    }
}

function createItem(json) {
    var list = document.getElementById('parent');
    var di = document.createElement('div');
    var lable = document.createElement('label');
    lable.innerHTML = json.itemName;
    var button = document.createElement("button");
    button.innerHTML = "Select";
    button.onclick = function (){
        parent = json._id;
        document.getElementById("name").value = json.itemName;
        if(json.itemImageURL !== undefined)
        document.getElementById("imageUrl").value = json.imageUrl;
        document.getElementById("description").value = json.itemDescription;

        var e = document.getElementById("rarity");
        for (var i = 0; i < e.options.length; i++) {
            if(e.options[i].text === json.itemRarity)
                e.selectedIndex = i;
        }
    };

    di.appendChild(button);
    di.appendChild(lable);
    list.appendChild(di);
}

async function submit() {
    const name = document.getElementById("name").value;
    const image = document.getElementById("imageUrl").value;
    const des = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const isStocked = document.getElementById("isStocked").checked;
    const stock = document.getElementById("stock").value;
    var e = document.getElementById("rarity");
    const select = e.options[e.selectedIndex].text;

    e = document.getElementById("role");
    const role = e.options[e.selectedIndex].text;

    const isItem = parent !== "";
    const isRole = role !== "";

    if (isItem && isRole) {
        var errort = document.getElementById('error');
        errort.innerHTML = "Please select either a item or a role connection!";
        return;
    }

    const json = {
        name: name,
        rarity: select,
        image: image,
        description: des,
        price: price,
        stock: stock,
        hasStocks: isStocked,
        isItem: isItem,
        connectedItemId: parent,
        connectedRole: role,
        isRole: isRole
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify(json)
    };

    const response = await fetch('/api/shop/items', options);
    var errort = document.getElementById('error');
    if (response) {
        const js = await response.json();

        if (js.status == 200) {
            errort.innerHTML = "Succesfully added item!";
            setTimeout(function() {
                location.reload();
            }, 1000);
        } else
            errort.innerHTML = "An error occured! " + JSON.stringify(js);
    } else
        errort.innerHTML = "An error occured! Fetching wasnt possible";
}