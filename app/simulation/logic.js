var INF = 1e+10;
var speed = .01;
var dimensions = null;

// --------------
var width = 512;
var height = 512;
var range = 200;
// --------------

function Packet(id, src, dest, baseDelay, life) {
    return { "id": id, "src": src, "dest": dest, "life": life, "baseDelay": baseDelay, "delay": baseDelay, "pos": src, "lastPos": src };
}

function pipe(data) {
    [positions,dimensions,G,R,packets] = parseJSON(data);
    if (positions == null || dimensions == null)
        return [positions, null, null, packets];
    positions = updateCarPositions(dimensions, positions);
    G = updateGraph(positions,dimensions);
    R = updateRoutingInformation(G);
    packets = updatePackets(R, packets);
    return [positions, G, R, packets];
}

function updateCarPositions(dimensions, positions) {
    for (var i = 0; i < positions.length; i++) {
        if (positions[i].speed != null)
            speed = positions[i].speed;
        positions[i].t += speed;
        var p = positions[i].p;
        if (positions[i].t >= 1) {
            positions[i].t = 0;
            var np = (p + 1) % positions[i].wp.length;
            positions[i].p = np;
        }
    }
    return positions;
}

function updateGraph(positions,dimensions) {
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
            G[i][j] = G[j][i] = checkAdjacency(positions, i, j,dimensions);
        }
    }
    return G;
}

function worldToScreenSpace(position,dimensions) {
    // Width and height of each road
    w = width / (dimensions.x * 2);
    h = height / (dimensions.y * 2);

    // Interpolate between current and next position
    var t = position.t;
    var p = position.p;
    var np = (p + 1) % position.wp.length;

    var x = position.wp[p][0];
    var y = position.wp[p][1];
    var nx = position.wp[np][0];
    var ny = position.wp[np][1];
    cx = (1 - t) * x * w * 2
        + t * nx * w * 2 + w / 2;
    cy = (1 - t) * y * h * 2 +
        t * ny * h * 2 + h / 2;

    return { 'x': cx, 'y': cy };
}

function checkAdjacency(positions, i, j,dimensions) {
    var pos1 = worldToScreenSpace(positions[i],dimensions);
    var pos2 = worldToScreenSpace(positions[j],dimensions);
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
    if (path.length != 0)
        path.push(packet.dest);
    else
        path.push(packet.lastPos);
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
            packets[i].lastPos = path[0];
            //console.log(packets[i]);
        }
        newPackets.push(packets[i]);
    }
    return newPackets;
}

function parseJSON(data) {
    positions = data.positions;
    if (positions == null)
        return [data.positions,data.dimensions,data.G,data.R,data.packets];
    if (data.dimensions != null) {
        dimensions.x = parseInt(data.dimensions.x);
        dimensions.y = parseInt(data.dimensions.y);
    }

    for (var i = 0; i < positions.length; i++) {
        positions[i].p = parseInt(positions[i].p);
        positions[i].t = parseFloat(positions[i].t);
        positions[i].speed = parseFloat(positions[i].speed);
        for (var j = 0; j < positions[i].wp.length; j++) {
            var x = parseInt(positions[i].wp[j][0]);
            var y = parseInt(positions[i].wp[j][1]);
            positions[i].wp[j] = [x, y];
        }
    }
    G = data.G;
    R = data.R;
    if (G != null) {
        for (var i = 0; i < G.length; i++) {
            for (var j = 0; j < G.length; j++) {
                G[i][j] = parseInt(G[i][j]);
                R[i][j] = parseInt(R[i][j]);
            }
        }
    }
    packets = data.packets;
    if(packets == null)
        packets = [];
    for(var i = 0; i < packets.length; i++){
        packets[i].id = parseInt(packets[i].id);
        packets[i].src = parseInt(packets[i].src);
        packets[i].dest = parseInt(packets[i].dest);
        packets[i].life = parseInt(packets[i].life);
        packets[i].baseDelay = parseInt(packets[i].baseDelay);
        packets[i].delay = parseInt(packets[i].delay);
        packets[i].pos = parseInt(packets[i].pos);
        packets[i].lastPos = parseInt(packets[i].lastPos);
    }
    return [positions,dimensions,G,R,packets];
}

exports.pipe = pipe;