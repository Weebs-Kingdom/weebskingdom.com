var usr = new Vue({
    el: '#usr',
    data: {
        submitmsg: "",
        field: "",
        dataType: "",

        users: {}
    },
    created: async function () {

    },
    methods: {
        findUser: async function () {
            var data = '{ "' + this.dataType + '" : "' + this.field + '" }';
            console.log(data);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: data
            };

            const response = await fetch('/api/yuki/getAllUsers', options);
            const json = await response.json();
            if (json.status === 200) {
                this.users = json.data;
                console.log(this.users);
                this.submitmsg = "Successfully fetched users";
            } else {
                this.submitmsg = "Can't find shit...";
            }
        },
        loadEdit(id){
            window.location.href= "/admin/user/edit?id=" + id;
        }
    }
});