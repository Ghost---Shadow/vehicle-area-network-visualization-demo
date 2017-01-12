var two = null;
var range = 100;
var positions = [];
var packets = [];
var G = null;
var prevG = null;
var isPaused = false;
var frameDelay = 50;
var packetDelay = 10;
var packetLife = 100;
var dimensions = { 'x': 4, 'y': 4 };

var canvasId = 'main-canvas';
var graphDivId = '#graph-holder';
var routesDivId = '#routes-holder';

window.onload = function () {
    var elem = document.getElementById(canvasId);
    var params = { width: 512, height: 512, type: Two.Types.svg };
    two = new Two(params).appendTo(elem);

    drawBackground(two, dimensions.x, dimensions.y);
    setInterval(update, frameDelay);
}

function hasGraphChanged(G, prevG) {
    if (G == null)
        return false;
    if (prevG == null)
        return true;
    if (prevG.length == 0)
        return true;
    for (var i = 0; i < G.length; i++) {
        for (var j = 0; j < G.length; j++) {
            if (G[i][j] != prevG[i][j])
                return true;
        }
    }
    return false;
}

function update() {
    // Logic update
    if (!isPaused) {
        positions = updateCarPositions(dimensions, positions);
        G = updateGraph(positions);
        if (hasGraphChanged(G, prevG)) {
            R = updateRoutingInformation(G);
            packets = updatePackets(R, packets);
            prevG = G.slice();

            if (G != null) {
                // UI update
                var s = "";
                for (var i = 0; i < G.length; i++) {
                    s += G[i] + "<br />";
                }
                $(graphDivId).html(s);
            }
            if (R != null) {
                var s = "";
                for (var i = 0; i < G.length; i++) {
                    s += R[i] + "<br />";
                }
                $(routesDivId).html(s);
            }
        }
    }

    // Graphics Update
    drawGraph(two, positions, G);
    drawCars(two, positions, range);
    drawPackets(two, positions, packets);
    two.update();
}

function addPacket(src, dest) {
    packets.push(new Packet(packets.length, src, dest, packetDelay, packetLife));
}

function reset() {
    var two = null;
    var range = 50;
    var positions = [];
    var packets = [];
    var G = null;
    var prevG = null;
    var isPaused = false;
    var frameDelay = 50;
    var packetDelay = 10;
    var packetLife = 100;
    var dimensions = { 'x': 4, 'y': 4 };
}

function loadScene(name) {
    console.log("Loading " + name);
    switch (name) {
        case "static":
            dimensions = { 'x': 2, 'y': 2 };
            positions = [{ 'x': 0, 'y': 0, 'nx': 0, 'ny': 1, 't': 0, 'speed': 0 },
            { 'x': 0, 'y': 1, 'nx': 1, 'ny': 1, 't': 0.75, 'speed': 0 },
            { 'x': 1, 'y': 1, 'nx': 1, 'ny': 0, 't': 0, 'speed': 0 },
            { 'x': 1, 'y': 0, 'nx': 0, 'ny': 0, 't': 0.5, 'speed': 0 }
            ];
            drawBackground(two, dimensions.x, dimensions.y);
            break;
        case "ten_cars":
            dimensions = { 'x': 3, 'y': 3 };
            positions = [];
            for (var i = 0; i < 10; i++) {
                x = Math.round((dimensions.x - 1) * Math.random());
                y = Math.round((dimensions.y - 1) * Math.random());
                position = { 'x': x, 'y': y, 'nx': x, 'ny': y, 't': 1, 'speed': 0.01 };
                positions.push(position);
            }
            drawBackground(two, dimensions.x, dimensions.y);
            break;
    }
}