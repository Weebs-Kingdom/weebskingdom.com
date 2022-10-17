var profile = new Vue({
    el: '#profile',
    data: {
        submitmsg: "",
        input1Name: "Input 1",
        input2Name: "Input 2",
        input1: "",
        input2: "",
        selection: -1
        //0 = email, 1 = password, 2 = username
    },
    created: async function () {

    },
    methods: {
        submit: async function () {
            this.submitmsg = "";
            const emailOpt = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({email: this.input1})
            };
            const usernameOpt = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({username: this.input1})
            };
            const passOpt = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({password: this.input1, repeat_password: this.input2})
            };

            var res = null;
            if (this.selection == 0) {
                const response = await fetch('/api/user/email', emailOpt);
                res = response;
            } else if (this.selection == 2) {
                const response = await fetch('/api/user/username', usernameOpt);
                res = response;
            } else if (this.selection == 1) {
                const response = await fetch('/api/user/password', passOpt);
                res = response;
            } else {
                return;
            }

            const json = await res.json();
            console.log(json);
            if (json.status == 200) {
                this.submitmsg = "Changed successfully";
            } else if (json.status == 401) {
                window.location.replace("/login");
            } else {
                this.submitmsg = json.message;
            }
        },
        resentEmail: async function () {
            try {
                const options = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    }
                };

                const response = await fetch('/api/user/resentAuthEmail', options);
                if (response.status === 200) {
                    this.submitmsg = "Resent authentication email!";
                }
            } catch (e) {
            }
        },
        changeMode: function (i) {
            this.selection = i;
            this.submitmsg = "";

            switch (i) {
                case 0:
                    this.input1Name = "Email";
                    break;

                case 1:
                    this.input1Name = "Password";
                    this.input2Name = "Repeat Password";
                    break;

                case 2:
                    this.input1Name = "Username";
                    break;
            }
        }
    }
});