var two = null;
var range = 200;
var isPaused = false;
var frameDelay = 50;
var packetDelay = 10;
var packetLife = 100;
var dimensions = { 'x': 4, 'y': 4 };
var addCarMode = false;
var removeCarMode = false;
var addWaypointMode = false;
var removeWaypointMode = false;
var selectedCar = -1;
var packets = [];

function reset() {
    isPaused = true;
    clicks = [];
    R = null;
    positions = [];
    packets = [];
    G = null;
    dimensions = { 'x': 4, 'y': 4 };
    range = 200;
    packetDelay = 10;
    packetLife = 100;
    addCarMode = false;
    removeCarMode = false;
    addWaypointMode = false;
    removeWaypointMode = false;
    resetGraphics(two,dimensions);
    isPaused = false;
}

var canvasId = 'main-canvas';
var graphDivId = '#graph-holder';
var routesDivId = '#routes-holder';

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

window.onload = function () {
    reset();
    var elem = document.getElementById(canvasId);
    var params = { width: 512, height: 512, type: Two.Types.svg };
    two = new Two(params).appendTo(elem);

    elem.addEventListener('mouseup', function (evt) {
        var mousePos = getMousePos(elem, evt);
        x = parseInt(mousePos.x * dimensions.x / width);
        y = parseInt(mousePos.y * dimensions.y / height);
        if (addCarMode) {
            addCar(x, y);
        } else if (addWaypointMode) {
            addWaypoint(x, y);
        }
    }, false);

    drawBackground(two, dimensions.x, dimensions.y);
    setInterval(update, frameDelay);
}

function update() {
    // Logic update
    if (!isPaused) {
        fetchData();

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
        if (positions != null && G != null) {
            drawGraph(two, positions, G);
            drawCars(two, positions, range);
            drawPackets(two, positions, packets);
        }
        two.update();
    }

    if (removeCarMode) {
        if (clicks.length >= 1) {
            removeCar(clicks[0]);
            clicks = [];
        }
    } else if (addWaypointMode) {
        if (clicks.length >= 1) {
            selectedCar = clicks[0];
            clicks = [];
        }
    } else if (removeWaypointMode) {
        if (clicks.length >= 1) {
            selectedCar = clicks[0];
            clicks = [];
            removeWaypoint();
            selectedCar = -1;
        }
    } else {
        // Instantiate a new packet
        if (clicks.length == 2) {
            addPacket(clicks[0], clicks[1]);
            clicks = [];
        }
    }
}

function parseJSON(data) {
    positions = data.positions;
    if (positions == null) {
        positions = [];
        return;
    }
    if (data.dimensions != null) {
        dimensions.x = parseInt(data.dimensions.x);
        dimensions.y = parseInt(data.dimensions.y);
    }

    for (var i = 0; i < positions.length; i++) {
        positions[i].p = parseInt(positions[i].p);
        positions[i].t = parseFloat(positions[i].t);
        positions[i].speed = parseFloat(positions[i].speed);
        for (var j = 0; j < positions[i].wp.length; j++) {
            var x = parseInt(positions[i].wp[j][0]);
            var y = parseInt(positions[i].wp[j][1]);
            positions[i].wp[j] = [x, y];
        }
    }
    G = data.G;
    R = data.R;
    if (G != null) {
        for (var i = 0; i < G.length; i++) {
            for (var j = 0; j < G.length; j++) {
                G[i][j] = parseInt(G[i][j]);
                R[i][j] = parseInt(R[i][j]);
            }
        }
    }
    packets = data.packets;
    if (packets == null)
        packets = [];
    for (var i = 0; i < packets.length; i++) {
        packets[i].id = parseInt(packets[i].id);
        packets[i].src = parseInt(packets[i].src);
        packets[i].dest = parseInt(packets[i].dest);
        packets[i].life = parseInt(packets[i].life);
        packets[i].baseDelay = parseInt(packets[i].baseDelay);
        packets[i].delay = parseInt(packets[i].delay);
        packets[i].pos = parseInt(packets[i].pos);
        packets[i].lastPos = parseInt(packets[i].lastPos);
    }
    return [positions, dimensions, G, R, packets];
}

function fetchData() {
    if (packets == null)
        packets = [];
    var dump = {
        'positions': positions,
        'dimensions': dimensions,
        'packets': packets
    };
    //console.log(dump);
    $.ajax
        ({
            type: "POST",
            url: "http://127.0.0.1/update",
            crossDomain: true,
            dataType: "json",
            data: dump
        }).done(function (data) {
            wasPaused = isPaused;
            isPaused = true;
            parseJSON(data);
            isPaused = wasPaused;
        });
}

function addPacket(src, dest) {
    packets.push(new Packet(packets.length, src, dest, packetDelay, packetLife));
}

function addCar(x, y) {
    positions.push({ 'wp': [[x, y]], 'p': 0, 't': 0, 'speed': .02 });
}

function addWaypoint(x, y) {
    if (selectedCar != -1)
        positions[selectedCar].wp.push([x, y]);
}

function removeWaypoint() {
    if (selectedCar != -1)
        positions[selectedCar].wp = [[0, 0]];
}

function removeCar(index) {
    isPaused = true;
    positions.splice(index, 1);
    isPaused = false;
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
                //console.log("Saved");
            });
    }
}

function load() {
    var name = $("#save-name").val();
    if (name.length > 0) {
        reset();
        if (positions != null && G != null) {
            drawGraph(two, positions, G);
            drawCars(two, positions, range);
            drawPackets(two, positions, packets);
        }
        $.ajax
            ({
                type: "POST",
                url: "http://127.0.0.1/load",
                crossDomain: true,
                dataType: "json",
                data: { "name": name }
            }).done(function (data) {
                isPaused = true;
                data.positions = data.cars;
                parseJSON(data);
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
            positions = [{ 'wp': [[0, 0], [0, 1]], 'p': 0, 't': 0, 'speed': 0 },
            { 'wp': [[0, 0], [0, 1]], 'p': 0, 't': 0.75, 'speed': 0 },
            { 'wp': [[0, 1], [1, 1]], 'p': 0, 't': 0.2, 'speed': 0 },
            { 'wp': [[1, 0], [1, 1]], 'p': 0, 't': 0, 'speed': 0 },
            { 'wp': [[1, 0], [1, 1]], 'p': 0, 't': 0.5, 'speed': 0 }
            ];
            resetGraphics(two, dimensions);
            isPaused = false;
            break;
        case "ten_cars":
            isPaused = true;
            dimensions = { 'x': 3, 'y': 3 };
            positions = [];
            for (var i = 0; i < 5; i++) {
                var wp = [];
                for (var j = 0; j < 5; j++) {
                    x = Math.round((dimensions.x - 1) * Math.random());
                    y = Math.round((dimensions.y - 1) * Math.random());
                    wp.push([x, y]);
                }
                position = { 'wp': wp, p: 0, 't': 0, 'speed': 0.01 };
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

function toggleAddCarMode() {
    removeCarMode = false;
    addWaypointMode = false;
    removeWaypointMode = false;
    addCarMode = !addCarMode;
}

function toggleRemoveCarMode() {
    addCarMode = false;
    addWaypointMode = false;
    removeWaypointMode = false;
    removeCarMode = !removeCarMode;
}
function toggleAddWaypointMode() {
    removeCarMode = false;
    addCarMode = false;
    removeWaypointMode = false;
    addWaypointMode = !addWaypointMode;
}

function toggleRemoveWaypointMode() {
    removeCarMode = false;
    addWaypointMode = false;
    addCarMode = false;
    removeWaypointMode = !removeWaypointMode;
}