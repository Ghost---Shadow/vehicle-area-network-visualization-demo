var two = null;
var range = 50;
var positions = [];
var G = null;
var prevG = null;
var isPaused = false;
var frameDelay = 50;

var canvasId = 'main-canvas';
var graphDivId = '#graph-holder';
var routesDivId = '#routes-holder';

window.onload = function () {
    var elem = document.getElementById(canvasId);
    var params = { width: 512, height: 512, type: Two.Types.svg };
    two = new Two(params).appendTo(elem);

    drawBackground(two, 4, 4);
    setInterval(update, frameDelay);
}

function hasGraphChanged(G, prevG) {
    if (G == null)
        return false;
    if (prevG == null)
        return true;
    if(prevG.length == 0)
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
        G = updateGraph(positions);
        if (hasGraphChanged(G, prevG)) {
            R = updateRoutingInformation(G);
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
    drawCars(two, positions, range);
    two.update();
}

function reset() {
    console.log("reset");
}

function loadScene(name) {
    console.log("Loading " + name);
    switch (name) {
        case "static":
            positions = [{ 'x': 0, 'y': 0, 'nx': 0, 'ny': 1, 't': 0 },
            { 'x': 0, 'y': 1, 'nx': 1, 'ny': 1, 't': 0.75 },
            { 'x': 1, 'y': 1, 'nx': 1, 'ny': 0, 't': 0 },
            { 'x': 1, 'y': 0, 'nx': 0, 'ny': 0, 't': 0.5 }
            ];
            break;
    }
}