/*
=================================================
REAL-TIME TRAFFIC NAVIGATION
=================================================

ADSA Concepts Used:

1. Graph
2. Weighted Graph
3. Adjacency List
4. Dijkstra's Algorithm
5. Dynamic Edge Weights
6. Shortest Path
7. Real-Time Traffic Simulation
=================================================
*/


// ================================================
// ROAD NETWORK
// ================================================

const graph = {

    A: {
        B: 5,
        C: 4
    },

    B: {
        A: 5,
        C: 3,
        D: 3
    },

    C: {
        A: 4,
        B: 3,
        E: 6
    },

    D: {
        B: 3,
        F: 4
    },

    E: {
        C: 6,
        F: 5
    },

    F: {
        D: 4,
        E: 5
    }

};


// ================================================
// TRAFFIC LEVELS
// ================================================

let traffic = {

    AB: 1,
    AC: 1,
    BC: 1,
    BD: 1,
    CE: 1,
    DF: 1,
    EF: 1

};


// ================================================
// CREATE ROAD KEY
// ================================================

function getRoadKey(a, b) {

    return [a, b]
        .sort()
        .join("");

}


// ================================================
// DIJKSTRA'S ALGORITHM
// ================================================

function dijkstra(start, destination) {

    const distances = {};
    const previous = {};
    const visited = new Set();


    // Initialize distances

    for (let node in graph) {

        distances[node] = Infinity;

        previous[node] = null;

    }


    distances[start] = 0;


    // Main algorithm

    while (visited.size < Object.keys(graph).length) {

        let current = null;

        let smallestDistance = Infinity;


        // Find nearest unvisited node

        for (let node in distances) {

            if (
                !visited.has(node) &&
                distances[node] < smallestDistance
            ) {

                smallestDistance =
                    distances[node];

                current = node;

            }

        }


        // No more reachable nodes

        if (current === null) {
            break;
        }


        // Destination reached

        if (current === destination) {
            break;
        }


        visited.add(current);


        // Visit neighbors

        for (
            let neighbor in graph[current]
        ) {

            if (visited.has(neighbor)) {
                continue;
            }


            const road =
                getRoadKey(current, neighbor);


            // Traffic multiplier

            const multiplier =
                traffic[road] || 1;


            // Distance × traffic

            const roadCost =
                graph[current][neighbor]
                * multiplier;


            const newDistance =
                distances[current]
                + roadCost;


            // Update shortest distance

            if (
                newDistance <
                distances[neighbor]
            ) {

                distances[neighbor] =
                    newDistance;

                previous[neighbor] =
                    current;

            }

        }

    }


    // ============================================
    // BUILD PATH
    // ============================================

    const path = [];

    let current = destination;


    while (current !== null) {

        path.unshift(current);

        current =
            previous[current];

    }


    // No path

    if (path[0] !== start) {

        return null;

    }


    return {

        path: path,

        distance: distances[destination]

    };

}


// ================================================
// FIND FASTEST ROUTE
// ================================================

function findRoute() {

    const start =
        document.getElementById("start").value;


    const destination =
        document.getElementById("destination").value;


    // Same location

    if (start === destination) {

        document.getElementById("route").innerHTML =
            "⚠️ Start and destination cannot be the same.";

        document.getElementById("distance").innerHTML =
            "";

        document.getElementById("time").innerHTML =
            "";

        document.getElementById("traffic").innerHTML =
            "";

        return;

    }


    // Run Dijkstra

    const result =
        dijkstra(start, destination);


    if (!result) {

        document.getElementById("route").innerHTML =
            "❌ No route available.";

        return;

    }


    // ============================================
    // CLEAR PREVIOUS HIGHLIGHTS
    // ============================================

    document
        .querySelectorAll(".node")
        .forEach(node => {

            node.classList.remove("path");

            node.classList.remove("start");

            node.classList.remove("end");

        });


    // ============================================
    // HIGHLIGHT PATH
    // ============================================

    result.path.forEach(node => {

        document
            .getElementById("node" + node)
            .classList.add("path");

    });


    // Start

    document
        .getElementById("node" + start)
        .classList.add("start");


    // Destination

    document
        .getElementById("node" + destination)
        .classList.add("end");


    // ============================================
    // DISPLAY RESULT
    // ============================================

    document.getElementById("route").innerHTML =
        "🛣️ <b>Fastest Route:</b> " +
        result.path.join(" → ");


    document.getElementById("distance").innerHTML =
        "📏 <b>Travel Cost:</b> " +
        result.distance.toFixed(2) +
        " km";


    // Estimated time

    const estimatedTime =
        result.distance / 0.5;


    document.getElementById("time").innerHTML =
        "⏱️ <b>Estimated Time:</b> " +
        estimatedTime.toFixed(0) +
        " minutes";


    // Traffic status

    const trafficStatus =
        getRouteTraffic(result.path);


    document.getElementById("traffic").innerHTML =
        "🚦 <b>Traffic:</b> " +
        trafficStatus;

}


// ================================================
// GET ROUTE TRAFFIC
// ================================================

function getRouteTraffic(path) {

    let totalTraffic = 0;

    let roadCount = 0;


    for (
        let i = 0;
        i < path.length - 1;
        i++
    ) {

        const road =
            getRoadKey(
                path[i],
                path[i + 1]
            );


        totalTraffic +=
            traffic[road];


        roadCount++;

    }


    const average =
        totalTraffic / roadCount;


    if (average < 1.3) {

        return "🟢 Low Traffic";

    }


    if (average < 2) {

        return "🟡 Medium Traffic";

    }


    return "🔴 High Traffic";

}


// ================================================
// UPDATE TRAFFIC
// ================================================

function updateTraffic() {

    const roads = [

        "AB",
        "AC",
        "BC",
        "BD",
        "CE",
        "DF",
        "EF"

    ];


    // Random traffic

    roads.forEach(road => {

        const random =
            Math.random();


        if (random < 0.5) {

            // Low traffic

            traffic[road] = 1;

        }

        else if (random < 0.8) {

            // Medium traffic

            traffic[road] = 1.5;

        }

        else {

            // High traffic

            traffic[road] = 2.5;

        }

    });


    // Update map colors

    updateRoadColors();


    // Recalculate route

    findRoute();

}


// ================================================
// UPDATE ROAD COLORS
// ================================================

function updateRoadColors() {

    const roads = {

        AB: "roadAB",
        AC: "roadAC",
        BC: "roadBC",
        BD: "roadBD",
        CE: "roadCE",
        DF: "roadDF",
        EF: "roadEF"

    };


    for (let road in roads) {

        const element =
            document.getElementById(
                roads[road]
            );


        const trafficLevel =
            traffic[road];


        if (trafficLevel === 1) {

            // Green

            element.style.background =
                "#22c55e";

        }

        else if (trafficLevel === 1.5) {

            // Yellow

            element.style.background =
                "#eab308";

        }

        else {

            // Red

            element.style.background =
                "#ef4444";

        }

    }

}


// ================================================
// INITIALIZE
// ================================================

updateRoadColors();
