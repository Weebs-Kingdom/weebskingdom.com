var attack = new Vue({
    el: '#attacklist',
    data: {
        attacks: undefined
    },
    created: async function (){
        this.attacks = await this.loadAttack();
    },
    methods: {
        loadAttack: async function () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };

            const response = await fetch('/api/yuki/attacks', options);
            const json = await response.json();
            if(json.status === 200){
                return json.data;
            } else {
                return undefined;
            }
        },
        deleteAttack: async function(id){
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({_id: id})
            };

            const response = await fetch('/api/yuki/attacks', options);
            const json = await response.json();
            if(json.status === 200) {
                this.attacks = await this.loadAttack();
            }
        }
    }
});

Vue.component('attack', {
    template: '<div class="content overlayable"> <div class="overlay" v-if="attack.deleting"><div class="lds-ripple"><div></div><div></div></div></div> <div><h1>{{attack.attackName}}</h1> <div class="static"> <button class="denyBtn" v-on:click="$emit(`delete`,attack._id)">Delete</button> </div></div> </div>',
    props: ['attack']
});