var sitem = new Vue({
    el: "#shopItems",
    data: {
        shopItems: [],
        items: [],
        msg: "",
        show: false,
        modeinfo: "No mode selected",
        editingItem: "",
        editMode: false,
        creatMode: false,

        iParentItem: "",
        iRole: "",
        iRoute: "",
        iName: "",
        iImageUrl: "",
        iDescription: "",
        iPrice: 0,
        iIsStocked: false,
        iStock: 0,
        iRarity: "",
        iCategory: ""
    },
    created: async function () {
        await this.loadShopItems();
        await this.loadItems();
    },
    methods: {
        loadShopItems: async function () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };
            const response = await fetch('/api/shop/items', options);
            const json = await response.json();
            if (json.status === 200) {
                this.shopItems = json.data;
            } else {
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
            if (json.status === 200) {
                this.items = json.data;
            } else {
            }
        },
        create: function () {
            this.msg = "";
            this.modeinfo = "Creator mode";
            this.editingItem = "";
            this.show = true;
            this.editMode = false;
            this.creatMode = true;
            this.setupCreate();
        },
        edit: function (item) {
            this.msg = "";
            this.modeinfo = "Editing mode";
            this.editingItem = item._id;
            this.show = true;
            this.editMode = true;
            this.creatMode = false;
            this.setupEdit(item);
        },
        setupEdit: function (item) {
            if (!item)
                return;

            this.iParentItem = item.connectedItemId;
            this.iRole = item.connectedRole;
            this.iRoute = item.connectedRoute;
            this.iName = item.name;
            this.iImageUrl = item.image;
            this.iDescription = item.description;
            this.iPrice = item.price;
            this.iIsStocked = item.hasStocks;
            this.iStock = item.stock;
            this.iRarity = item.rarity;
            this.iCategory = item.category;
        },
        setupCreate: function () {
            this.iParentItem = "";
            this.iRole = "";
            this.iRoute = "";
            this.iName = "";
            this.iImageUrl = "";
            this.iDescription = "";
            this.iPrice = 0;
            this.iIsStocked = false;
            this.iStock = 0;
            this.iRarity = "";
            this.iCategory = "";
        },
        closeEd: function () {
            this.show = false;
        },
        submit: async function () {
            location.replace("#" + "msg");

            var packedItem = {
                name: this.iName,
                description: this.iDescription,
                price: this.iPrice,
                image: this.iImageUrl,
                rarity: this.iRarity,
                category: this.iCategory,
                hasStocks: this.iIsStocked
            };

            if (this.iIsStocked) {
                packedItem.stock = this.iStock;
            }

            if (this.iRole != "") {
                packedItem.isRole = true;
                packedItem.connectedRole = this.iRole;
            } else {
                packedItem.isRole = false;
            }

            if (this.iRoute != "") {
                packedItem.isRoute = true;
                packedItem.connectedRoute = this.iRoute;
            } else {
                packedItem.isRoute = false;
            }

            if (this.iParentItem != "") {
                packedItem.isItem = true;
                packedItem.connectedItemId = this.iParentItem;
            } else {
                packedItem.isItem = false;
            }


            console.log(packedItem);

            if (this.editMode) {
                var pack = {
                    _id: this.editingItem,
                    data: packedItem
                }

                const options = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(pack)
                };

                const response = await fetch('/api/shop/items', options);
                const json = await response.json();
                if (json.status === 200) {
                    await this.loadShopItems();
                    this.msg = "Successfully updated shop item!";
                    return json.message;
                } else {
                    this.msg = "An error occurred";
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
                    body: JSON.stringify(packedItem)
                };

                const response = await fetch('/api/shop/items', options);
                const json = await response.json();
                if (json.status === 200) {
                    await this.loadShopItems();
                    this.msg = "Successfully created shop item!";
                    return json.message;
                } else {
                    this.msg = "An error occurred";
                    console.log(response);
                    return undefined;
                }
            }
        },
        deleteItem: async function (id) {
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

            const response = await fetch('/api/shop/items', options);
            const json = await response.json();
            if (json.status === 200) {
                await this.loadShopItems();
            }
        },
        selectItem: function (item) {
            if (!item) {
                this.iParentItem = "";
                return;
            }
            this.iParentItem = item._id;
            this.iName = item.itemName;
            this.iImageUrl = item.itemImageURL;
            this.iDescription = item.itemDescription;
            this.iRarity = item.itemRarity;
            this.iRole = item.itemRoleConnection;
        },
        isSelected: function (item) {
            return item._id == this.iParentItem;
        }
    }
});

Vue.component('shop-item', {
    template: `
   <div class="content">
   <h1>{{item.name}}</h1>
    <div>
        <div style="display: inline-block; width: 100%; text-align: center; margin-bottom: 1.5vmin;">
        <a style="">Rarity: {{item.rarity}}</a>  |  <a style="">Description: {{item.description}}</a> | <a style="">Price: {{item.price}}</a>
        <br>
        <a v-if="item.hasStocks">{{item.stock}}</a>
        <a v-else>This item has no stocks</a>
        <div style="display: inline-flex">
            <button class="material-icons" @click="$emit('edit',item)">edit</button> 
            <button style="margin-left: 1vmin" class="denyBtn material-icons" @click="$emit('delete',item._id)">delete</button>
        </div>
    </div>
    </div>
   `,
    props: ['item']
});

Vue.component('item', {
    template: `
<div class="content">
<div>
    <h1>{{item.itemName}}</h1>
    <div>
        <div style="display: inline-block; width: 100%; text-align: center; margin-bottom: 1.5vmin;">
        <a style="">Rarity: {{item.itemRarity}}</a>  |  <a style="">Description: {{item.itemDescription}}</a>
        <br>
        <button v-if="!selected" @click="select(false)">Select</button>
            <button v-else @click="select(true)" class="denyBtn">Unselect</button>
    </div>
</div>
`,
    props: ['item', 'selected'],
    methods: {
        select: function (un) {
            if (un)
                this.$emit('select', null);
            else
                this.$emit('select', this.item);
        }
    }
});