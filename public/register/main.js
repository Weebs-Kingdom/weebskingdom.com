async function register() {
    var password = document.getElementById('password').value;
    var email = document.getElementById('email').value;
    var rpassword = document.getElementById('rpassword').value;
    var username = document.getElementById('username').value;
    var token = document.getElementById('token').value;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password, email: email, username: username, access_token: token, repeat_password: rpassword })
    };

    const response = await fetch('/api/user/register', options);
    const json = await response.json();
    console.log(json);

    if (json.status == 200) {
        var error = document.getElementById('error');
        error.innerHTML = "Registrierung erfolgreich"
        window.location.replace("/login");
    } else {
        var error = document.getElementById('error');
        error.innerHTML = json.message;
    }
}