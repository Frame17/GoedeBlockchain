const fs = require('fs')
const bitcore = require("bitcore-lib")
const ECIES = require("bitcore-ecies")
const Mnemonic = require("bitcore-mnemonic")
const PropertiesReader = require('properties-reader');

// Loading properties file
var properties = PropertiesReader('properties.txt');

var filesystem = {
    data: undefined,
    setData: function(data) {
        this.data = data
        this.writeData()
    },
    defaultData:  {
        name: "",
        address: ""
    },
    mnemonic: "",
    //Checks the availability of all the files required
    filesExist: function() {
        return fs.existsSync(properties.path().data.file) && this.mnemonicFileExists()
    },
    //Checks the availability of file storing mnemonic
    mnemonicFileExists: function() {
        return fs.existsSync(properties.path().mnemonic.file)
    },
    //Loads and decrypts mnemonic from mnemonic.txt using user's master password
    loadMnemonicFromFile: function(password) {
        if(!this.mnemonicFileExists())
            return "Error: File not found";

        var buf = Buffer.from(fs.readFileSync(properties.path().mnemonic.file).toString(), 'hex')
        var value = new Buffer(password)
        var hash = bitcore.crypto.Hash.sha256(value)
        var bn = bitcore.crypto.BN.fromBuffer(hash)
        var key = new bitcore.PrivateKey(bn)

        var decryptor = ECIES().privateKey(key)

        try {
            var decrypted = decryptor.decrypt(buf).toString()
        } catch (e) {
            return "Error: Incorrect password or data broken"
        }

        this.mnemonic = decrypted
        return decrypted
    },
    //Encrypts and writes mnemonic to mnemonic.txt file using user's master password
    writeMnemonicToFile: function(mnemonic, password) {
        var value = new Buffer(password)
        var hash = bitcore.crypto.Hash.sha256(value)
        var bn = bitcore.crypto.BN.fromBuffer(hash)
        var key = new bitcore.PrivateKey(bn)

        var encryptor = ECIES().privateKey(key).publicKey(key.publicKey)
        var buf = encryptor.encrypt(mnemonic);
        fs.writeFileSync(properties.path().mnemonic.file, buf.toString('hex'))

        console.log(this.loadMnemonicFromFile(password))
    },
    //Loads and decrypts user data using mnemonic
    readData: function() {
        if(!this.filesExist || this.mnemonic == "")
            return false;

        var value = new Buffer(this.mnemonic)
        var hash = bitcore.crypto.Hash.sha256(value)
        var bn = bitcore.crypto.BN.fromBuffer(hash)
        var key = new bitcore.PrivateKey(bn)

        var buf = Buffer.from(fs.readFileSync(properties.path().data.file).toString(), 'hex')
        var decryptor = ECIES().privateKey(key)
        var decrypted = decryptor.decrypt(buf).toString()

        try {
            this.data = JSON.parse(decrypted);
        } catch(e) {
            this.setData(this.defaultData)
            console.log("Couldn't restore data from JSON")
        }
    },
    //Encrypts and loads user data using mnemonic
    writeData: function() {
        var value = new Buffer(this.mnemonic)
        var hash = bitcore.crypto.Hash.sha256(value)
        var bn = bitcore.crypto.BN.fromBuffer(hash)
        var key = new bitcore.PrivateKey(bn)

        var encryptor = ECIES().privateKey(key).publicKey(key.publicKey)
        var buf = encryptor.encrypt(JSON.stringify(this.data));
        fs.writeFileSync(properties.path().data.file, buf.toString('hex'))
    },
    //Tries to load user data using password
    unlock: function(password) {
        if(this.loadMnemonicFromFile(password).substring(0, 5) == "Error")
            return "Error";

        if(this.filesExist()) {
            this.readData()
        } else {
            //TODO Add required fields
            this.setData(this.defaultData)
        }
    }
}

module.exports = filesystem
