var two = null;
var range = 50;
var positions = [];
var G = null;
var isPaused = false;
var delay = 50;

var canvasId = 'main-canvas';
var graphDivId = '#graph-holder';

window.onload = function () {
    var elem = document.getElementById(canvasId);
    var params = { width: 512, height: 512, type: Two.Types.svg };
    two = new Two(params).appendTo(elem);

    drawBackground(two, 4, 4);
    setInterval(update,delay);    
}

function update(){  
    // Logic update
    if(!isPaused){
        G = updateGraph(positions);
    }

    // Graphics Update
    drawCars(two,positions,range);  
    two.update();

    // UI update
    var s = "";
    for(var i = 0; i < G.length; i++){
        s += G[i]+"<br />";
    }
    $(graphDivId).html(s);
}

function reset() {
    console.log("reset");
}

function loadScene(name) {
    console.log("Loading " + name);
    switch (name) {
        case "static":
            positions = [{'x':0,'y':0,'nx':0,'ny':1,'t':0},
            {'x':0,'y':1,'nx':1,'ny':1,'t':0.75},
            {'x':1,'y':1,'nx':1,'ny':0,'t':0},
            {'x':1,'y':0,'nx':0,'ny':0,'t':0.5}
            ];            
            break;
    }
}