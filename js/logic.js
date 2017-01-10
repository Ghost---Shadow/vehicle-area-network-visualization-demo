var INF = 1e+10;
var speed = .01;

function Packet(id, src, dest, baseDelay, life) {
    return { "id": id, "src": src, "dest": dest, "life": life, "baseDelay": baseDelay, "delay": baseDelay, "pos": src, "lastpos": src };
}

function updateCarPositions(dimensions,positions) {
    for(var i = 0; i < positions.length; i++){
        if(positions[i].speed != null)
            speed = positions[i].speed;
        positions[i].t += speed;
        if(positions[i].t >= 1){
            positions[i].x = positions[i].nx;
            positions[i].y = positions[i].ny;
            positions[i].t = 0;
            if(Math.random() > .5){
                positions[i].nx += 1;
                positions[i].nx %= dimensions.x;
            } else {
                positions[i].ny += 1;
                positions[i].ny %= dimensions.y;
            }
        }
    }
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
            if (i == j) {
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

function updateRoutingInformation(G) {
    if (G == null)
        return null;

    // Allocate space and initialize the
    // distance matrix
    R = new Array(G.length);
    distance = new Array(G.length);
    for (var i = 0; i < G.length; i++) {
        R[i] = new Array(G.length);
        distance[i] = new Array(G.length);
        for (var j = 0; j < G.length; j++) {
            if (G[i][j] != 0) {
                distance[i][j] = G[i][j];
                R[i][j] = i;
            } else {
                distance[i][j] = INF;
                R[i][j] = -1;
            }
        }
    }

    // Floyd warshall
    for (var k = 0; k < G.length; k++) {
        for (var i = 0; i < G.length; i++) {
            for (var j = 0; j < G.length; j++) {
                var ikj = distance[i][k] + distance[k][j];
                if (ikj < distance[i][j]) {
                    R[i][j] = R[k][j];
                    distance[i][j] = ikj;
                }
            }
        }
    }

    return R;
}

function getPath(R, packet) {
    var path = [];
    getPathHelper(R, packet.pos, packet.dest, path);
    path.push(packet.dest);
    return path;
}

function getPathHelper(R, u, v, path) {
    if (R[u][v] == u) {
        path.unshift(u);
        return;
    } else if (R[u][v] != -1) {
        path.unshift(R[u][v]);
        getPathHelper(R, u, R[u][v], path);
    }
}

function updatePackets(R, packets) {
    var newPackets = [];
    for (var i = 0; i < packets.length; i++) {
        packets[i].delay--;
        packets[i].life--;
        // If out of life then drop packet
        if (packets[i].life == 0)
            continue;

        if (packets[i].delay == 0) {
            // Destination reached, consume
            if (packets[i].dest == packets[i].pos)
                continue;            

            packets[i].delay = packets[i].baseDelay;
            var path = getPath(R, packets[i]);

            // If no path then wait until death
            if (path.length == 1) {
                newPackets.push(packets[i]);
                continue;
            }

            packets[i].pos = path[1];
            packets[i].lastpos = path[0];
        }
        newPackets.push(packets[i]);
    }
    return newPackets;
}

