const ws = require('ws');

const wss = new ws.Server({port: 12345, host: '192.168.1.5'});

const connections = new Set();

const objects = new Map();

var heroID = 0;

wss.on('connection', function (connection) {
    connections.add(connection);
    connection.keys = new Set();

    console.log('valaki belépett!');
    const hero = {x: 160, y: 130};
    objects.set(++heroID, hero);
    connection.hero = hero;
    connection.heroID = heroID;

    connection.on('close', function () {
        console.log('valaki kilépett!');
        objects.delete(hero);
        connections.delete(connection);
    });

    connection.on('message', function (message) {
        console.log('üzenet: ' + message);
        connection.keys = new Set(message);
    });
});


setInterval(update, 16);
setInterval(netUpdate, 100);

function update() {
    connections.forEach(function (connection) {
        if (connection.keys.has('L')) {
            connection.hero.x -= 10;
        }
        if (connection.keys.has('R')) {
            connection.hero.x += 10;
        }
        if (connection.keys.has('U')) {
            connection.hero.y -= 10;
        }
        if (connection.keys.has('D')) {
            connection.hero.y += 10;
        }
    });
}

function netUpdate() {
    connections.forEach(function (connection) {
        connection.send(JSON.stringify({objects: Array.from(objects), heroID: connection.heroID}));
    });
}