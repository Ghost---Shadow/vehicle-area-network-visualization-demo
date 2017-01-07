function drawBackground(two, x, y) {
    width = two.width;
    height = two.height;

    w = width / (x * 2);
    h = height / (y * 2);

    for (var i = 0; i < x; i++) {
        var rect = two.makeRectangle(i * h * 2 + h / 2,
            height / 2, h, 512);
        rect.fill = 'rgb(0, 200, 255)';
        rect.opacity = 0.75;
        rect.noStroke();
    }
    for (var j = 0; j < y; j++) {
        var rect = two.makeRectangle(width / 2,
         j * w * 2 + w / 2, 512, w);
        rect.fill = 'rgb(0, 200, 255)';
        rect.opacity = 0.75;
        rect.noStroke();
    }    
}
