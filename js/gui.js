var two = null;

window.onload = function () {
    var elem = document.getElementById('main-canvas');
    var params = { width: 512, height: 512, type: Two.Types.svg };
    two = new Two(params).appendTo(elem);

    drawBackground(two, 4, 4);
    two.update();
}

function reset() {
    console.log("reset");
}

function loadScene(name) {
    console.log("Loading " + name);
    switch (name) {
        case "static":
            pos = [{'x':0,'y':0,'nx':0,'ny':1,'t':0},
            {'x':0,'y':1,'nx':1,'ny':1,'t':0.75},
            {'x':1,'y':1,'nx':1,'ny':0,'t':0},
            {'x':1,'y':0,'nx':0,'ny':0,'t':0.5}
            ];
            drawCars(two,pos);
            break;
    }
    two.update();
}