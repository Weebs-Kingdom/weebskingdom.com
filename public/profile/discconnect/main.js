var stage2 = false;

function init(){
    document.getElementById("tokendiv").hidden = true;
}

async function submit(){
    if(!stage2){
        const user = document.getElementById("discuserid").value;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({user: user})
        };

        const response = await fetch('/api/user/discconnect', options);
        const json = await response.json();
        console.log(json);
        if(json.status == 200){
            document.getElementById("tokendiv").hidden = false;
            document.getElementById("dicidiv").hidden = true;
            stage2 = true;
            document.getElementById("msg").innerHTML = "A message has been sent to your Discord Profile!";
        } else {
            document.getElementById("msg").innerHTML = "No message can be sent to your account! That could mean, you are not in our database yet (not clicked the verify button)";
        }
    } else {
        const ttoken = document.getElementById("token").value;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({token: ttoken})
        };

        const response = await fetch('/api/user/discconnecttoken', options);
        const json = await response.json();
        if(json.status == 200){
            document.getElementById("msg").innerHTML = "Your profile is now connected with your Discord Account!";
            setTimeout(() => {
                window.location.replace("/yukisora/loot?first=true");
            },  6000)
        } else {
            document.getElementById("msg").innerHTML = "This token is invalid!";
        }
    }
}