var craft = new Vue({
    el: "#craft",
    data: {
        count: 1,
        recipes: [],
        inventory: [],
        selected: {
            result: {itemName: "Aluminium I guess"},
            hammerPunches: 9,
            items: [{itemName: "Peace of alu", amount: 10}, {itemName: "Ass of alu", amount: 10}, {
                itemName: "V of alu",
                amount: 10
            }]
        }
    },
    methods: {
        loadAllCraftingRecipes: async function () {
        },
        loadCraftingRecipe: async function (id) {
            fill(9);
        },
        loadInventory: async function () {

        },
        click: function (){
            document.getElementById(this.count).click();
            this.count ++;
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

function fill(num){
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
    let p = stepNum * (100/craft.selected.hammerPunches);
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