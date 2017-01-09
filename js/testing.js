function test() {
    updateRoutingInformationTest();
    getPathTest();
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

    var packet = { 'src': 0, 'dest': 3 };
    path = getPath(R, packet);
    //console.log(path);
    assert(path[0] == 0 && path[1] == 1 && path[2] == 2,
        "Path test 1");

    var packet = { 'src': 1, 'dest': 2 };
    path = getPath(R, packet);
    //console.log(path);
    assert(path[0] == 1, "Path test 2");

    var packet = { 'src': 2, 'dest': 3 };
    path = getPath(R, packet);
    //console.log(path);
    assert(path[0] == 2, "Path test 3");

    var packet = { 'src': 3, 'dest': 0 };
    path = getPath(R, packet);
    //console.log(path);
    assert(path.length == 0, "Path test 4");
}