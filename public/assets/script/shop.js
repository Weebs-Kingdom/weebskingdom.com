Vue.component('product', {
    template: `
<div class="shopItem"> 
    <h1>{{item.name}}</h1> 
    <div class="des">
        <div><img v-if="item.image != undefined && item.image != ''" :src="item.image"> <a v-else>No product image</a></div>
        <div>{{item.description}}</div>
        <div v-if="item.stock === 0"><a">Limited</a> {{item.stock}}</div>
    </div> 
    <button class="material-icons" v-on:click="$emit('add',item._id)">add_shopping_cart</button> 
   {{item.price}} <img class="weboos" src="/assets/img/weboos.png">
 </div> 
</div>`,
    props: ['item']
})

var shop = new Vue({
    el: '#shop',
    data: {
        shop: undefined,
        shoppingcart: undefined,
        complexCart: undefined
    },
    created: async function () {
        this.shop = await this.loadShop();
        this.shoppingcart = JSON.parse(getCookie("cart"));

        if (this.shoppingcart == undefined) {
            this.shoppingcart = [];
        }
        this.loadCart();
    },
    methods: {
        loadShop: async function () {
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
                return json.data;
            } else {
                return undefined;
            }
        },
        addToCart: function (id) {
            for (let i = 0; i < this.shop.length; i++) {
                if (this.shop[i]._id === id) {
                    var added = false;
                    for (let j = 0; j < this.shoppingcart.length; j++) {
                        if (this.shoppingcart[j]._id === id) {
                            added = true;
                            var psh = this.shoppingcart[j];
                            psh.amount = psh.amount + 1;
                            this.shoppingcart.splice(j, 1, psh);

                            psh = this.complexCart[j];
                            psh.amount = psh.amount + 1;
                            this.complexCart.splice(j, 1, psh);
                        }
                    }
                    if (!added) {
                        this.shoppingcart.push({_id: this.shop[i]._id, amount: 1});
                        var psh = this.shop[i];
                        psh.amount = 1;
                        this.complexCart.push(psh);
                    }
                }
            }
            this.saveShop();
        },
        saveShop: function () {
            setCookie("cart", JSON.stringify(this.shoppingcart), 10);
        },
        deleteFromCart: function (id) {
            for (let i = 0; i < this.shoppingcart.length; i++) {
                if (this.shoppingcart[i]._id === id) {
                    this.shoppingcart.splice(i, 1);
                    this.complexCart.splice(i, 1);
                    this.saveShop();
                    return;
                }
            }
        },
        deleteOneFromCart: function (id) {
            for (let i = 0; i < this.shoppingcart.length; i++) {
                if (this.shoppingcart[i]._id === id) {
                    var psh = this.shoppingcart[i];
                    psh.amount -= 1;
                    this.shoppingcart.splice(i, 1, psh);

                    psh = this.complexCart[i];
                    psh.amount -= 1;
                    this.complexCart.splice(i, 1, psh);
                    this.saveShop();
                    return;
                }
            }
        },
        loadCart: function () {
            this.complexCart = [];

            for (let i = 0; i < this.shoppingcart.length; i++) {
                for (let j = 0; j < this.shop.length; j++) {
                    if (this.shop[j]._id === this.shoppingcart[i]._id) {
                        var psh = this.shop[j];
                        psh.amount = this.shoppingcart[i].amount;
                        this.complexCart.push(psh);
                        break;
                    }
                }
            }
        }
    }
})

Vue.component('cartitem', {
    template: `<div class="cart-item">
                    <div class="cart-item-description">
                        <div class="img"><img v-if="image != undefined && image != ''" :src="image"><a v-else>No product image</a></div>
                        <div class="name"><a class="cart-item-label">{{name}}</a></div>
                        <div class="amount" style="vertical-align: middle; display: inline-block; text-align: center">
                            <a style="vertical-align: middle" v-on:click="$emit('deleteone',id)"> <i class="material-icons">remove</i> </a>
                            <a class="cart-item-amount">{{amount}}</a>
                            <a style="vertical-align: middle" v-on:click="$emit('add',id)"> <i class="material-icons">add</i> </a>
                        </div>
                        <div class="price">
                            <a class="cart-item-price">{{price}} <img class="weboos" src="/assets/img/weboos.png"></a>
                            <a v-on:click="$emit('delete',id)"><i class="material-icons">delete</i></a>
                        </div>
                    </div>
                 </div>`,
    props: ['amount', 'name', 'price', 'id', 'image']
});

Vue.component('cart', {
    template: '<div class="cart"> <div class="blur" v-if="show"></div> <button class="cart-btn" @click="toggle"> <i class="material-icons">shopping_cart</i></button> <div class="cartitems" v-if="show"> <cartitem v-if="items.length > 0" v-for="item in items" :amount="item.amount" :image="item.image" :name="item.name" :price="item.price" :id="item._id" @add="addToCart" @deleteone="deleteOneFromCart" @delete="deleteFromCart"></cartitem> <p v-if="items.length <= 0">Nothing here</p> </div></div>',
    props: ['items'],
    data() {
        return {show: false}
    },
    methods: {
        addToCart: function (id) {
            this.$emit('add', id);
        },
        deleteOneFromCart: function (id) {
            this.$emit('deleteone', id);
        },
        deleteFromCart: function (id) {
            this.$emit('delete', id);
        },
        toggle: function () {
            if (this.show)
                this.show = false;
            else
                this.show = true;
        }
    }
});