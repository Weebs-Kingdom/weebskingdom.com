var tk = new Vue({
    el: '#token',
    data: {
        uses: 0,
        isAdmin: false,
        isDev: false,
        error: "",
        tokens: []
    },
    created: async function () {
        await this.getTokens();
    },
    methods: {
        createToken: async function () {
            if (this.isAdmin === undefined)
                this.isAdmin = false;

            if (this.isDev === undefined)
                this.isDev = false;

            if (!this.isDev && !this.isAdmin) {
                this.error = "The token should have at least on right";
                return;
            }

            if (!this.uses) {
                this.error = "Uses can't be undefined";
                return;
            }

            if (this.uses <= 0) {
                this.error = "Uses has to be grater than 0";
                return;
            }


            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({maxUse: this.uses, isAdmin: this.isAdmin, isDev: this.isDev})
            };

            const response = await fetch('/api/user/genToken', options);
            const json = await response.json();

            if (json.status === 200) {
                this.error = "New Token: " + json.message;
                this.getTokens();
            } else {
                this.error = "Error on creating new Token!";
            }
        },
        getTokens: async function () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };

            try {
                const response = await fetch('/api/user/tokens', options);
                const json = await response.json();

                if (json.status === 200) {
                    this.tokens = json.data;
                } else {
                    this.error = "Error on loading tokens!";
                }
            } catch (e) {
                this.error = "Error on loading tokens!";
            }
        },
        removeToken: async function (tk) {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({token: tk})
            };

            const response = await fetch('/api/user/tokens', options);
            const json = await response.json();

            if (json.status === 200) {
                this.error = "Removed token: " + tk;
                this.getTokens();
            } else {
                this.error = "Error on removing new Token!";
            }
        }
    }
});

