var error = "";
var token;

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

    const json = {
        baseDmg: dmg,
        attackName: name,
        level: lvl,
        maxUsage: usage,
        statusEffect: select
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify(json)
    };

    const response = await fetch('/api/yuki/attacks', options);
    var errort = document.getElementById('error');
    if (response) {
        const js = await response.json();
        if (js.status == 200)
            errort.innerHTML = "Succesfully added attack!";
        else
            errort.innerHTML = "An error occured! " + response.body;
    } else
        errort.innerHTML = "An error occured! Fetching wasnt possible";
}