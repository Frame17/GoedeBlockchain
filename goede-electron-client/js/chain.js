var openchain = require("openchain");
var bitcore = require("bitcore-lib");
var Mnemonic = require("bitcore-mnemonic");

var chain = {
    client: new openchain.ApiClient("https://openchain.bozhko.net/"),
    state: 0,
    privateKey: "",
    address: "",
    signer: "",
    dataPath: "",
    derivedKey: "",
    loadKeyFromSeed: function (seed) {
        // Load a private key from a seed
        this.privateKey = new bitcore.HDPrivateKey.fromSeed(seed, "openchain");
        this.loadKeyData();
    },
    loadKeyFromMnemonic: function (mnemonic) {
        if(Mnemonic.isValid(mnemonic)) {
            var code = new Mnemonic(mnemonic);
            var privateKey = new bitcore.HDPrivateKey(code.toHDPrivateKey(null, "livenet").xprivkey);
            privateKey.network = bitcore.Networks.get("openchain");
            this.derivedKey = privateKey.derive(44, true).derive(64, true).derive(0, true).derive(0).derive(0);
            this.loadKeyData();
            return true;
        }
        return false;
    },
    loadKeyData: function() {
        this.address = this.derivedKey.privateKey.toAddress();
        // Calculate the accounts corresponding to the private key
        this.dataPath = "/asset/p2pkh/" + this.address + "/metadata/";

        //this.signer = new openchain.MutationSigner(this.privateKey);
    }
}

module.exports = chain
