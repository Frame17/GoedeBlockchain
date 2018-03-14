const chain = require('./js/chain.js');

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
            m("button", {onclick: this.login.bind(this)}, "Load data"),
        ])
    }
}

var WalletComponent = {
    view: function() {
        return m("div", [
            m("h2", chain.address.toString())
        ])
    }
}

function authorize(username) {
    if(chain.loadKeyFromMnemonic(username)) {
        m.route.set("/wallet")
    }
}

m.route(root, "/login", {
    "/login": LoginComponent,
    "/wallet": WalletComponent
})
