Vue.component('product', {
    template: '<div class="shopItem"> <h1>{{item.name}}</h1> <div> <div class="des"><img v-if="item.image != undefined && item.image != ``" :src="item.image"> <a v-else>No product image</a></div> <div class="des"><a>Description</a> {{item.description}}</div> <div v-if="item.hasStocks" class="des"><a>Stock</a> {{item.stock}}</div> <div class="des"><a>Price</a> {{item.price}}</div> <button class="cartbtn">Add to cart</button> </div> </div>',
    props: ['item']
})

var shop = new Vue({
    el: '#shop',
    data: {
        shop: undefined
    },
    created: async function (){
        this.shop = await this.loadShop()
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
            if(json.status === 200){
                return json.data;
            } else {
                return undefined;
            }
        }
    }
})