$(document).ready(function() {

    // Peer's id equals to user's e-mail
    var peer = createPeer('a');
    var peer2 = createPeer('b');

    //Await connections from other peers
    peer.on('connection',getData);

    //Send data to our peer
    sendData(peer2 , peer.id , ' world!');
});

function createPeer(id) {
    peer = new Peer(id,{host:'bozhko.net',port:'9000', debug: 3})
    return peer;
}

function getData(connection) {
    connection.on('data',function (data) {
        console.log('Recieved:' , data);
    });
};

function sendData(from_peer , to_peer_id , data) {
        var connection = from_peer.connect(to_peer_id);
        connection.on('open',function () {
            connection.send(data);
            console.log('Send:',data);
        });
}