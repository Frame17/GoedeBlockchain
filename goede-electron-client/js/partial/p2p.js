var p2p = {
    createPeer: function (id) {
        peer = new global.Peer(id, { host: 'bozhko.net', port: '9000', debug: 3 })
        return peer
    },
    sendData: function (from_peer, to_peer_id, data) {
        var connection = from_peer.connect(to_peer_id)
        connection.on('open', function () {
            connection.send(data)
            console.log('Send:', data)
        })
    },
    getData: function (connection) {
        connection.on('data', function (data) {
            console.log('Recieved:', data);
        });
    }
}

module.exports = p2p