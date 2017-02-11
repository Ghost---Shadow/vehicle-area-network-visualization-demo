var roadColor = '#ccccdd';
var carColor = '#ee4422';
var radiusColor = '#334433'
var packetColor = '#770077';

var carSize = 20;
var packetSize = 10;
var shape = {};
var cars = [];
var ranges = [];
var packetGraphics = []
var lines = [];
var clicks = [];
var R = null;
var positions = [];
var packets = [];
var G = null;
var prevG = null;

function Packet(id, src, dest, baseDelay, life) {
    return { "id": id, "src": src, "dest": dest, "life": life, "baseDelay": baseDelay, "delay": baseDelay, "pos": src, "lastPos": src };
}

function resetGraphics(two, dimensions) {
    if(two == null)
        return;
    two.clear();
    carSize = 20;
    packetSize = 10;
    shape = {};
    cars = [];
    ranges = [];
    packetGraphics = []
    lines = [];
    clicks = [];
    drawBackground(two, dimensions.x, dimensions.y);
}

function clickCar(param) {
    var id = param.currentTarget.id;
    var index = parseInt(id.charAt(id.length - 1));
    console.log(index);
    if (clicks.length == 2)
        clicks = [index];
    else
        clicks.push(index);
}

function drawBackground(two, x, y) {
    two.clear();
    shape.x = x;
    shape.y = y;

    // Width and height of canvas
    width = two.width;
    height = two.height;

    // Width and height of each road
    w = width / (x * 2);
    h = height / (y * 2);
    
    // Vertical Roads
    for (var i = 0; i < x; i++) {
        var rect = two.makeRectangle(i * h * 2 + h / 2,
            height / 2, h, width);
        rect.fill = roadColor;
        rect.opacity = 1.0;
        rect.noStroke();
    }

    // Horizontal Roads
    for (var j = 0; j < y; j++) {
        var rect = two.makeRectangle(width / 2,
            j * w * 2 + w / 2, height, w);
        rect.fill = roadColor;
        rect.opacity = 1.0;
        rect.noStroke();
    }
}

function worldToScreenSpace(position) {
    if(position == null)
        return { 'x': -1, 'y': -1 };
    // Interpolate between current and next position
    var t = position.t;
    var p = position.p;
    var np = (p + 1) % position.wp.length;

    var x = position.wp[p][0];
    var y = position.wp[p][1];
    var nx = position.wp[np][0];
    var ny = position.wp[np][1];
    cx = (1 - t) * x * w * 2
        + t * nx * w * 2 + w / 2;
    cy = (1 - t) * y * h * 2 +
        t * ny * h * 2 + h / 2;

    return { 'x': cx, 'y': cy };
}

function drawCars(two, positions, range) {
    // Delete excess
    var excess = ranges.length - positions.length;
    for (var i = 0; i < excess; i++)
        two.remove(ranges.pop());

    var excess = cars.length - positions.length;
    for (var i = 0; i < excess; i++) {
        var toDelete = cars.pop();
        two.remove(toDelete);
        $(toDelete._renderer.elem).remove();
    }

    //  Buffer drawables
    var carCount = cars.length;
    for (var i = 0; i < positions.length - carCount; i++) {
        var circle = two.makeCircle(0, 0, range);
        circle.noFill();
        circle.stroke = radiusColor;
        ranges.push(circle);
    }

    for (var i = 0; i < positions.length - carCount; i++) {
        var rect = two.makeRectangle(0, 0, carSize, carSize);
        rect.fill = carColor;
        rect.opacity = .75;
        rect.noStroke();

        rect.id = "cars" + cars.length;
        two.update();
        $(rect._renderer.elem).click(clickCar);
        cars.push(rect);
    }
    // Width and height of canvas
    width = two.width;
    height = two.height;

    // Width and height of each road
    w = width / (shape.x * 2);
    h = height / (shape.y * 2);

    for (var i = 0; i < positions.length; i++) {
        pos = worldToScreenSpace(positions[i]);
        cars[i].translation.set(pos.x, pos.y);
        ranges[i].translation.set(pos.x, pos.y);
    }
}

function drawGraph(two, positions, G) {        
    for (var i = 0; i < lines.length; i++)
        two.remove(lines[i]);
    lines = [];
    if (positions.length == 0)
        return;
    for (var i = 0; i < G.length; i++) {
        for (var j = 0; j < i; j++) {
            if (G[i][j] == 1) {
                var pos1 = worldToScreenSpace(positions[i]);
                var pos2 = worldToScreenSpace(positions[j]);
                line = two.makeLine(pos1.x, pos1.y, pos2.x, pos2.y);
                lines.push(line);
            }
        }
    }
}

function getPacketPosition(positions, packet) {
    if (positions.length == 0)
        return { 'x': -1, 'y': -1 };

    if (packet.lastPos == null)
        packet.lastPos = packet.pos;
    var position = positions[packet.lastPos];
    var newPosition = positions[packet.pos];

    var pos1 = worldToScreenSpace(position);
    var pos2 = worldToScreenSpace(newPosition);

    // Interpolate between the screen positions of
    // the two routers
    var t = 1.0 - (packet.delay / packet.baseDelay);
    var x = (1.0 - t) * pos1.x + t * pos2.x;
    var y = (1.0 - t) * pos1.y + t * pos2.y;

    return { 'x': x, 'y': y };
}

function drawPackets(two, positions, packets) {
    if (positions.length == 0 || packets == null)
        return;
    // Delete excess
    var excess = packetGraphics.length - packets.length;
    for (var i = 0; i < excess; i++) {
        two.remove(packetGraphics[packetGraphics.length - 1]);
        packetGraphics.pop();
    }

    //  Buffer drawables
    var needed = packets.length - packetGraphics.length;
    for (var i = 0; i < needed; i++) {
        var newPacket = two.makeCircle(0, 0, packetSize);
        newPacket.noStroke();
        newPacket.fill = packetColor;
        newPacket.opacity = .75;

        packetGraphics.push(newPacket);
    }

    // Reposition all packets
    for (var i = 0; i < packets.length; i++) {
        var packetPosition = getPacketPosition(positions, packets[i]);
        packetGraphics[i].translation.set(packetPosition.x, packetPosition.y);
    }
}
