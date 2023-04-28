var info = new Vue({
    el: '#userinfo',
    data: {
        user: undefined
    },
    created: function () {
        this.loop();
    },
    methods: {
        loop: async function () {
            if (loggedIn){
                await this.getUser();
                setTimeout(function () {
                    info.loop();
                }, 4000)
            } else {
                setTimeout(function () {
                    info.loop();
                }, 500)
            }
        },
        energy: function () {
            if (this.user == undefined)
                return 0;
            return this.user.energy;
        },
        coins: function () {
            if (this.user == undefined)
                return 0;
            return this.user.coins + "";
        },
        getUser: async function () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };

            const response = await fetch('/api/yuki/discuser', options);
            if (response.status == 200) {
                const json = await response.json();
                if (json.status == 200)
                    this.user = json.data;
            }
        }
    }
});