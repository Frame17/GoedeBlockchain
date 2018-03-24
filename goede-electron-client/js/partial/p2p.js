$(document).ready(function() {

    peer1 = new Peer({ host:'bozhko.net',port:'9000', debug: 3});
    peer2 = new Peer({ host:'bozhko.net',port:'9000', debug: 3});

    peer1.on('open', function(id){
        peerId1 = id;
        var connection = peer2.connect(peerId1);
        connection.on('data', function(data) {
            console.log(data , peerId1);
            connection.send(' peer');
        });
    });

    peer1.on('connection', function(connection) {
        connection.on('open', function() {
            connection.send('Hello,');
        });
        connection.on('data', function(data) {
            console.log(data);
        });
    });
});