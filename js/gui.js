window.onload = function () {
    var elem = document.getElementById('main-canvas');
    var params = { width: 512, height: 512, type:Two.Types.svg };
    var two = new Two(params).appendTo(elem);

    drawBackground(two,4,4);
    two.update();
}

function reset(){
    console.log("reset");
}

function loadScene(name){
    console.log("Loading "+name);
}