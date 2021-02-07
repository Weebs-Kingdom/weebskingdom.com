var attacks = [];
var monsters = [];

var monster = new Vue({
    el: '#monsterlist',
    data: {
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
        await loadMonsters()
        await loadAttacks()

        this.filteredMonsters = monsters;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const edit = urlParams.get('edit');
        if (edit) {
            this.edit(edit);
        }
    },
    methods: {
        deleteMonster: async function (id) {
            var answer = window.confirm("Delete?");
            if (!answer)
                return;

            this.closeEd();
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
                await loadMonsters();
                this.searchFc();
            }
        },
        searchFc: function () {
            this.filteredMonsters = searchFc(this.searchB, monsters, attacks, "monster");
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
        create: function () {
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
        setupCreate: function () {
            this.mname = "";
            this.minitialLevel = 1;
            this.mimageUrl = "";
            this.mbaseHp = 0;
            this.mevolveLvl = undefined;
            this.mshown = true;
            this.mevolves = [];
            this.mattacks = [];
            this.mrarity = "";
            this.mmonsterType = ["normal"];
        },
        setupEdit: function (id) {
            var mnster = monsters.filter(el => el._id == id)[0];

            this.mname = mnster.name;
            this.minitialLevel = mnster.initialLevel;
            this.mimageUrl = mnster.imageUrl;
            this.mbaseHp = mnster.baseHp;
            this.mevolveLvl = mnster.evolveLvl;
            this.mshown = mnster.shown;
            this.mevolves = mnster.evolves;
            this.mattacks = mnster.attacks;
            if(!mnster.attacks)
                this.mattacks = [];
            else {
                var natts = [];
                for (let i = 0; i < this.mattacks.length; i++) {
                    natts[i] = {};
                    natts[i].attack = this.mattacks[i]._id;
                    natts[i].level = this.mattacks[i].level;
                }
                this.mattacks = natts;
            }
            this.mrarity = mnster.rarity;
            this.mmonsterType = mnster.monsterType;
        },
        clckEv: function (id, add) {
                for (let i = 0; i < this.mevolves.length; i++) {
                    if (this.mevolves[i] == id)
                        this.mevolves.splice(i, 1);
                }
            if (add)
                this.mevolves.push(id);
        },
        clckType: function (id, add) {
                for (let i = 0; i < this.mmonsterType.length; i++) {
                    if (this.mmonsterType[i] == id)
                        this.mmonsterType.splice(i, 1);
                }
            if (add)
                this.mmonsterType.push(id);
        },
        clckAttack: function (id, add, lvl) {
            for (let i = 0; i < this.mattacks.length; i++) {
                if (this.mattacks[i]._id == id || this.mattacks[i].attack == id) {
                    this.mattacks.splice(i, 1);
                }
            }
            if (add) {
                const a = {attack: id, level: lvl};
                this.mattacks.push(a);
            }
        },
        editAttack: function (id) {
            var win = window.open("/yukisora/devs/attacklist?edit=" + id + "&c=true", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=auto,height=auto");
            win.onunload = async function () {
                if (this.attack) {
                    await loadAttacks();
                    monster.$forceUpdate();
                }
            };
        },
        addAttack: function () {
            var win = window.open("/yukisora/devs/attacklist?create=true&c=true", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=auto,height=auto");
            win.onunload = async function () {
                if (this.attack) {
                    await loadAttacks();
                    monster.$forceUpdate();
                }
            };
        },
        submit: async function () {
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

            if (this.editMode) {
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
                    await loadMonsters();
                    this.submitmsg = "Successfully updated monster!";
                    return json.message;
                } else {
                    this.submitmsg = "An error occurred";
                    console.log(response);
                    return undefined;
                }
            } else if (this.creatMode) {
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
                    await loadMonsters();
                    this.searchFc();
                    this.submitmsg = "Successfully created monster!";
                    return json.message;
                } else {
                    this.submitmsg = "An error occurred";
                    console.log(response);
                    return undefined;
                }
            }
        }
    }
});

Vue.component('monster', {
    template: '<div class="content"><div><h1>{{monster.name}}</h1> <div class="static"> <div class="des"><img v-if="monster.imageUrl != undefined && monster.imageUrl != ``" :src="monster.imageUrl"> <a v-else>No monster image</a></div> <div style="display: inline-flex"><button @click="$emit(`edit`,monster._id)">Edit</button> <button style="margin-left: 1vmin" class="denyBtn material-icons" v-on:click="$emit(`delete`,monster._id)">delete</button></div></div></div> </div>',
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
        change: function (bl) {
            this.$emit('clicked', this.ev._id, bl);
        },
        isSelected: function () {
            for (const el of this.selected) {
                if (this.ev._id == el)
                    return true;
            }
            return false;
        }
    }
});

Vue.component('attacks', {
    template: `
   <div style="display: table-row">
   <input style="display: table-cell" type="checkbox" v-model.checked="checked" @change="change()"/>
        <a style="display: table-cell">{{ev.attackName}}</a> 
        <div style="display: table-cell"><a>Level: </a> <input type="number" v-model.number="lvl" @change="change()" @keyup="change()"></div> 
        <a style="display: table-cell">BaseDMG: {{ev.baseDmg}}</a>
        <button class="material-icons" v-on:click="edit">edit</button>
   </div>
   `,
    data: function (){
      return {
          lvl: 1,
          checked: false
      }
    },
    created: function (){
        if(this.isSelected()){
            this.lvl = this.selected.filter(e => e.attack == this.ev._id)[0].level;
            if(!this.lvl || this.lvl == undefined || this.lvl === 0)
                this.lvl = 1;
        }
    },
    props: ['ev', 'selected'],
    methods: {
        change: function () {
            this.$emit('clicked', this.ev._id, this.checked, this.lvl);
        },
        isSelected: function () {
            for (const el of this.selected) {
                if (this.ev._id == el.attack) {
                    this.checked = true;
                    return true;
                }
            }
            return false;
        },
        edit: async function () {
            await this.$emit('edit', this.ev._id);
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
        change: function (bl) {
            this.$emit('clicked', this.ev, bl);
        },
        isSelected: function () {
            for (const el of this.selected) {
                if (this.ev == el)
                    return true;
            }
            return false;
        }
    }
});

async function loadAttacks() {
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
        attacks = json.data;
    } else {
        return undefined;
    }
}

async function loadMonsters() {
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
        monsters = json.data;
    } else {
        return undefined;
    }
}