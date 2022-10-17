async function loadFromRoot() {
    const tokenfrom = document.getElementById("accessfrom").value;
    const urlfrom = document.getElementById("urlFrom").value;
    const tokento = document.getElementById("accessto").value;
    const urlto = document.getElementById("urlTo").value;
    var options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'api-token': tokenfrom
        }
    };

    try {
        var response = await fetch(urlfrom + '/user', options);
        var json = await response.json();

        if (json.status === 200) {
            const datusers = json.data;
            for (var i = 0; i < datusers.length; i++) {
                await makepost(datusers[i], urlto + '/user', tokento);
            }
        } else {
            console.log("cant load users");
        }
    } catch (e) {
    }

    try {
        var response = await fetch(urlfrom + '/server', options);
        var json = await response.json();

        if (json.status === 200) {
            const datusers = json.data;
            for (var i = 0; i < datusers.length; i++) {
                await makepost(datusers[i], urlto + '/server', tokento);
            }
        } else {
            console.log("cant load server");
        }
    } catch (e) {
    }

    try {
        var response = await fetch(urlfrom + '/job', options);
        var json = await response.json();

        if (json.status === 200) {
            const datusers = json.data;
            for (var i = 0; i < datusers.length; i++) {
                await makepost(datusers[i], urlto + '/job', tokento);
            }
        } else {
            console.log("cant load jon");
        }
    } catch (e) {
    }

    try {
        var response = await fetch(urlfrom + '/monster', options);
        var json = await response.json();

        if (json.status === 200) {
            const datusers = json.data;
            for (var i = 0; i < datusers.length; i++) {
                await makepost(datusers[i], urlto + '/monster', tokento);
            }
        } else {
            console.log("cant load monster");
        }
    } catch (e) {
    }

    try {
        var response = await fetch(urlfrom + '/item', options);
        var json = await response.json();

        if (json.status === 200) {
            const datusers = json.data;
            for (var i = 0; i < datusers.length; i++) {
                await makepost(datusers[i], urlto + '/item', tokento);
            }
        } else {
            console.log("cant load item");
        }
    } catch (e) {
    }

    try {
        var response = await fetch(urlfrom + '/attack', options);
        var json = await response.json();

        if (json.status === 200) {
            const datusers = json.data;
            for (var i = 0; i < datusers.length; i++) {
                await makepost(datusers[i], urlto + '/attack', tokento);
            }
        } else {
            console.log("cant load attack");
        }
    } catch (e) {
    }
}

async function loadFromJson() {
    const json = JSON.parse(document.getElementById("json").value);
    const li = document.getElementById("link").value;
    for (var i = 0; i < json.length; i++) {
        console.log(JSON.stringify(await makepost(json[i], li, "undefined")));
    }
}

async function makepost(json, link, atoken) {
    var poptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-token': atoken,
            'auth-token': token
        },
        body: JSON.stringify(json)
    };

    var response = await fetch(link, poptions);
    return await response.json();
}