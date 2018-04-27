var ws = new WebSocket('ws://192.168.1.5:12345');
ws.onmessage = function (event) {
    data = JSON.parse(event.data);
    objects = data.objects;
    heroID = data.heroID;
};

let objects = [];
let heroID = -1;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var lastKeys = '';
ws.onopen = function () {
    setInterval(function () {
        var keys = '';
        if (fw.isDown(37)) {
            keys += 'L';
        }
        if (fw.isDown(39)) {
            keys += 'R';
        }
        if (fw.isDown(38)) {
            keys += 'U';
        }
        if (fw.isDown(40)) {
            keys += 'D';
        }
        if (keys !== lastKeys) {
            lastKeys = keys;
            ws.send(keys);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let [id, object] of objects) {
            if(id == heroID)
            {
                ctx.fillStyle="yellow";
            }else{
                ctx.fillStyle="blue";
            }
            ctx.fillRect(object.x, object.y, 100, 100);
        }
    }, 16);
};
