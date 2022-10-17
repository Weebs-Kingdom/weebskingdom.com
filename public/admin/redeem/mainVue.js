var redeem = new Vue({
    el: '#redeem',
    data: {
        show: false,
        submitmsg: "",
        codes: [],

        editingCode: "",
        editMode: false,
        creatMode: false,

        rCode: "",
        rInstruction: "",
        rDoExpire: false,
        rExpire: undefined,
        rAutoDelete: false,
        rMaxUsage: 10,
        rMaxUserUsage: 1,
        rHasMaxUsage: false
    },
    created: async function () {
        await this.loadCodes();
    },
    methods: {
        loadCodes: async function () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };

            const response = await fetch('/api/yuki/redeem', options);
            const json = await response.json();
            if (json.status === 200) {
                this.codes = json.data;
            } else {
            }
        },
        deleteCode: async function (id) {
            var answer = window.confirm("Delete?");
            if (!answer)
                return;

            this.closeEd();
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({_id: id})
            };

            const response = await fetch('/api/yuki/redeem', options);
            const json = await response.json();
            if (json.status === 200) {
                this.codes = await this.loadCodes();
            }
        },
        closeEd: function () {
            this.show = false;
        },
        edit: function (code) {
            this.submitmsg = "";
            this.modeinfo = "Editing mode";
            this.editingCode = code._id;
            this.show = true;
            this.editMode = true;
            this.creatMode = false;
            this.setupEdit(code);
        },
        create: function () {
            this.submitmsg = "";
            this.modeinfo = "Creator mode";
            this.editingCode = "";
            this.show = true;
            this.editMode = false;
            this.creatMode = true;
            this.setupCreate();
        },
        setupCreate: function () {
            this.rCode = "";
            this.rInstruction = "";
            this.rDoExpire = false;
            this.rExpire = undefined;
            this.rAutoDelete = false;
            this.rMaxUsage = 10;
            this.rMaxUserUsage = 1
        },
        setupEdit: function (code) {
            this.rCode = code.code;
            this.rInstruction = code.instructions;
            this.rDoExpire = code.doExpire;
            this.rExpire = code.expires;
            this.rAutoDelete = code.autoDelete;
            this.rMaxUsage = code.maxUsage;
            this.rMaxUserUsage = code.maxUserUsage;
        },
        submit: async function () {
            location.replace("#" + "msg");
            var packedCode = {
                code: this.rCode,
                instructions: this.rInstruction,
                maxUserUsage: this.rMaxUserUsage
            };

            if (this.rDoExpire) {
                packedCode.doExpire = true;
                packedCode.expires = this.rExpire;
                packedCode.autoDelete = this.rAutoDelete;
            }

            if (this.rHasMaxUsage) {
                packedCode.hasMaxUsage = true;
                packedCode.maxUsage = this.rMaxUsage;
            }

            console.log(packedCode);

            if (this.editMode) {
                var pack = {
                    _id: this.editingCode,
                    data: packedCode
                }

                const options = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(pack)
                };

                const response = await fetch('/api/yuki/redeem', options);
                const json = await response.json();
                if (json.status === 200) {
                    await this.loadCodes();
                    this.submitmsg = "Successfully updated redeem code!";
                    return json.message;
                } else {
                    this.submitmsg = "An error occurred";
                    console.log(response);
                    return undefined;
                }
            } else if (this.creatMode) {
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(packedCode)
                };

                const response = await fetch('/api/yuki/redeem', options);
                const json = await response.json();
                if (json.status === 200) {
                    await this.loadCodes();
                    this.submitmsg = "Successfully created redeem code!";
                    return json.message;
                } else {
                    this.submitmsg = "An error occurred";
                    console.log(response);
                    return undefined;
                }
            }
        }
    }
});