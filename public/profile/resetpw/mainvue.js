var res = new Vue({
    el: '#reset',
    created: function () {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get('token');
        if(token) {
            this.bchangePassword = true;
            this.token = token;
        }
    },
    data: {
        bchangePassword: false,
        token: "",
        password: "",
        repeat_password: "",
        email: "",
        msg: ""
    },
    methods: {
        reqResetPassword: async function (){
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: this.email})
            };
            var json = {};
            await fetch('/api/user/reqresetpw', options).then(res => res.json())
                .then(res => {
                    json = res;
                    return res;
                })
                .catch(err => console.log(err));

            if (json === undefined) {
                this.msg = "While connection to the server a error occurred!";
                return;
            }

            if(json.status === 200){
                this.msg = "A message has been sent to your E-Mail address!";
            } else {
                this.msg = "No account found with your E-Mail address!";
            }
        },
        changePassword: async function () {
            if(this.password != this.repeat_password){
                this.msg = "Passwords don't match!";
                return;
            }

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token: this.token, pw: this.password})
            };
            var json = {};
            await fetch('/api/user/resetpw', options).then(res => res.json())
                .then(res => {
                    json = res;
                    return res;
                })
                .catch(err => console.log(err));

            if (json === undefined) {
                this.msg = "While connection to the server a error occurred!";
                return;
            }

            if(json.status === 200){
                this.msg = "A new password has been set to your account!";
            } else if(json.status === 400){
                this.msg = json.message;
            } else {
                this.msg = "This token is expired!";
            }
        }
    }
});