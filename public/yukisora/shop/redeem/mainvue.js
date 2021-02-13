var redeem = new Vue({
    el: '#redeem',
    data: {
        code: "",
        message: "",
        clicked: false
    },
    methods: {
        submit: async function (){
            if(this.clicked)
                return;

            this.clicked = true;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({code: this.code})
            };
            var json = {};
            var oke = false;
            await fetch('/api/shop/redeem', options).then(res => res.json())
                .then(res => {
                    json = res;
                    return res;
                })
                .catch(err => console.log(err));
            if (json === undefined) {
                this.message = "While connection to the server an error occurred";
                return;
            }
            if(json.status === 200){
                submitBtn.play();
                this.message = "The items are now activated and you can find them in your account";
                oke = true;
            } else if(json.status === 400 ||json.status === 401){
                this.message = json.message;
            } else {
                this.message = "While connection to the server a error occurred";
            }

            if(oke){
                setTimeout(() => {
                    this.complexCart = [];
                    this.shoppingcart = [];
                    this.saveShop();
                }, 4000)
            }
        }
    }
});

var pathEls = $(".check");
for (var i = 0; i < pathEls.length; i++) {
    var pathEl = pathEls[i];
    var offset = anime.setDashoffset(pathEl);
    pathEl.setAttribute("stroke-dashoffset", offset);
}

var submitBtn = anime.timeline({
    autoplay: false
});

submitBtn
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