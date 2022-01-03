var au = new Vue({
    el: '#auth',
    data: {
        msg: "Processing...",
        img: ""
    },
    created: async function () {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get('token');

        if(token == null){
            this.msg = "No token found";
            this.img = "https://tenor.com/blVDy.gif";
            return;
        }

        var options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: token})
        };

        var json = undefined;
        await fetch('/api/user/activate', options).then(res => res.json())
            .then(res => {
                json = res;
                return res;
            })
            .catch(err => console.log(err));

        if (json === undefined) {
            this.msg = "While connection to the server a error occurred!";
            return;
        }

        if (json.status === 200) {
            this.msg = "Your account is verified!";
            this.img = "https://tenor.com/bkVmR.gif";
        } else {
            if(json.message){
                this.msg = json.message;
                this.img = "https://tenor.com/bfsrA.gif";
            } else {
                this.msg = "While connecting to the server an error occurred!";
                this.img = "https://tenor.com/bvZtW.gif";
            }
        }
    }
});