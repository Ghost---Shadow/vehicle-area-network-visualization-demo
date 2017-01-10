var roadColor = '#ccccdd';
var carColor = '#ee4422';
var radiusColor = '#334433'
var packetColor = '#770077';

var carSize = 20;
var packetSize = 10;
var shape = {};
var cars = [];
var packetGraphics = []

function drawBackground(two, x, y) {
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
    // Interpolate between current and next position
    t = position.t;
    x = (1 - t) * position.x * w * 2
        + t * position.nx * w * 2 + w / 2;
    y = (1 - t) * position.y * h * 2 +
        t * position.ny * h * 2 + h / 2;

    return { 'x': x, 'y': y };
}

function drawCars(two, positions, range) {
    // Delete excess
    var excess = cars.length - positions.length;
    for(var i = 0; i < excess; i++){
        two.remove(cars[0]);
        cars.pop();
    }

    //  Buffer drawables
    var carCount = cars.length;
    for (var i = 0; i < positions.length - carCount; i++) {
        var rect = two.makeRectangle(0, 0, carSize, carSize);
        rect.fill = carColor;
        rect.opacity = .75;
        rect.noStroke();

        var circle = two.makeCircle(0, 0, range);
        circle.noFill();
        circle.stroke = radiusColor;

        group = two.makeGroup(rect, circle);

        cars.push(group);
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
    }
}

function drawGraph(two, G) {

}

function getPacketPosition(positions, packet) {
    if(packet.lastPos == null)
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
    // Delete excess
    var excess = packetGraphics.length - packets.length;
    for(var i = 0; i < excess; i++){
        two.remove(packetGraphics[0]);
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
