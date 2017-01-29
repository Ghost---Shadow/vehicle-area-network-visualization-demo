function test() {
    updateRoutingInformationTest();
    getPathTest();
    updatePacketsTest();
    getPacketPositionTest();
    console.log("All tests done");
}
function assert(condition, message) {
    if (!condition)
        console.log(message);
}
function updateRoutingInformationTest() {
    var G = [[0, 5, 0, 10],
    [0, 0, 3, 0],
    [0, 0, 0, 1],
    [0, 0, 0, 0]];
    R = updateRoutingInformation(G);
    /*var ans = [
        [INF, 5, 8, 9],
        [INF, INF, 3, 4],
        [INF, INF, INF, 1],
        [INF, INF, INF, INF]
    ];*/
    var ans = [
        [-1, 0, 1, 2],
        [-1, -1, 1, 2],
        [-1, -1, -1, 2],
        [-1, -1, -1, -1]
    ];
    //console.log(R);
    for (var i = 0; i < G.length; i++) {
        for (var j = 0; j < G.length; j++) {
            assert(R[i][j] == ans[i][j], "pathfinding test failed");
        }
    }
}

function getPathTest() {
    var R = [
        [-1, 0, 1, 2],
        [-1, -1, 1, 2],
        [-1, -1, -1, 2],
        [-1, -1, -1, -1]
    ];

    var packet = new Packet(0, 0, 3, 1, 1000);
    path = getPath(R, packet);
    //console.log(path);
    assert(path[0] == 0 && path[1] == 1 &&
        path[2] == 2 && path[3] == 3 && path.length == 4,
        "Failed Path test 1");

    var packet = new Packet(0, 0, 1, 1, 1000);
    path = getPath(R, packet);
    //console.log(path);
    assert(path[0] == 0 && path[1] == 1 && path.length == 2,
        "Failed Path test 2");

    var packet = new Packet(0, 1, 2, 1, 1000);
    path = getPath(R, packet);
    //console.log(path);
    assert(path[0] == 1 && path[1] == 2 && path.length == 2,
        "Failed Path test 3");

    var packet = new Packet(0, 3, 0, 1, 1000);
    path = getPath(R, packet);
    //console.log(path);
    assert(path.length == 1, "Failed Path test 4");

    var packet = new Packet(0, 3, 3, 1, 1000);
    path = getPath(R, packet);
    //console.log(path);
    assert(path.length == 1, "Failed Path test 5");
}

function updatePacketsTest() {
    var packet1 = new Packet(0, 0, 3, 1, 5);
    var packet2 = new Packet(0, 0, 3, 2, 5);
    var packet3 = new Packet(1, 3, 0, 1, 5);
    var packet4 = new Packet(1, 3, 3, 1, 5);
    var R = [
        [-1, 0, 1, 2],
        [-1, -1, 1, 2],
        [-1, -1, -1, 2],
        [-1, -1, -1, -1]
    ];
    var packets = [packet1, packet2, packet3, packet4];

    packets = updatePackets(R, packets);
    assert(packets.length == 3 && packets[0].pos == 1
        && packets[1].pos == 0 && packets[2].pos == 3,
        "Failed updatePacketsTest 1");

    packets = updatePackets(R, packets);
    assert(packets.length == 3 && packets[0].pos == 2
        && packets[1].pos == 1 && packets[2].pos == 3,
        "Failed updatePacketsTest 2");
/*
    packets = updatePackets(R, packets);
    assert(packets.length == 3 && packets[0].pos == 3
        && packets[1].pos == 2 && packets[2].pos == 3,
        "Failed updatePacketsTest 3");
    
    console.log(packets[1]);
    console.log(packets.length == 3);
    console.log(packets[0].pos == 3); 
    console.log(packets[1].pos == 2); 
    console.log(packets[2].pos == 3);   

    packets = updatePackets(R, packets);
    assert(packets.length == 3 && packets[0].pos == 3
        && packets[1].pos == 2 && packets[2].pos == 3,
        "Failed updatePacketsTest 4");

    packets = updatePackets(R, packets);
    assert(packets.length == 2 && packets[0].pos == 3
        && packets[1].pos == 3,
        "Failed updatePacketsTest 5");

    packets = updatePackets(R, packets);
    assert(packets.length == 0, "Failed updatePacketsTest 6");*/
}

function getPacketPositionTest(){
    var position1 = { 'wp': [[0, 0]], 'p': 0, 't': 0, 'speed': .00 };
    var position2 = { 'wp': [[1, 0]], 'p': 0, 't': 0, 'speed': .00 };
    var positions = [position1,position2];
    var packet = new Packet(0,0,1,100,100);
    packet.lastPos = 0;
    packet.pos = 1;

    packet.delay = 10;
    var position = getPacketPosition(positions,packet);
    //console.log(position);

    packet.delay = 5;
    var position = getPacketPosition(positions,packet);
    //console.log(position);

    packet.delay = 0;
    var position = getPacketPosition(positions,packet);
    //console.log(position);
}