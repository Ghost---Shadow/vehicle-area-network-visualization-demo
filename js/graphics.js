var roadColor = '#ccccdd';
var carColor = '#ee4422';
var carSize = 20;
var shape = {};
var carRects = [];

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

function drawCars(two, positions) {
    // Delete excess rectangles
    carRects.slice(0, positions.length);

    //  Buffer drawables
    var cars = carRects.length;
    for (var i = 0; i < positions.length - cars; i++) {
        var rect = two.makeRectangle(0, 0, carSize, carSize);        
        rect.fill = carColor;
        rect.opacity = .75;
        rect.noStroke();
        carRects.push(rect);
    }
    // Width and height of canvas
    width = two.width;
    height = two.height;

    // Width and height of each road
    w = width / (shape.x * 2);
    h = height / (shape.y * 2);

    for (var i = 0; i < positions.length; i++) {
        // Interpolate between current and next position
        t = positions[i].t;
        x = (1 - t) * positions[i].x * w * 2
            + t * positions[i].nx * w * 2 + w / 2;
        y = (1 - t) * positions[i].y * h * 2 +
            t * positions[i].ny * h * 2 + h / 2;

        carRects[i].translation.set(x,y);
    }
}
