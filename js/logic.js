function Packet(id,src,dest,life){
    return {"id":id,"src":src,"dest":dest,"life":life};
}

function updateCarPositions(positions) {
    return positions;
}

function updateGraph(positions) {
    // Update Graph dimensions when necessary
    //if (G.length != positions.length) {
    if (G == null) {
        var G = new Array(positions.length);
        for (var i = 0; i < G.length; i++) {
            G[i] = new Array(positions.length);
        }
    }

    // Update adjacency graph
    for (var i = 0; i < G.length; i++) {
        for (var j = 0; j <= i; j++) {
            if(i == j){
                G[i][j] = 0;
                continue;
            }
            G[i][j] = G[j][i] = checkAdjacency(positions, i, j);
        }
    }
    return G;
}

function checkAdjacency(positions, i, j) {
    var pos1 = worldToScreenSpace(positions[i]);
    var pos2 = worldToScreenSpace(positions[j]);
    var xdist = pos1.x - pos2.x;
    var ydist = pos1.y - pos2.y;
    var distance = Math.sqrt(xdist * xdist + ydist * ydist);
    return distance < range ? 1 : 0;
}

function updateRoutingInformation(G, prevG) {
    var R = {};
    return R;
}

function updatePackets(R, packets) {
    var newPackets = {};
    return newPackets;
}

