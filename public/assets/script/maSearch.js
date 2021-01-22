function searchFc(searchbar, monsterArray, attackArray, searchtype) {
    if (searchbar <= 0) {
        if (searchtype == "monster")
            return monsterArray;
        else
            return attackArray;
    }

    var scrj = '{' + searchbar + '}';
    var add = undefined;
    try {
        if (searchtype == "monster")
            add = searchMonster(JSON.parse(scrj), monsterArray, attackArray);
        else
            add = searchAttacks(JSON.parse(scrj), undefined, attackArray, false);
    } catch (e) {
        return;
    }

    var uniqueArray = add.filter(function (item, pos) {
        return add.indexOf(item) == pos;
    });

    return uniqueArray;
}

function searchMonster(inJson, monsters, attacks) {
    var add = [];

    for (const el of Object.keys(inJson)) {
        if (el === "attacks") {
            for (const ee of inJson[el]) {
                add = add.concat(searchAttacks(ee, monsters, attacks, true));
            }
        } else if (el === "evolves") {
            for (const ee of inJson[el]) {
                var fnd = searchMonster(ee, monsters, attacks);
                for (const eee of fnd) {
                    add = add.concat(monsters.filter(ea => ea.evolves.includes(eee._id)));
                }
            }
        } else {
            if (isNumber(inJson[el], monsters, el)) {
                add = add.concat(isNumber(inJson[el], monsters, el));
            } else {
                add = add.concat(monsters.filter(e => e[el].toLowerCase() == inJson[el].toLowerCase()));
            }
        }
    }
    return add;
}

function searchAttacks(inJson, monsters, attacks, returnMonster) {
    var add = [];

    for (const el of Object.keys(inJson)) {
        var fnd;
        if (isNumber(inJson[el], attacks, el)) {
            fnd = isNumber(inJson[el], attacks, el);
        } else {
            fnd = attacks.filter(er => er[el].toLowerCase() == inJson[el].toLowerCase());
        }
        if (returnMonster)
            for (const ele of fnd) {
                add = add.concat(monsters.filter(e => e.attacks.includes(ele._id)));
            }
        else
            add = add.concat(fnd);
    }
    return add;
}

function isNumber(num, li, param) {
    if (Number.isFinite(num)) {
        return li.filter(ele => ele[param] === num);
    } else if (num.startsWith('$')) {
        var nu = num.substring(1);
        var wds = nu.split(':');

        if (Number.parseInt(wds[1])) {
            switch (wds[0]) {
                case '>':
                    return li.filter(ele => ele[param] > Number.parseInt(wds[1]));
                case '<':
                    return li.filter(ele => ele[param] < Number.parseInt(wds[1]));
                case "!":
                    return li.filter(ele => ele[param] !== Number.parseInt(wds[1]));
            }
        }
    } else {
        return undefined;
    }
}