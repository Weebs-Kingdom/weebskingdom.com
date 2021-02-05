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
   {{item.price}} 宅
 </div> 
</div>`,
    props: ['item']
})

var shop = new Vue({
    el: '#shop',
    data: {
        shop: undefined,
        shoppingcart: undefined,
        complexCart: undefined,
        itemsTotal: 0,
        checkoutMessage: "",
        checkedButton: false
    },
    created: async function () {
        this.shop = await this.loadShop();
        this.shoppingcart = JSON.parse(getCookie("cart"));
        if (this.shoppingcart == undefined) {
            this.shoppingcart = [];
        }
        this.loadCart();
    },
    watch: {
        checkoutMessage: function() {
            try {
                var textWrapper = document.querySelector('.ml11 .letters');
                textWrapper.innerHTML = this.checkoutMessage;
                textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");

                var message = anime.timeline({
                    autoplay: false
                });

                message
                    .add({
                        targets: '.ml11 .line',
                        scaleY: [0,1],
                        opacity: [0.5,1],
                        easing: "easeOutExpo",
                        duration: 700
                    })
                    .add({
                        targets: '.ml11 .line',
                        translateX: [0, document.querySelector('.ml11 .letters').getBoundingClientRect().width + 10],
                        easing: "easeOutExpo",
                        duration: 700,
                        delay: 100
                    }).add({
                    targets: '.ml11 .letter',
                    opacity: [0,1],
                    easing: "easeOutExpo",
                    duration: 5000,
                    offset: '-=775',
                    delay: (el, i) => 34 * (i+1)
                }).add({
                    targets: '.ml11',
                    opacity: 0,
                    duration: 1000,
                    easing: "easeOutExpo",
                    delay: 1000
                });
                message.play();
            } catch (e){
            }
        }
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
            this.itemsTotal++;
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
                    this.itemsTotal -= this.shoppingcart[i].amount;
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
                    if(psh.amount <= 1){
                        return;
                    }
                    psh.amount -= 1;
                    this.shoppingcart.splice(i, 1, psh);

                    psh = this.complexCart[i];
                    this.itemsTotal -= 1;
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
                        this.itemsTotal += this.shoppingcart[i].amount;
                        psh.amount = this.shoppingcart[i].amount;
                        this.complexCart.push(psh);
                        break;
                    }
                }
            }
        },
        checkout: async function (){
            if(this.itemsTotal <=0){
                this.checkoutMessage = "You have no item in your cart";
                return;
            }

            if(this.checkedButton)
                return
            else
                this.checkedButton = true;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({cart: this.shoppingcart})
            };
            var json = {};
            var oke = false;
            await fetch('/api/shop/checkout', options).then(res => res.json())
                .then(res => {
                    json = res;
                    return res;
                })
                .catch(err => console.log(err));
            if (json === undefined) {
                this.checkoutMessage = "While connection to the server an error occurred";
                return;
            }

            if(json.status === 200){
                checkoutBtn.play();
                setTimeout(() => {
                    this.checkoutMessage = "The items are now activated and you can find them in your account";
                }, 4000);
                oke = true;
            } else if(json.status === 400 ||json.status === 401){
                this.checkoutMessage = json.message;
            } else {
                this.checkoutMessage = "While connection to the server a error occurred";
            }

            if(oke){
                setTimeout(() => {
                    this.complexCart = [];
                    this.shoppingcart = [];
                    this.saveShop();
                }, 4000)
            }
        },
        getTotal: function (){
            try {
                var it = 0;
                for (const e of this.complexCart) {
                    it += e.price * e.amount;
                }
                return it;
            } catch (e){
            }
        },
    }
})

Vue.component('cartitem', {
    template: `<div class="cart-item">
                    <div class="cart-item-description">
                        <div class="img"><img v-if="image != undefined && image != ''" :src="image"><a v-else>No product image</a></div>
                        <div class="name"><a class="cart-item-label">{{name}}</a></div>
                        <div class="amount unselectable" style="vertical-align: middle; display: inline-block; text-align: center">
                            <a style="vertical-align: middle" v-on:click="$emit('deleteone',id)"> <i class="material-icons">remove</i> </a>
                            <a class="cart-item-amount">{{amount}}</a>
                            <a style="vertical-align: middle" v-on:click="$emit('add',id)"> <i class="material-icons">add</i> </a>
                        </div>
                        <div class="price">
                            <a class="cart-item-price">{{price}} 宅 <i v-on:click="$emit('delete',id)" class="material-icons unselectable">delete</i></a>
                        </div>
                    </div>
                 </div>`,
    props: ['amount', 'name', 'price', 'id', 'image']
});

Vue.component('cart', {
    template: '<div class="cart"> <div class="blur" v-if="show"></div> <button class="cart-btn" @click="toggle"> <i class="material-icons">shopping_cart</i></button> <div class="cartitems" v-if="show"> <cartitem v-if="items.length > 0" v-for="item in items" :amount="item.amount" :image="item.image" :name="item.name" :price="item.price" :id="item._id" @add="addToCart" @deleteone="deleteOneFromCart" @delete="deleteFromCart"></cartitem> <p v-if="items.length <= 0">Nothing here</p> <div style="margin-top: 4vmin; text-align: right"> <a v-if="items.length > 0">Total: {{getTotal()}} 宅</a> <button v-if="items.length > 0" style="margin-left: 2vmin" class="acceptBtn" @click="window.location.assign(`checkout`)">Checkout</button> </div> </div></div>',
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
        getTotal: function (){
            var it = 0;
            for (const e of this.items) {
                it += e.price * e.amount;
            }
            return it;
        },
        toggle: function () {
            if (this.show)
                this.show = false;
            else
                this.show = true;
        }
    }
});

var pathEls = $(".check");
for (var i = 0; i < pathEls.length; i++) {
    var pathEl = pathEls[i];
    var offset = anime.setDashoffset(pathEl);
    pathEl.setAttribute("stroke-dashoffset", offset);
}

var checkoutBtn = anime.timeline({
    autoplay: false
});

checkoutBtn
    .add({
        targets: ".checkoutbtn .text",
        duration: 1,
        opacity: "0"
    })
    .add({
        targets: ".checkoutbtn .button",
        duration: 1300,
        height: 10,
        width: 300,
        backgroundColor: "#2B2D2F",
        border: "0",
        borderRadius: 100
    })
    .add({
        targets: ".checkoutbtn .progress-bar",
        duration: 2000,
        width: 300,
        easing: "linear"
    })
    .add({
        targets: ".checkoutbtn .button",
        width: 0,
        duration: 1
    })
    .add({
        targets: ".checkoutbtn .progress-bar",
        width: 80,
        height: 80,
        delay: 500,
        duration: 750,
        borderRadius: 80,
        backgroundColor: "#71DFBE"
    })
    .add({
        targets: pathEl,
        strokeDashoffset: [offset, 0],
        duration: 200,
        easing: "easeInOutSine"
    });