var two = null;
var range = 200;
var positions = [];
var packets = [];
var G = null;
var prevG = null;
var isPaused = false;
var frameDelay = 50;
var packetDelay = 10;
var packetLife = 100;
var dimensions = { 'x': 4, 'y': 4 };

function reset() {
    range = 200;
    positions = [];
    packets = [];
    G = null;
    prevG = null;
    frameDelay = 50;
    packetDelay = 10;
    packetLife = 100;
    dimensions = { 'x': 4, 'y': 4 };
}

var canvasId = 'main-canvas';
var graphDivId = '#graph-holder';
var routesDivId = '#routes-holder';

window.onload = function () {
    reset();
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
        //if (hasGraphChanged(G, prevG)) {
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
        //}

        // Graphics Update
        drawGraph(two, positions, G);
        drawCars(two, positions, range);
        drawPackets(two, positions, packets);
        two.update();
    }

    // Instantiate a new packet
    if (clicks.length == 2) {
        addPacket(clicks[0], clicks[1]);
        clicks = [];
    }

}

function addPacket(src, dest) {
    packets.push(new Packet(packets.length, src, dest, packetDelay, packetLife));
}

function addCar(pos){
    
}

function save() {
    var name = $("#save-name").val();
    if (name.length > 0) {
        // Create a new checkpoint
        var checkpoint = {
            'name': name,
            'cars': positions,
            'packets': packets,
            'dimensions': dimensions
        };
        // Send checkpoint to database
        $.ajax
            ({
                type: "POST",
                url: "http://127.0.0.1/save",
                crossDomain: true,
                dataType: "json",
                data: checkpoint
            }).done(function (data) {
                console.log("ajax callback response:" + data);
            });
    }
}

function load() {
    var name = $("#save-name").val();
    if (name.length > 0) {
        reset();
        drawGraph(two, positions, G);
        drawCars(two, positions, range);
        drawPackets(two, positions, packets);
        $.ajax
            ({
                type: "POST",
                url: "http://127.0.0.1/load",
                crossDomain: true,
                dataType: "json",
                data: { "name": name }
            }).done(function (data) {
                //console.log(data);
                isPaused = true;
                dimensions = data.dimensions;
                positions = data.cars;
                packets = data.packets;
                resetGraphics(two, dimensions);
                isPaused = false;
            });
    }
}

function loadScene(name) {
    console.log("Loading " + name);
    reset();
    drawGraph(two, positions, G);
    drawCars(two, positions, range);
    drawPackets(two, positions, packets);
    switch (name) {
        case "static":
            isPaused = true;
            dimensions = { 'x': 2, 'y': 2 };
            positions = [{ 'x': 0, 'y': 0, 'nx': 0, 'ny': 1, 't': 0, 'speed': 0 },
            { 'x': 0, 'y': 1, 'nx': 1, 'ny': 1, 't': 0.75, 'speed': 0 },
            { 'x': 0, 'y': 1, 'nx': 0, 'ny': 0, 't': 0.2, 'speed': 0 },
            { 'x': 1, 'y': 1, 'nx': 1, 'ny': 0, 't': 0, 'speed': 0 },
            { 'x': 1, 'y': 0, 'nx': 0, 'ny': 0, 't': 0.5, 'speed': 0 }
            ];
            resetGraphics(two, dimensions);
            isPaused = false;
            break;
        case "ten_cars":
            isPaused = true;
            dimensions = { 'x': 3, 'y': 3 };
            positions = [];
            for (var i = 0; i < 10; i++) {
                x = Math.round((dimensions.x - 1) * Math.random());
                y = Math.round((dimensions.y - 1) * Math.random());
                position = { 'x': x, 'y': y, 'nx': x, 'ny': y, 't': 1, 'speed': 0.01 };
                positions.push(position);
            }
            resetGraphics(two, dimensions);
            isPaused = false;
            break;
    }
}

function togglePause() {
    isPaused = !isPaused;
}