var it = new Vue({
    el: '#item',
    data: {
        itemName: "",
        itemRarity: "normal",
        itemImageURL: "",
        itemDescription: "",
        itemType: "",
        itemCanFound: false,
        isItemCookable: false,
        cooksInto: null,
        itemRoleConnection: "",
        canSell: false,

        msg: "",

        items: [],

        editMode: false,
        editingItem: "",
        show: false,
        modeInfo: ""
    },
    created: async function () {
        this.items = await this.loadItems();
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const edit = urlParams.get('edit');
        if (edit) {
            this.edit(edit);
            this.show = true;
        }
    },
    methods: {
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
                this.msg += json.message;
                return [];
            }
        },
        edit: function (id) {
            var item = undefined;
            for (const e of this.items) {
                if (e._id == id) {
                    item = e;
                    break;
                }
            }
            if (item != undefined) {
                this.modeInfo = "Edit mode";
                this.editMode = true;
                this.editingItem = id;
                this.buildEdit(item);
                this.show = true;
            } else {
                this.msg = "Item load failed!";
            }
        },
        create: function () {
            this.modeInfo = "Create mode";
            this.editMode = false;
            this.editingItem = "";
            this.clear();
            this.show = true;
        },
        del: async function (id) {
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
            const response = await fetch('/api/yuki/items', options);
            const json = await response.json();
            if (json.status == 200) {
                this.msg = "Removed!";
            } else {
                this.msg += json.message;
            }
        },
        clear: function () {
            this.itemName = "";
            this.itemRarity = "normal";
            this.itemImageURL = "";
            this.itemDescription = "";
            this.itemType = "";
            this.itemCanFound = false;
            this.isItemCookable = false;
            this.cooksInto = null;
            this.itemRoleConnection = "";
            this.canSell = false;
        },
        buildEdit: function (item) {
            this.itemName = item.itemName;
            this.itemRarity = item.itemRarity;
            this.itemImageURL = item.itemImageURL;
            this.itemDescription = item.itemDescription;
            this.itemType = item.itemType;
            this.itemCanFound = item.itemCanFound;
            this.isItemCookable = item.isItemCookable;
            this.cooksInto = item.cooksInto;
            this.itemRoleConnection = item.itemRoleConnection;
            this.canSell = item.canSell;
        },
        submit: async function () {
            if (this.isItemCookable && this.cooksInto == null) {
                this.msg = "If item is cookable, you should select a item!";
                return;
            }

            if (!this.isItemCookable && this.cooksInto != null) {
                this.msg = "If cooks into item is selected, the item should be cookable!";
                return;
            }

            var pack = {
                itemName: this.itemName,
                itemRarity: this.itemRarity,
                itemImageURL: this.itemImageURL,
                itemDescription: this.itemDescription,
                itemType: this.itemType,
                itemCanFound: this.itemCanFound,
                isItemCookable: this.isItemCookable,
                cooksInto: this.cooksInto,
                itemRoleConnection: this.itemRoleConnection,
                canSell: this.canSell
            }

            console.log(pack);
            var options = {};
            var json = {};
            if (this.editMode) {
                json.data = pack;
                json._id = this.editingItem;
                options = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(json)
                }
            } else {
                json = pack;
                options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(json)
                }
            }

            const response = await fetch('/api/yuki/items', options);
            if (response) {
                const js = await response.json();

                if (js.status == 200) {
                    this.closeEd();
                    this.msg = "Successfully updated/added item";
                } else
                    this.msg = "An error occurred! " + JSON.stringify(js);
            } else
                this.msg = "An error occurred! Fetching wasnt possible";

            this.items = await this.loadItems();
        },
        selectItem: function (id) {
            this.cooksInto = id;
        },
        closeEd: function () {
            this.show = false;
            this.modeInfo = "NIX";
            this.editMode = false;
            this.editingItem = "";
            this.msg = "";
            this.clear();
        },
        isSelected: function (item) {
            return item._id == this.cooksInto;
        }
    }
});

Vue.component('items', {
    template: `
<div class="content">
<div>
    <h1>{{item.itemName}}</h1>
    <div>
        <div style="display: inline-block; width: 100%; text-align: center; margin-bottom: 1.5vmin;">
        <a style="">Rarity: {{item.itemRarity}}</a>  |  <a style="">Description: {{item.itemDescription}}</a>
        <br>
        <div v-if="edit" style="display: inline-flex">
            <button @click="$emit('edit',item._id)">Edit</button> 
            <button style="margin-left: 1vmin" class="denyBtn material-icons" v-on:click="$emit('delete',item._id)">delete</button>
        </div>
        <div v-else>
            <button v-if="!selected" @click="select(false)">Select</button>
            <button v-if="selected"  @click="select(true)" class="denyBtn">Unselect</button>
        </div>
    </div>
</div>
    `,
    methods: {
        select: function (un) {
            if (un)
                this.$emit('select', null);
            else
                this.$emit('select', this.item._id);
        }
    },
    props: ['item', 'edit', 'selected']
});