var craft = new Vue({
    el: "#craft",
    data: {
        shown: false,
        count: 1,
        recipes: [],
        inventory: [],
        selected: {
            result: {itemName: "Aluminium I guess",itemImageURL: "https://4.bp.blogspot.com/-XZTDJQBYjnU/V4NgajyzFYI/AAAAAAAAqWg/0asg0I-tzgYtAPTX6kSgKcKrya66P0OxgCKgB/s1600/coole-bilder-mit-apple-logo-im-weltraum-ein-schone-appel-wallpaper-fur-alle-apple-fans-hdhintergrundbilder.com.jpg",},
            hammerPunches: 4,
            items: [{itemName: "Peace of alu", amount: 10}, {itemName: "Ass of alu", amount: 10}, {
                itemName: "V of alu",
                amount: 10
            }]
        },
    },
    created: async function () {
        await this.loadAllCraftingRecipes();
        console.log(this.recipes.length);
    },
    methods: {
        loadAllCraftingRecipes: async function () {
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
                this.recipes = json.data;
            }
        },
        loadCraftingRecipe: async function (id) {
            var recipe = {};
            for (const e of this.recipes) {
                if(e._id == id) {
                    recipe = e;
                    break;
                }
            }
            fill(recipe.hammerPunches);
            this.selected = recipe;
        },
        click: function () {
            progress(this.count);
            if (this.count >= this.selected.hammerPunches) {
                console.log("crafted!")
                this.count = 1;
                showCase();
                return;
            }
            this.count++;
        },
        getAmount: function (id) {
            for (const el of this.inventory) {
                if (el._id == id)
                    return el.amount;
            }
            return 0;
        }
    }
});

let steps = [];

function showCase() {
    showCaseTL.play();
}

var showCaseTL = anime.timeline({
    autoplay: false
});

showCaseTL
    .add({
        targets: ".showcase",
        top: "-500",
        duration: 1
        }
    )
    .add({
        targets: ".showcase",
        top: "50",
        duration: 600,
        easing: "easeInOutSine"
    })
    .add({
        targets: ".showcase",
        top: "-500",
        duration: 600,
        delay: 5000,
        easing: "easeInOutSine"
    })

function fill(num) {
    var c = document.getElementById("steps");

    for (let i = 0; i <= num; i++) {
        var d = document.createElement("div");
        d.setAttribute("class", "step");
        d.id = i;
        c.appendChild(d);
    }
    let els = document.getElementsByClassName('step');
    steps = [];
    Array.prototype.forEach.call(els, (e) => {
        steps.push(e);
        e.addEventListener('click', (x) => {
            progress(x.target.id);
        });
    });
}

function progress(stepNum) {
    let p = stepNum * (100 / craft.selected.hammerPunches);
    document.getElementsByClassName('percent')[0].style.width = `${p}%`;
    steps.forEach((e) => {
        if (e.id === stepNum) {
            e.classList.add('selected');
            e.classList.remove('completed');
        }
        if (e.id < stepNum) {
            e.classList.add('completed');
        }
        if (e.id > stepNum) {
            e.classList.remove('selected', 'completed');
        }
    });
}

function vmin(v) {
    return Math.min(vh(v), vw(v));
}

function vh(v) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
}

function vw(v) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (v * w) / 100;
}