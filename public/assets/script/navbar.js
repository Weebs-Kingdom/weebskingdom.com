var navdiv = new Vue({
    el: '#navdiv',
    data: {
        navbar: '<input type="checkbox" id="main-navigation-toggle" class="btn btn--close" title="Toggle main navigation"/> <label for="main-navigation-toggle"> <span></span> </label> <nav id="main-navigation" class="nav-main unselectable"> <ul id="menu" class="menu"> <li class="menu__item"> <a class="menu__link" href="/">Home</a> <ul id="home" class="submenu"></ul> </li> <li class="menu__item"> <a class="menu__link">Projects</a> <ul class="submenu"> <li class="menu__item"> <a class="menu__link" href="/lazyteam">Lazy Team</a> </li> <li class="menu__item"> <a class="menu__link" href="/yukisora">Yuki Sora</a> </li> </ul> </li> <li class="menu__item"> <a class="menu__link">Account</a> <ul id="accSub" class="submenu"> <li class="menu__item"> <a class="menu__link" id="login" href="/login">Login</a> </li> <li class="menu__item"> <a class="menu__link" id="regi" href="/register">Register</a> </li> </ul> </li> </ul> </nav>'
    }
});