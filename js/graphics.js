var roadColor = '#ccccdd';
var carColor = '#ee4422';
var radiusColor = '#334433'

var carSize = 20;
var shape = {};
var cars = [];

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
    // Delete excess rectangles
    cars.slice(0, positions.length);

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

function drawGraph(G){

}

function drawPackets(packets){
    
}
