var monster = new Vue({
    el: '#monsterlist',
    data: {
        monsters: undefined
    },
    created: async function (){
        this.monsters = await this.loadMonster()
    },
    methods: {
        loadMonster: async function () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };

            const response = await fetch('/api/yuki/monsters', options);
            const json = await response.json();
            if(json.status === 200){
                return json.data;
            } else {
                return undefined;
            }
        },
        deleteMonster: async function(id){
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({_id: id})
            };

            const response = await fetch('/api/yuki/monsters', options);
            const json = await response.json();
            if(json.status === 200) {
                this.monsters = await this.loadMonster();
            }
        }
    }
});

Vue.component('monster', {
    template: '<div class="content overlayable"> <div class="overlay" v-if="monster.deleting"><div class="lds-ripple"><div></div><div></div></div></div> <div><h1>{{monster.name}}</h1> <div class="static"> <div class="des"><img v-if="monster.imageUrl != undefined && monster.imageUrl != ``" :src="monster.imageUrl"> <a v-else>No monster image</a></div> <button class="denyBtn" v-on:click="$emit(`delete`,monster._id)">Delete</button> </div></div> </div>',
    props: ['monster']
});