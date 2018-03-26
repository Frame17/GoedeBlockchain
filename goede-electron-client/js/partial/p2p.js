$(document).ready(function() {

    var peer = new Peer('a',{ host:'bozhko.net',port:'9000', debug: 3});
    var peer2 = new Peer('b',{ host:'bozhko.net',port:'9000', debug: 3});
    var connectedPeers ={};

    sendData(peer2 , peer , "Hello ,");

    peer.on('connection',getData);

    sendData(peer2 , peer , ' world!');
});

function getData(connection) {
    connection.on('data',function (data) {
        console.log('Recieved:' , data);
    });
};

function sendData(from_peer , to_peer , data) {
    to_peer.on('open',function(id){
        var connection = from_peer.connect(id);
        connection.on('open',function () {
            connection.send(data);
            console.log('Send:',data);
        });
    });
}