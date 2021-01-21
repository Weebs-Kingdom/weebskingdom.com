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

    const response = await fetch('/api/user/registertk', options);
    const json = await response.json();
    var error = document.getElementById('error');
    if (json.status === 200) {
        error.innerHTML = "Registrierung erfolgreich"
        window.location.replace("/login");
    } else {
        error.innerHTML = json.message;
    }
}