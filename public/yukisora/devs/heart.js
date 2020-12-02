var clicked = 0;

function init() {
    document.getElementById("heart")
        .addEventListener('click', function(event) {
            click();
        });
}

function click() {
    clicked += 1;
    var t = getT();
    var div = document.getElementById("heart");
    var lis = div.getElementsByTagName("label");
    for (var i = 0; i < lis.length; i++) {
        lis[i].innerHTML = t;
    }
}

function getT() {
    switch (clicked) {
        case 1:
            return "Mega Love UwU";

        case 2:
            return "Ultra Love UwU";

        case 3:
            return "LEGENDARY Love UwU";

        case 4:
            return "SUPER LEGENDARY LOVE UWU";

        case 5:
            return "ULTRA MEGA UWU LOVE!";

        case 20:
            return "LOOOOOOOOOOOOOOOOOOOOVE BOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOMB O.O!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"

        default:
            return "ULTRA MEGA SUPER UWU LOVE!!!!!";
    }
}