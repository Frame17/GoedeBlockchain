const chain = require('./js/chain.js')

//UI Section
const m = require('mithril')

//Views
var LoginComponent = {
    username: "",
    setUsername: function(name) {
        this.username = name
    },
    login: function() {
        authorize(this.username)
    },
    view: function() {
        return m("div", [
            m("h2", {class: "title"}, "Goede Client"),
            m("input", {type: "text", name: "seed", oninput: m.withAttr("value", this.setUsername.bind(this)), value: this.username}),
            m("button", {class: "button-primary", onclick: this.login.bind(this)}, "Load data"),
        ])
    }
}

var WalletComponent = {
    key: "",
    value: "",
    setKey: function(val) { this.key = val },
    setValue: function(val) { this.value = val},
    storeData: function() { storeData(this.key, this.value) },
    retrieveData: function() { this.value = retrieveData(this.key) },
    view: function() {
        return m("div", [
            m("h3", chain.address.toString()),
            m("div", {class: "row"}, [ 
                m("input", {class: "six columns", type: "text", placeholder: "Key", name: "key", oninput: m.withAttr("value", this.setKey.bind(this)), value: this.key})
            ]),
            m("div", {class: "row"}, [ 
                m("input", {class: "six columns", type: "text", placeholder: "Value", name: "value", oninput: m.withAttr("value", this.setValue.bind(this)), value: this.value})
            ]),
            m("div", {class: "row"}, [ 
                m("button", {class: "three columns", onclick: this.storeData.bind(this)}, "Store"),
                m("button", {class: "three columns", onclick: this.retrieveData.bind(this)}, "Retrieve")
            ])
        ])
    }
}

function authorize(username) {
    if(chain.loadKeyFromMnemonic(username)) {
        m.route.set("/wallet")
    }
}

function storeData(key, value) {
    chain.storeData(key, value)
}

function retrieveData(key) {
    return chain.retrieveData(key)
}

m.route(root, "/login", {
    "/login": LoginComponent,
    "/wallet": WalletComponent
})
