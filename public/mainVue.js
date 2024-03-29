var main = new Vue({
    el: "#index",
    data: {
        isUp: false
    },
    methods: {
        created: async function () {
          this.checkMap();
        },
        // method to check if https://map.weebskingdom.com/ is up
        checkMap: async function () {
            const options = {
                method: 'GET',
                headers: {
                    //Cors
                    'Access-Control-Allow-Origin': '*',
                }
            };

            try {
                await fetch('https://map.weebskingdom.com/', options).then(res => {
                    if (res.status == 200) {
                        this.isUp = true;
                        return true;
                    } else {
                        return false;
                    }
                }).catch(err => {
                    return false;
                });
            } catch (error) {
                return false;
            }
        }
    }
});