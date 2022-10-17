async function login() {
    var password = document.getElementById('password').value;
    var email = document.getElementById('email').value;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({password: password, email: email})
    };
    const response = await fetch('/api/user/login', options);
    const json = await response.json();
    if (json.status == 200) {
        var error = document.getElementById('error');
        error.innerHTML = "Login erfolgreich"
        setCookie("auth", json.message, 1);
        window.location.replace("/");
    } else {
        var error = document.getElementById('error');
        error.innerHTML = "Password or Email invalid!";
    }
}