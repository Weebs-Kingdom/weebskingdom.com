var main = new Vue({
    el: "#index",
    data: {
        isUp: false
    },
    methods: {
        // method to check if https://map.weebskingdom.com/ is up
        checkMap: async function () {
            const options = {
                method: 'GET',
                headers: {}
            };

            try {
                await fetch('https://map.weebskingdom.com/', options).catch(err => {
                    return false;
                })
                    .then(res => res.json()).then(res => {
                        if (res.status === 200) {
                            this.isUp = true;
                            return true;
                        } else
                            return false;
                    });
            } catch (error) {
                return false;
            }
        }
    }
});