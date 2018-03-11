var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var openchain = require("openchain");
var bitcore = require("bitcore-lib");
 
var seed = "0123456789abcdef0123456789abcdef";

// Load a private key from a seed
var privateKey = new bitcore.HDPrivateKey.fromSeed(seed, "openchain");
var address = privateKey.publicKey.toAddress();

// Calculate the accounts corresponding to the private key
var dataPath = "/asset/p2pkh/" + address + "/metadata/";

var client = new openchain.ApiClient("https://openchain.bozhko.net/");
var signer = new openchain.MutationSigner(privateKey);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.get("/get_data", function (req, res) {
	res.sendFile(path.join(__dirname+'/get_data.html'));
});

app.get("/store_data", function (req, res) {
	res.sendFile(path.join(__dirname+'/store_data.html'));
});

app.get("/get_transaction", function (req, res) {
	res.sendFile(path.join(__dirname+'/get_transaction.html'));
});

app.get("/get_all_transactions", function (req, res) {
	res.sendFile(path.join(__dirname+'/get_all_transactions.html'));
});

app.post("/get_data", function (req, res) {
	client.getDataRecord(dataPath, req.body.recordname)
	.then(function (result) {
	    res.writeHead(200, {'Content-Type': 'text/html'});
    	res.end(result.data);
	});
});

app.post("/store", function (req, res) {
	var recordName = req.body.recordname;
	var storedData = req.body.data;

	// Initialize the client
	client.initialize()
	.then(function () {
	    // Retrieve the record being modified
	    return client.getDataRecord(dataPath, recordName)
	})
	.then(function (dataRecord) {
	    // Encode the data into a ByteBuffer
	    var newValue = openchain.encoding.encodeString(storedData);

	    // Create a new transaction builder
	    return new openchain.TransactionBuilder(client)
	        // Add the key to the transaction builder
	        .addSigningKey(signer)
	        // Modify the record
	        .addRecord(dataRecord.key, newValue, dataRecord.version)
	        // Submit the transaction
	        .submit();
	})
	.then(function (result) { console.log(result); });

	res.redirect("/");
});

app.post("/get_transaction", function (req, res) {
	client.getTransaction(req.body.hash)
	.then(function (result) {
	    res.writeHead(200, {'Content-Type': 'text/html'});
    	res.end(result.transaction.timestamp.toString());
	});
});

app.listen(8080);