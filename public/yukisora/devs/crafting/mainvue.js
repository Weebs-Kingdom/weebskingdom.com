var attack = new Vue({
    el: '#recipe',
    data: {
        show: false,
        recipes: undefined,
        submitmsg: "",
        items: [],

        editingRecipe: "",
        editMode: false,
        creatMode: false,

        rItems: [],
        rItemCount: [],
        rCommonRecipe: false,
        rHammerPunches: 10,
        rResult: "",
    },
    created: async function () {
        this.recipes = await this.loadRecipes();
        this.items = await this.loadItems();
        console.log(this.recipes);
    },
    methods: {
        loadRecipes: async function () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };

            const response = await fetch('/api/yuki/recipe', options);
            const json = await response.json();
            if (json.status === 200) {
                return json.data;
            } else {
                return undefined;
            }
        },
        loadItems: async function () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };
            const response = await fetch('/api/yuki/items', options);
            const json = await response.json();
            if (json.status == 200) {
                return json.data;
            } else {
                return [];
            }
        },
        deleteRecipe: async function (id) {
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

            const response = await fetch('/api/yuki/recipe', options);
            const json = await response.json();
            if (json.status === 200) {
                this.attacks = await this.loadAttack();
                this.searchFc();
            }
        },
        clckItem: function (id, add, amount) {
            var item = undefined;
            for (let i = 0; i < this.rItems.length; i++) {
                if (this.rItems[i]._id == id) {
                    this.rItems.splice(i, 1);
                    this.rItemCount.splice(i, 1);
                }
            }
            if (add) {
                for (const e of this.items) {
                    if (e._id == id) {
                        item = e;
                        break;
                    }
                }
                if (item != null && item != undefined) {
                    this.rItems.push(item);
                    this.rItemCount[this.rItems.length - 1] = amount;
                }
            }
        },
        selectResult: function (id){
            var item = undefined;
            for (const e of this.items) {
                if (e._id == id) {
                    item = e;
                    break;
                }
            }
            if (item != null && item != undefined) {
                this.rResult = item;
            }
        },
        closeEd: function () {
            this.show = false;
        },
        edit: function (id) {
            this.submitmsg = "";
            this.modeinfo = "Editing mode";
            this.editingRecipe = id;
            this.show = true;
            this.editMode = true;
            this.creatMode = false;
            this.setupEdit(id);
        },
        create: function () {
            this.submitmsg = "";
            this.modeinfo = "Creator mode";
            this.editingRecipe = "";
            this.show = true;
            this.editMode = false;
            this.creatMode = true;
            this.setupCreate();
        },
        setupCreate: function () {
            this.rItems = [];
            this.rItemCount = [];
            this.rCommonRecipe = false;
            this.rHammerPunches = 10;
            this.rResult = "";
        },
        setupEdit: function (id) {
            var recipe = this.recipes.filter(el => el._id == id)[0];

            this.rItems = recipe.items;
            this.rItemCount = recipe.itemCount;
            this.rCommonRecipe = recipe.commonRecipe;
            this.rHammerPunches = recipe.hammerPunches;
            this.rResult = recipe.result;
        },
        submit: async function () {
            //todo: check if all are set correctly
            location.replace("#" + "msg");
            var packedAttack = {
                items: this.rItems,
                itemCount: this.rItemCount,
                commonRecipe: this.rCommonRecipe,
                hammerPunches: this.rHammerPunches,
                result: this.rResult._id
            };

            console.log(packedAttack);

            if (this.editMode) {
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

                const response = await fetch('/api/yuki/recipe', options);
                const json = await response.json();
                if (json.status === 200) {
                    this.attacks = await this.loadRecipes();
                    this.submitmsg = "Successfully updated recipe!";
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
                    body: JSON.stringify(packedAttack)
                };

                const response = await fetch('/api/yuki/recipe', options);
                const json = await response.json();
                if (json.status === 200) {
                    this.attacks = await this.loadRecipes();
                    this.submitmsg = "Successfully created recipe!";
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

Vue.component('item', {
    template: `
   <div style="display: inline-table">
   <input v-if="wAmount" style="display: table-cell" type="checkbox" v-model.checked="checked" @change="change()"/>
   <a style="display: table-cell">{{item.itemName}}</a>
   <button v-if="!wAmount" style="display: table-cell" @click="clck()">Select</button>
   <input v-if="wAmount" style="display: table-cell" type="number" v-model.number="amount" @change="change()" @keyup="change()"/>
</div>
`,
    data: function () {
        return {
            amount: 1,
            checked: false
        }
    },
    created: function () {
        if (this.isSelected()) {
            this.amount = this.selected.filter(e => e._id == this.item._id)[0].amount;
            if (!this.amount || this.amount == undefined || this.amount === 0)
                this.amount = 1;
        }
    },
    props: ['item', 'selected', 'wAmount'],
    methods: {
        change: function () {
            if(this.wAmount){
                this.$emit('clicked', this.item._id, this.checked, this.amount);
            }
        },
        isSelected: function () {
            for (const el of this.selected) {
                if (this.item._id == el._id) {
                    this.checked = true;
                    return true;
                }
            }
            return false;
        },
        clck: function (){
            this.$emit('clicked', this.item._id);
        }
    }
});

Vue.component('recipe', {
    template: `
    <div class="content">
    <h1>{{recipe.result.itemName}}</h1>
    <a>Hammer punches: {{recipe.hammerPunches}}</a>
    <a v-if="recipe.commonRecipe">This is a common recipe!</a>
    <a v-else>This is not a common recipe!</a>
    <div v-for="(item, index) of recipe.items">
        <a>{{item.itemName}}</a>
        <a>Needed: {{item.amount}}</a>
    </div>
    <button class="material-icons" @click="$emit('edit', recipe._id)">edit</button>
    <button style="margin-left: 1vmin" class="denyBtn material-icons" @click="$emit('delete')">delete</button>
    </div>
    `,
    props: ['recipe']
});