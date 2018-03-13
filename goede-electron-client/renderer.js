const chain = require('./js/chain.js');

//UI Section
const m = require('mithril')

//Views
const WelcomeComponent = {
    view: function() {
        return m("div", [
            m("h2", {class: "title"}, "Goede Client"),
            m("input", {type: "text", name: "seed"}),
            m("button", {onclick: function() {getKeyFromSeed(document.getElementsByName('seed')[0].value)}}, "Load data"),
        ])
    }
}

m.mount(root, WelcomeComponent)
