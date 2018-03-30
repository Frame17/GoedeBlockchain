const chain = require('./partial/chain.js')
const filesystem = require('./partial/filesystem.js')
const p2p = require('./partial/p2p.js')
const Mnemonic = require("bitcore-mnemonic");

exports.Peer = undefined

//UI Section
const m = require('mithril')

//Views
var LoginComponent = {
    password: "",
    setPassword: function(pwd) { this.password = pwd },
    login: function() {
        if(filesystem.unlock(this.password) != "Error") {
            authorize(filesystem.mnemonic)
        } else {
            alert("Incorrect password")
        }
    },
    view: function() {
        return m("div", [
            m("h2", {class: "title"}, "Goede Client Login"),
            m("input", {type: "password", name: "pwd", placeholder: "Master password", oninput: m.withAttr("value", this.setPassword.bind(this)), value: this.password}),
            m("button", {class: "button-primary", onclick: this.login.bind(this)}, "Login"),
            m("div", {class: "row"}, [
                m("a", {href: "#!/register"}, "Register")
            ])
        ])
    }
}

var RegisterComponent = {
    email: "",
    username: "",
    password: "",
    setEmail: function(email) { this.email = email },
    setUsername: function(name) { this.username = name },
    setPassword: function(pwd) { this.password = pwd },
    login: function() {
        filesystem.writeMnemonicToFile(this.username, this.password)
        filesystem.setData({
            name: "",
            address: this.email
        })

        authorize(this.username)
    },
    generatePassphrase: function() {
        this.username = new Mnemonic().toString()
    },
    view: function() {
        return m("div", [
            m("h2", {class: "title"}, "Goede Client Registration"),
            m("input", {type: "text", name: "email", placeholder: "Email", oninput: m.withAttr("value", this.setEmail.bind(this)), value: this.email}),
            m("input", {type: "text", name: "seed", placeholder: "Passphrase", oninput: m.withAttr("value", this.setUsername.bind(this)), value: this.username}),
            m("input", {type: "password", name: "pwd", placeholder: "New master password", oninput: m.withAttr("value", this.setPassword.bind(this)), value: this.password}),
            m("button", {class: "button-primary", onclick: this.generatePassphrase.bind(this)}, "Generate new passphrase"),
            m("button", {class: "button-primary", onclick: this.login.bind(this)}, "Save credentials")
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
            ]),
            m("div", {class: "row"}, [
                m("a", {href: "#!/data"}, "Your data")
            ])
        ])
    }
}

var DataComponent = {
    setName: function(val) { filesystem.data.name = val },
    setAddress: function(val) { filesystem.data.address = val },
    view: function() {
        return m("div", [
            m("h3", "Your data"),
            m("div", {class: "row"}, [
                m("input", {class: "six columns", type: "text", placeholder: "Name", name: "name", oninput: m.withAttr("value", this.setName.bind(this)), value: filesystem.data.name})
            ]),
            m("div", {class: "row"}, [
                m("input", {class: "six columns", type: "text", placeholder: "Name", name: "address", oninput: m.withAttr("value", this.setAddress.bind(this)), value: filesystem.data.address})
            ]),
            m("div", {class: "row"}, [
                m("button", {class: "three columns", onclick: writeUserData}, "Save")
            ]),
            m("div", {class: "row"}, [
                m("a", {href: "#!/wallet"}, "Wallet")
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

function writeUserData() {
    filesystem.writeData()
}

m.route(root, "/register", {
    "/register": RegisterComponent,
    "/login": LoginComponent,
    "/wallet": WalletComponent,
    "/data": DataComponent
})

if(filesystem.mnemonicFileExists()) {
    m.route.set("/login")
}

var peer = p2p.createPeer('lol');
var peer2 = p2p.createPeer('kek');

//Await connections from other peers
peer.on('connection', p2p.getData);

//Send data to our peer
p2p.sendData(peer2, peer.id, ' world!');