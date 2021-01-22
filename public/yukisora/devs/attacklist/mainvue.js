var attack = new Vue({
    el: '#attacklist',
    data: {
        attacks: undefined,
        filteredAttacks: undefined,
        searchB: "",
        show: false,
        modeinfo: "No mode selected",
        submitmsg: "",

        edetingAttack: "",
        editMode: false,
        creatMode: false,

        closeOnBtn: false,

        types: [
            "normal",
            "psychic",
            "fighting",
            "flying",
            "poison",
            "ground",
            "rock",
            "bug",
            "ghost",
            "steel",
            "fire",
            "water",
            "grass",
            "electric",
            "ice",
            "dragon",
            "dark",
            "fairy"
        ],

        abaseDmg: 10,
        aattackName: "undefined",
        alevel: 1,
        amaxUsage: 20,
        astatusEffect: "",
        aattackType: "normal",
    },
    created: async function () {
        this.attacks = await this.loadAttack();
        this.filteredAttacks = this.attacks;

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const edit = urlParams.get('edit');
        const closeOnBtn = urlParams.get('c');
        const createMode = urlParams.get('create');
        if (edit) {
            this.edit(edit);
        }
        if(closeOnBtn){
            this.closeOnBtn = true;
        }
        if(createMode){
            this.create();
        }
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
            if (json.status === 200) {
                return json.data;
            } else {
                return undefined;
            }
        },
        deleteAttack: async function (id) {
            this.closeEd();
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
            if (json.status === 200) {
                this.attacks = await this.loadAttack();
                this.searchFc();
            }
        },
        searchFc: function () {
            this.filteredAttacks = searchFc(this.searchB, undefined, this.attacks, "attacks");
        },
        edit: function (id) {
            this.submitmsg = "";
            this.modeinfo = "Editing mode";
            this.edetingAttack = id;
            this.show = true;
            this.editMode = true;
            this.creatMode = false;
            this.setupEdit(id);
        },
        create: function () {
            this.submitmsg = "";
            this.modeinfo = "Creator mode";
            this.edetingAttack = "";
            this.show = true;
            this.editMode = false;
            this.creatMode = true;
            this.setupCreate();
        },
        closeEd: function () {
            if(this.closeOnBtn){
                window.close();
            }
            this.show = false;
        },
        setupCreate: function () {
            this.abaseDmg = 10;
            this.aattackName = "";
            this.alevel = 1;
            this.amaxUsage = 20;
            this.astatusEffect = "";
            this.aattackType = "normal";
        },
        setupEdit: function (id) {
            var attack = this.attacks.filter(el => el._id == id)[0];

            this.abaseDmg = attack.baseDmg;
            this.aattackName = attack.attackName;
            this.alevel = attack.level;
            this.amaxUsage = attack.maxUsage;
            this.astatusEffect = attack.statusEffect;
            this.aattackType = attack.attackType;
        },
        submit: async function (){
            var packedAttack = {
                baseDmg: this.abaseDmg,
                attackName: this.aattackName,
                level: this.alevel,
                maxUsage: this.amaxUsage,
                statusEffect: this.astatusEffect,
                attackType: this.aattackType
            };

            console.log(packedAttack);

            if(this.editMode){
                var pack = {
                    _id: this.edetingAttack,
                    data: packedAttack
                }

                const options = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(pack)
                };

                const response = await fetch('/api/yuki/attacks', options);
                const json = await response.json();
                if (json.status === 200) {
                    this.attacks = await this.loadAttack();
                    this.submitmsg = "Successfully updated attack!";
                    if(this.closeOnBtn){
                        closeTo();
                    }
                    return json.message;
                } else {
                    this.submitmsg = "An error occurred";
                    console.log(response);
                    if(this.closeOnBtn){
                        closeTo();
                    }
                    return undefined;
                }
            } else if(this.creatMode) {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(packedAttack)
                };

                const response = await fetch('/api/yuki/attacks', options);
                const json = await response.json();
                if (json.status === 200) {
                    this.attacks = await this.loadAttack();
                    this.searchFc();
                    this.submitmsg = "Successfully created attack!";
                    if(this.closeOnBtn){
                        closeTo();
                    }
                    return json.message;
                } else {
                    this.submitmsg = "An error occurred";
                    console.log(response);
                    if(this.closeOnBtn){
                        closeTo();
                    }
                    return undefined;
                }
            }
        }
    }
});


Vue.component('attack', {
    template: '<div class="content"> <div><h1>{{attack.attackName}}</h1> <div style="display: inline-block; width: 100%; text-align: center; margin-bottom: 1.5vmin;"><a style="">Level: {{attack.level}}</a>  |  <a style="">BaseDMG: {{attack.baseDmg}}</a>  |  <a v-if="attack.attackType != undefined && attack.attackType != ``">Type: {{attack.attackType}}</a> <a v-else>No attack type</a></div> <div style="display: inline-flex"><button @click="$emit(`edit`,attack._id)">Edit</button> <button style="margin-left: 1vmin" class="denyBtn material-icons" v-on:click="$emit(`delete`,attack._id)">delete</button></div></div>',
    props: ['attack']
});

function closeTo(){
    setTimeout(function() {
            window.close();
    }, 1000);
}