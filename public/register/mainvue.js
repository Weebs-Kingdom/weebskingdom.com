var v = new Vue({
    el: "#register",
    data: {
        email: "",
        username: "",
        password: "",
        repeat_password: "",
        error: ""
    },
    methods: {
        register: async function () {
            if (this.password !== this.repeat_password) {
                this.error = "You passwords don't match!";
                return;
            }
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: this.password,
                    email: this.email,
                    username: this.username,
                    repeat_password: this.repeat_password
                })
            };

            var json = undefined;
            await fetch('/api/user/register', options).then(res => res.json())
                .then(res => {
                    json = res;
                    return res;
                })
                .catch(err => console.log(err));

            console.log(json);

            if (json.status === 200) {
                this.error = "Registration complete"
                setTimeout(() => {
                    location.replace("/login");
                }, 3000);
            } else {
                this.error = json.message;
            }
        }
    }
});