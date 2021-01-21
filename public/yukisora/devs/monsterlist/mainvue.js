var monster = new Vue({
    el: '#monsterlist',
    data: {
        monsters: undefined,
        attacks: undefined,
        filteredMonsters: undefined,
        searchB: "",
        show: false,
        modeinfo: "No mode selected",
        submitmsg: "",

        editingMonster: "",
        editMode: false,
        creatMode: false,

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

        mname: "undefined",
        minitialLevel: "undefined",
        mimageUrl: "undefined",
        mbaseHp: 20,
        mevolveLvl: 0,
        mshown: false,
        mevolves: [],
        mattacks: [],
        mrarity: "normal",
        mmonsterType: []
    },
    created: async function () {
        this.monsters = await this.loadMonster();
        this.attacks = await this.loadAttacks();
        this.filteredMonsters = this.monsters;

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const edit = urlParams.get('edit');
        if (edit) {
            this.edit(edit);
        }
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
            if (json.status === 200) {

                /*for (const ele of json.data) {
                    if(!ping(ele.imageUrl))
                        ele.imageUrl = undefined;
                }*/

                return json.data;
            } else {
                return undefined;
            }
        },
        loadAttacks: async function () {
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
        deleteMonster: async function (id) {
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
            if (json.status === 200) {
                this.monsters = await this.loadMonster();
            }
        },
        searchFc: function () {
            if (this.searchB.length <= 0) {
                this.filteredMonsters = this.monsters;
                return;
            }

            var scrj = '{' + this.searchB + '}';
            var add = undefined;
            try {
                add = searchMonster(JSON.parse(scrj), this.monsters, this.attacks);
            } catch (e) {
                return;
            }

            var uniqueArray = add.filter(function (item, pos) {
                return add.indexOf(item) == pos;
            });

            this.filteredMonsters = uniqueArray;
        },
        edit: function (id) {
            this.submitmsg = "";
            this.modeinfo = "Editing mode";
            this.editingMonster = id;
            this.show = true;
            this.editMode = true;
            this.creatMode = false;
            this.setupEdit(id);
        },
        create: function (){
            this.submitmsg = "";
            this.modeinfo = "Creator mode";
            this.editingMonster = "";
            this.show = true;
            this.editMode = false;
            this.creatMode = true;
            this.setupCreate();
        },
        closeEd: function () {
            this.show = false;
        },
        setupCreate: function (){
            this.mname = "";
            this.minitialLevel = 1;
            this.mimageUrl = "";
            this.mbaseHp = 0;
            this.mevolveLvl = undefined;
            this.mshown = true;
            this.mevolves = [];
            this.mattacks = [];
            this.mrarity = "normal";
            this.mmonsterType = ["normal"];
        },
        setupEdit: function (id) {
            var mnster = this.monsters.filter(el => el._id == id)[0];

            this.mname = mnster.name;
            this.minitialLevel = mnster.initialLevel;
            this.mimageUrl = mnster.imageUrl;
            this.mbaseHp = mnster.baseHp;
            this.mevolveLvl = mnster.evolveLvl;
            this.mshown = mnster.shown;
            this.mevolves = mnster.evolves;
            this.mattacks = mnster.attacks;
            this.mrarity = mnster.rarity;
            this.mmonsterType = mnster.monsterType;
        },
        clckEv: function (id, add){
            if(add)
                this.mevolves.push(id);
            else
                for (let i = 0; i < this.mevolves; i++) {
                    if(this.mevolves[i]._id == id)
                        this.mevolves.splice(i, 1);
                }
        },
        clckType: function (id, add){
            if(add)
                this.mmonsterType.push(id);
            else
                for (let i = 0; i < this.mmonsterType; i++) {
                    if(this.mmonsterType[i] == id)
                        this.mmonsterType.splice(i, 1);
                }
        },
        clckAttack: function (id, add){
            if(add)
                this.mattacks.push(id);
            else
                for (let i = 0; i < this.mattacks; i++) {
                    if(this.mattacks[i]._id == id)
                        this.mattacks.splice(i, 1);
                }
        },
        submit: async function (){
            var packedMonster = {
                name: this.mname,
                initialLevel: this.minitialLevel,
                imageUrl: this.mimageUrl,
                baseHp: this.mbaseHp,
                evolveLvl: this.mevolveLvl,
                shown: this.mshown,
                evolves: this.mevolves,
                attacks: this.mattacks,
                rarity: this.mrarity,
                monsterType: this.mmonsterType
            };

            console.log(packedMonster);

            if(this.editMode){
                var pack = {
                    _id: this.editingMonster,
                    data: packedMonster
                }

                const options = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(pack)
                };

                const response = await fetch('/api/yuki/monsters', options);
                const json = await response.json();
                if (json.status === 200) {
                    this.monsters = await this.loadMonster();
                    this.submitmsg = "Successfully created monster!";
                    return json.message;
                } else {
                    return undefined;
                }
            } else if(this.creatMode) {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(packedMonster)
                };

                const response = await fetch('/api/yuki/monsters', options);
                const json = await response.json();
                if (json.status === 200) {
                    this.monsters = await this.loadMonster();
                    this.submitmsg = "Successfully updated monster!";
                    return json.message;
                } else {
                    return undefined;
                }
            }
        }
    }
});

function searchMonster(inJson, monsters, attacks) {
    var add = [];

    for (const el of Object.keys(inJson)) {
        if (el === "attacks") {
            for (const ee of inJson[el]) {
                add = add.concat(searchAttacks(ee, monsters, attacks));
            }
        } else if (el === "evolves") {
            for (const ee of inJson[el]) {
                var fnd = searchMonster(ee, monsters, attacks);
                for (const eee of fnd) {
                    add = add.concat(monsters.filter(ea => ea.evolves.includes(eee._id)));
                }
            }
        } else {
            if (isNumber(inJson[el], monsters, el)) {
                add = add.concat(isNumber(inJson[el], monsters, el));
            } else {
                add = add.concat(monsters.filter(e => e[el].toLowerCase() == inJson[el].toLowerCase()));
            }
        }
    }
    return add;
}

function searchAttacks(inJson, monsters, attacks) {
    var add = [];

    for (const el of Object.keys(inJson)) {
        var fnd;
        if (isNumber(inJson[el], attacks, el)) {
            fnd = isNumber(inJson[el], attacks, el);
        } else {
            fnd = attacks.filter(er => er[el].toLowerCase() == inJson[el].toLowerCase());
        }
        for (const ele of fnd) {
            add = add.concat(monsters.filter(e => e.attacks.includes(ele._id)));
        }
    }
    return add;
}

function isNumber(num, li, param) {
    if (Number.isFinite(num)) {
        return li.filter(ele => ele[param] === num);
    } else if (num.startsWith('$')) {
        var nu = num.substring(1);
        var wds = nu.split(':');

        if (Number.parseInt(wds[1])) {
            switch (wds[0]) {
                case '>':
                    return li.filter(ele => ele[param] > Number.parseInt(wds[1]));
                case '<':
                    return li.filter(ele => ele[param] < Number.parseInt(wds[1]));
                case "!":
                    return li.filter(ele => ele[param] !== Number.parseInt(wds[1]));
            }
        }
    } else {
        return undefined;
    }
}

Vue.component('monster', {
    template: '<div class="content"> <div class="overlay" v-if="monster.deleting"><div class="lds-ripple"><div></div><div></div></div></div> <div><h1>{{monster.name}}</h1> <div class="static"> <div class="des"><img v-if="monster.imageUrl != undefined && monster.imageUrl != ``" :src="monster.imageUrl"> <a v-else>No monster image</a></div> <div style="display: inline-flex"><button @click="$emit(`edit`,monster._id)">Edit</button> <button style="margin-left: 1vmin" class="denyBtn material-icons" v-on:click="$emit(`delete`,monster._id)">delete</button></div></div></div> </div>',
    props: ['monster']
});

Vue.component('evolves', {
   template: `
   <div>
   <input type="checkbox" :checked="isSelected()" @click="change($event.target.checked)"/>
   <a>{{ev.name}}</a>
</div>
   `,
   props: ['ev', 'selected'],
    methods: {
       change: function (bl){
           this.$emit('clicked', this.ev._id, bl);
       },
        isSelected: function (){
            for (const el of this.selected) {
                if(this.ev._id == el)
                    return true;
            }
            return false;
        }
    }
});

Vue.component('attacks', {
    template: `
   <div style="display: table-row">
   <input style="display: table-cell" type="checkbox" :checked="isSelected()" @click="change($event.target.checked)"/>
        <a style="display: table-cell">{{ev.attackName}}</a> <a style="display: table-cell">Level: {{ev.level}}</a> <a style="display: table-cell">BaseDMG: {{ev.baseDmg}}</a>
   </div>
   `,
    props: ['ev', 'selected'],
    methods: {
        change: function (bl){
            this.$emit('clicked', this.ev._id, bl);
        },
        isSelected: function (){
            for (const el of this.selected) {
                if(this.ev._id == el)
                    return true;
            }
            return false;
        }
    }
});

Vue.component('types', {
    template: `
   <div>
   <input type="checkbox" :checked="isSelected()" @click="change($event.target.checked)"/>
   <a>{{ev}}</a>
</div>
   `,
    props: ['ev', 'selected'],
    methods: {
        change: function (bl){
            this.$emit('clicked', this.ev, bl);
        },
        isSelected: function (){
            for (const el of this.selected) {
                if(this.ev == el)
                    return true;
            }
            return false;
        }
    }
});