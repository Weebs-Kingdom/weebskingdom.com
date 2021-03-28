var craft = new Vue({
    el: "#craft",
    data: {
        msg: "",
        shown: false,
        count: 1,
        recipes: [],
        inventory: [],
        blocked: false,
        selected: {
            result: {itemName: "Aluminium I guess", itemImageURL: "",},
            hammerPunches: 4,
            items: [{itemName: "Peace of alu", amount: 10}, {itemName: "Ass of alu", amount: 10}, {
                itemName: "V of alu",
                amount: 10
            }]
        },
    },
    created: async function () {
        await this.loadAllCraftingRecipes();
        await this.loadInventory();
        console.log(this.recipes);
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

            const response = await fetch('/api/yuki/getUserRecipes', options);
            const json = await response.json();
            if (json.status === 200) {
                this.recipes = json.data;
            }
        },
        loadInventory: async function () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };

            const response = await fetch('/api/yuki/getUserInventory', options);
            const json = await response.json();
            if (json.status === 200) {
                this.inventory = json.data;
            }
        },
        loadCraftingRecipe: function (recipe) {
            this.shown = true;
            this.selected = recipe;
            this.count = 1;
            this.blocked = false;
            this.msg = "";

            for (const e of this.selected.items) {
                var found = false;
                for (const ee of this.inventory) {
                    if (ee.item == e._id) {
                        if (e.amount <= ee.amount) {
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    this.blocked = true;
                    this.msg = "You don't have all the items you need!";
                }
            }
        },
        click: async function () {
            if (this.count > this.selected.hammerPunches || this.blocked) {
                return;
            }
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };

            const response = await fetch('/api/yuki/punch', options);
            const json = await response.json();
            if (json.status == 200) {
                progress(this.count);
                if (this.count >= this.selected.hammerPunches) {
                    this.blocked = true;
                    if(await this.craft()){
                        showCase();
                    } else {
                        this.msg = "Crafting failed!";
                    }
                    return;
                }
                this.count++;
            } else {
                this.msg = "You don't have enough energy to craft this item!";
            }
        },
        getAmount: function (id, needed) {
            for (const el of this.inventory) {
                if (el.item == id){
                    var am = el.amount;
                    if(am > needed)
                        return needed;
                    return am;
                }
            }
            return 0;
        },
        craft: async function () {
            var options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({recipe: this.selected._id})
            }
            const response = await fetch('/api/yuki/craft', options);
            const js = await response.json();
            return js.status == 200;
        }
    }
});

let steps = [];

function showCase() {
    showCaseTL.reset();
    showCaseTL.play();
}

var showCaseTL = anime.timeline({
    autoplay: false,
    direction: 'alternate'

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
    }).add({
    duration: 2000
});

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