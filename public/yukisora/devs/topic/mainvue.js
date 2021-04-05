Vue.component('labels', {
    template: `
    <div class="labels">
        <div class="label" v-for="it in labels">
            <a>{{it.categoryName}}</a> <a style="font-size: 1vmin">Selected:</a><input type="checkbox" :checked="isSelected(it._id)" @click="selectCategory(it._id, $event.target.checked)"> <i class="material-icons" @click="deleteLabel(it._id)">delete</i>
        </div> 
        <div>
            <input type="text" v-if="createMode" v-model="name"> <a v-if="createMode" style="font-size: 1vmin">Nsfw:</a> <input type="checkbox" v-if="createMode" v-model="nsfw"> <i v-if="!createMode" @click="acAddLabel" class="material-icons">add</i> <i v-if="createMode" class="material-icons" @click="addLabel">done</i> <i v-if="createMode" class="material-icons" @click="createMode = false">close</i>
        </div>
    </div>
    `,
    data() {
        return {
            timer: '',
            labels: [],
            createMode: false,
            name: "",
            nsfw: false,
            selected: [],
            fselected: [],
            tested: []
        }
    },
    created() {
        this.loadLabels();
        this.timer = setInterval(this.loadLabels, 5000);
        this.fselected = [];

    },
    methods: {
        isSelected: function (id) {
            this.fselected = this.$root.selected;
            if (!this.fselected) {
                return false;
            }
            for (const e of this.fselected) {
                if (e._id == id) {
                    return true;
                }
            }
            return false;
        },
        selectCategory: function (id, add) {
            for (let i = 0; i < this.selected.length; i++) {
                if (this.selected[i] == id)
                    this.selected.splice(i, 1);
            }
            if (add)
                this.selected.push(id);

            this.$root.selected = this.selected;
        },
        acAddLabel: async function () {
            this.createMode = true;
        },
        addLabel: async function () {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({categoryName: this.name, isNsfw: this.nsfw})
            };

            const response = await fetch('/api/yuki/topiccategory', options);
            this.createMode = false;
            await this.loadLabels();
        },
        deleteLabel: async function (id) {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({_id: id})
            };

            const response = await fetch('/api/yuki/topiccategory', options);
            this.loadLabels();
        },
        loadLabels: async function () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };

            const response = await fetch('/api/yuki/topiccategory', options);
            const json = await response.json();
            this.labels = json.data;
        }
    }
});

Vue.component('selected', {
    template: `
    <div style="display: inline-flex; flex-wrap: wrap; padding: 2vmin; z-index: -1;">
        <button v-for="n in num" @click="sw(n)" style="margin-left: 1vmin">{{n}}</button>
    </div>
    `,
    props: ['num'],
    methods: {
        sw: function (n) {
            topic.switchSite(n);
        }
    }
});

var topic = new Vue({
    el: "#topic",
    data: {
        topics: [],
        selectedTopics: [],
        show: false,
        topicName: "",
        description: "",
        selected: [],
        submitmsg: "",
        sites: 1,
        editMode: false,
        editId: "",
        modeTxt: "",
        lastSite: 1
    },
    created: function () {
        this.loadTopics();
    },
    methods: {
        toggleShow: function () {
            this.show = !this.show;
            this.editMode = false;
            this.topicName = "";
            this.selected = [];
            this.description = "";
            this.modeTxt = "Create mode";
            this.submitmsg = "";
            this.editId = "";
        },
        deleteTopic: async function (id) {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({_id: id})
            };

            const response = await fetch('/api/yuki/topic', options);
            await this.loadTopics();
        },
        editTopic: function (id) {
            this.modeTxt = "Edit mode";
            var topic = {};
            for (const e of this.topics) {
                if (id == e._id) {
                    topic = e;
                    break;
                }
            }
            this.topicName = topic.topic;
            this.description = topic.description;
            this.selected = topic.category;
            this.editId = topic._id;
            this.editMode = true;
            this.show = true;
        },
        submit: async function () {
            if(this.selected.length == 0){
                this.submitmsg = "You should at least check one topic!";
                return;
            }
            var package = {topic: this.topicName, description: this.description, category: this.selected};
            var options = {};
            if (this.editMode) {
                options = {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify({data: package, _id: this.editId})
                };
            } else {
                options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify(package)
                };
            }

            const response = await fetch('/api/yuki/topic', options);
            const json = await response.json();
            if (json.status === 200) {
                this.editMode = false;
                this.loadTopics();
                this.submitmsg = "Successfully created topic!";
                this.show = false;
                return json.message;
            } else {
                this.submitmsg = "An error occurred";
                console.log(response);
                return undefined;
            }
        },
        loadTopics: async function () {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            };

            const response = await fetch('/api/yuki/topic', options);
            const json = await response.json();
            this.topics = json.data;
            console.log(json);
            try {
                this.sites = parseInt(this.topics.length / 10 + 1);
            } catch (e){
            }
            if (this.topics.length === 0)
                this.sites = 0;
            else
                this.switchSite(this.lastSite);
        },
        switchSite: function (num) {
            this.lastSite = num;
            this.selectedTopics = [];
            for (let i = 1 + (10 * (num - 1)) - 1; i < 10 + (10 * (num - 1)) - 1; i++) {
                if (this.topics[i])
                    this.selectedTopics.push(this.topics[i]);
            }
        }
    }
});