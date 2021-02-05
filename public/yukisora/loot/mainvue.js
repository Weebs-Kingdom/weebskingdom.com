var loot = new Vue({
    el: '#loot',
    mounted: async function () {
        animate();
    },
    methods: {
        openLootBox: async function () {
            if(!this.ready)
                return;
            if (this.clicked == true)
                return;
            this.clicked = true;
            this.ready = false;
            this.key = false;
            this.showMsg = false;

            changeTheme(this.boxQuality);
            open.play();

            setTimeout(() => {
                backG.play();
                setTimeout(() => {
                    part.play();
                    vibing.play();
                    background.play();
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);
                }, 100);
            }, 850);

        },
        loadLootBox: async function (){
            this.key = false;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };
            await fetch('/api/shop/openLootbox', options).then(res => res.json())
                .then(res => {
                    json = res;
                    return res;
                })
                .catch(err => console.log(err));
            if (json === undefined) {
                this.msg = "While connection to the server an error occurred";
                return;
            }
            console.log(json);
            this.showMsg = true;

            if(json.status === 200){
                this.msg = "Used key!";
                this.ready = true;
                this.image = json.data.imageUrl;
                this.boxQuality = json.data.rarity;
                document.getElementById("lootBoxImage").style.visibility = "visible";
            } else if(json.status === 400 ||json.status === 401){
                this.msg = json.message;
            } else {
                this.msg = "While connection to the server a error occurred";
            }
        }
    },
    data: {
        image: "https://cdn.dribbble.com/users/1356973/screenshots/4539868/loot-box.png?compress=1&resize=800x600",
        clicked: false,
        ready: false,
        msg: "",
        boxQuality: "normal",
        key: true,
        showMsg: false
    }
});

async function animate() {
    var i = 0;
    for (let i = 0; i < 195; i++) {
        var angle = 0.1 * i;
        //shift particles to the center of the window
        //by adding half of the screen width and screen height
        var x = vmin(25) * Math.cos(angle);
        var y = vmin(25) * Math.sin(angle);

        var container = document.querySelector('.particles');
        for (var j = 0; j < 15; j++) {
            var dot = document.createElement("div");
            dot.classList.add("dot");
            container.appendChild(dot);

            var size = anime.random(5, 10);

            dot.style.width = size + "px";
            dot.style.height = size + "px";

            dot.style.left = x + anime.random(-15, 15) + "px";
            dot.style.top = y + anime.random(-15, 15) + "px";

            dot.style.opacity = "0";

            var glit = document.createElement("div");
            glit.classList.add("glitter");
            dot.appendChild(glit);

            size = anime.random(2, 5);

            glit.style.width = size + "px";
            glit.style.height = size + "px";

            glit.style.transform = "rotate(" + anime.random(180, -180) + "deg)";
            glit.style.left = anime.random(-20, 20) + "px";
            glit.style.top = anime.random(-20, 20) + "px";

            glit.style.opacity = "0";

        }
    }

    var bg = document.getElementById("bg");

    for (let j = 0; j < 25; j++) {
        var row = document.createElement("div");
        row.style.display = "table-row";
        bg.appendChild(row);
        for (let k = 0; k < 25; k++) {
            var clm = document.createElement("div");
            clm.style.display = "table-cell";
            clm.classList.add("cell")
            row.appendChild(clm);
        }
    }
}

var open = anime.timeline({
    autoplay: false
});

const xMax = 128;

open
    .add({
        targets: '#lootBoxImage',
        easing: 'easeInOutCirc',
        duration: 800,
        translateX: [
            {
                value: xMax * -1,
            },
            {
                value: xMax,
            },
            {
                value: xMax / -2,
            },
            {
                value: xMax / 2,
            },
            {
                value: xMax / -4,
            },
            {
                value: xMax / 4,
            },
            {
                value: xMax / -8,
            },
            {
                value: xMax / 8,
            },
            {
                value: xMax / -8,
            },
            {
                value: xMax / 8,
            },
            {
                value: xMax / -8,
            },
            {
                value: xMax / 8,
            },
            {
                value: xMax / -2,
            },
            {
                value: xMax / 2,
            },
            {
                value: 0
            }
        ],
        scale: [
            {value: 4, delay: 700, duration: 200},
            {value: 0, delay: 150, duration: 100}
        ]
    });

var part = anime({
    autoplay: false,
    loop: true,
    easing: "linear",
    targets: document.querySelectorAll(".dot, .glitter"),
    opacity: [
        {value: 1, duration: 50, delay: anime.stagger(2)},
        {value: 0, duration: anime.random(300, 1000)}
    ],
});

var vibing = anime({
    autoplay: false,
    loop: true,
    easing: "linear",
    targets: document.querySelectorAll(".dot, .glitter"),
    opacity: [
        {value: 1, duration: 50, delay: anime.stagger(2)},
        {value: 0, duration: anime.random(300, 1000)}
    ],
});

var background = anime({
    autoplay: false,
    loop: true,
    easing: "linear",
    targets: document.querySelectorAll(".ocly"),
    rotate: [
        {value: '360deg', duration: 800}
    ]
});

var backG = anime({
    autoplay: false,
    loop: false,
    targets: document.querySelectorAll(".cell"),
    direction: "normal",
    scale: [{value: 1}, {value: 0, easing: 'easeOutSine', duration: 500}],
    delay: anime.stagger(100, {grid: [25, 25], from: 'center'})
});

particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 355,
            "density": {
                "enable": true,
                "value_area": 789.1476416322727
            }
        },
        "color": {
            "value": "#8ac0f6"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            },
            "polygon": {
                "nb_sides": 5
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.48927153781200905,
            "random": false,
            "anim": {
                "enable": true,
                "speed": 0.2,
                "opacity_min": 0,
                "sync": false
            }
        },
        "size": {
            "value": 2,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 2,
                "size_min": 0,
                "sync": false
            }
        },
        "line_linked": {
            "enable": false,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 0.2,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": false,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "bubble"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 400,
                "line_linked": {
                    "opacity": 1
                }
            },
            "bubble": {
                "distance": 83.91608391608392,
                "size": 1,
                "duration": 3,
                "opacity": 1,
                "speed": 3
            },
            "repulse": {
                "distance": 200,
                "duration": 0.4
            },
            "push": {
                "particles_nb": 4
            },
            "remove": {
                "particles_nb": 2
            }
        }
    },
    "retina_detect": true
});

function vh(v) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
}

function vw(v) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (v * w) / 100;
}

function vmin(v) {
    return Math.min(vh(v), vw(v));
}

function vmax(v) {
    return Math.max(vh(v), vw(v));
}