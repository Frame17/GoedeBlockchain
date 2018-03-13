const openchain = require("openchain");
const bitcore = require("bitcore-lib");

var client = new openchain.ApiClient("https://openchain.bozhko.net/");

var privateKey;
var address;
var signer;
var dataPath;

exports.loadKeyFromSeed = function (seed) {
    // Load a private key from a seed
    privateKey = new bitcore.HDPrivateKey.fromSeed(seed, "openchain");
    address = privateKey.publicKey.toAddress();
    // Calculate the accounts corresponding to the private key
    dataPath = "/asset/p2pkh/" + address + "/metadata/";

    signer = new openchain.MutationSigner(privateKey);
}
