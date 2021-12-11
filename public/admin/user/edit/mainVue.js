var attacks = [];
var monsters = [];

var usr = new Vue({
    el: '#usr',
    data: {
        submitmsg : "",
        editMode: false,
        id: "",
        user: {
            "_id": "0000000000000",
            "username": "unknown",
            "userID": "unknown",
            "coins": 0,
            "xp": 0,
            "level": 0,
            "maxMonsters": 0,
            "maxItems": 0,
            "maxEnergy": 0
        },
        finished: false
    },
    created: async function () {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const edit = urlParams.get('id');

        if (edit) {
            this.id = edit;
            await this.loadData();
        }
    },
    methods: {
        async loadData() {
            var data = '{ "_id" : "' + this.id + '" }';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: data
            };

            const response = await fetch('/api/yuki/getUser', options);
            const json = await response.json();
            if (json.status === 200) {
                this.user._id = json.data._id;
                this.user.username = json.data.username;
                this.user.userID = json.data.userID;
                this.user.coins = json.data.coins;
                this.user.xp = json.data.xp;
                this.user.level = json.data.level;
                this.user.maxMonsters = json.data.maxMonsters;
                this.user.maxItems = json.data.maxItems;
                this.user.maxEnergy = json.data.maxEnergy;

                console.log(this.user);
                this.editMode = true;
            } else {
                this.finished = true;
                this.editMode = true;
                this.submitmsg = "Can't find shit...";
            }
        },
        deleteUser: async function (id) {
            this.finished = true;
            var answer = window.confirm("Delete?");
            if (!answer)
                return;

            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({_id: id})
            };

            const response = await fetch('/api/yuki/user', options);
            const json = await response.json();
            console.log(json);
            if (json.status === 200) {
                this.submitmsg = "Deleted user!";
            } else {
                if(json.msg)
                    this.submitmsg = json.msg;
                else
                    this.submitmsg = "Failed to delete user!";
            }
        },
        editUser: async function(){
            const id = this.user._id;
            delete this.user._id;

            this.finished = true;
            const options = {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({_id: id, data: "{$set: "+ this.user + "}"})
            };

            const response = await fetch('/api/yuki/user', options);
            const json = await response.json();
            console.log(json);
            if (json.status === 200) {
                this.submitmsg = "Successfully updated user!";
            } else {
                if(json.msg)
                    this.submitmsg = json.msg;
                else
                    this.submitmsg = "Failed to update user!";
            }
        }
    }
});