async function createToken() {
    var token = getCookie("auth");
    var use = document.getElementById("tokenUses").value;
    if (!use) use = 1;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': token
        },
        body: JSON.stringify({ maxUse: use })
    };

    const response = await fetch('/api/user/genToken', options);
    const json = await response.json();

    if (json.status == 200) {
        var error = document.getElementById('error');
        error.innerHTML = "New Token: " + json.message;
    } else {
        var error = document.getElementById('error');
        error.innerHTML = "Error on creating new Token!";
    }
}

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}