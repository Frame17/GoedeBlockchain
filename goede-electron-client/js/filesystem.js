const fs = require('fs')
const bitcore = require("bitcore-lib")
const ECIES = require("bitcore-ecies")

var filesystem = {
    data: {},
    loadMnemonicFromFile: function(password) {
        var buf = Buffer.from(fs.readFileSync("mnemonic.txt").toString(), 'hex')

        console.log(buf);

        var value = new Buffer(password)
        var hash = bitcore.crypto.Hash.sha256(value)
        var bn = bitcore.crypto.BN.fromBuffer(hash)
        var key = new bitcore.PrivateKey(bn)

        var decryptor = ECIES().privateKey(key)

        return decryptor.decrypt(buf).toString()
    },
    writeMnemonicToFile: function(mnemonic, password) {
        var value = new Buffer(password)
        var hash = bitcore.crypto.Hash.sha256(value)
        var bn = bitcore.crypto.BN.fromBuffer(hash)
        var key = new bitcore.PrivateKey(bn)

        var encryptor = ECIES().privateKey(key).publicKey(key.publicKey)
        var buf = encryptor.encrypt(mnemonic);
        console.log(buf);
        fs.writeFileSync("mnemonic.txt", buf.toString('hex'))

        console.log(this.loadMnemonicFromFile(password))
    }
}

module.exports = filesystem
