// <!DOCTYPE html>
// <html>
//   <head>
//     <title>Map Canvas</title>
//   </head>
//   <body>
//     <canvas id="mapCanvas"></canvas>
//     <script src="map.js"></script>
//   </body>
// </html>


function loadMapData() {
    const mapData = {
        nodes: [
            { id: "node1", x: 100, y: 100 },
            { id: "node2", x: 200, y: 100 },
            { id: "node3", x: 200, y: 200 },
            { id: "node4", x: 100, y: 200 }
        ],
        edges: [
            { id: "edge1", source: "node1", target: "node2", distance: 100 },
            { id: "edge2", source: "node2", target: "node3", distance: 50 },
            { id: "edge3", source: "node3", target: "node4", distance: 75 },
            { id: "edge4", source: "node4", target: "node1", distance: 90 }
        ]
    };
    return mapData;
}



function drawMap() {
    const canvas = document.getElementById("mapCanvas");
    const ctx = canvas.getContext("2d");
    const mapData = loadMapData();

    // Draw nodes
    ctx.fillStyle = "blue";
    mapData.nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });

    // Draw edges
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    mapData.edges.forEach(edge => {
        const sourceNode = mapData.nodes.find(node => node.id === edge.source);
        const targetNode = mapData.nodes.find(node => node.id === edge.target);
        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.stroke();
        ctx.closePath();
    });
}


// window.onload = function() {
//     drawMap();
//   };




function findShortestPath(startNodeId, endNodeId) {
    const mapData = loadMapData();
    const nodes = mapData.nodes;
    const edges = mapData.edges;

    // Initialize distances and previous nodes
    const distances = {};
    const previousNodes = {};
    nodes.forEach(node => {
        distances[node.id] = Infinity;
        previousNodes[node.id] = null;
    });
    distances[startNodeId] = 0;

    // Initialize priority queue with all nodes
    const queue = new PriorityQueue();
    nodes.forEach(node => {
        queue.enqueue(node.id, distances[node.id]);
    });

    // Loop until we reach the end node or the queue is empty
    while (!queue.isEmpty()) {
        const currentNodeId = queue.dequeue();
        if (currentNodeId === endNodeId) {
            // Found the shortest path
            const path = [];
            let node = nodes.find(node => node.id === endNodeId);
            while (node) {
                path.unshift(node);
                node = nodes.find(n => n.id === previousNodes[node.id]);
            }
            return path;
        }

        const currentDistance = distances[currentNodeId];
        const neighbors = getNeighbors(currentNodeId);
        neighbors.forEach(neighbor => {
            const edge = edges.find(edge => edge.source === currentNodeId && edge.target === neighbor);
            const distance = currentDistance + edge.distance;
            if (distance < distances[neighbor]) {
                distances[neighbor] = distance;
                previousNodes[neighbor] = currentNodeId;
                queue.updatePriority(neighbor, distance);
            }
        });
    }

    // There is no path from start to end node
    return null;

    function getNeighbors(nodeId) {
        const neighbors = [];
        edges.forEach(edge => {
            if (edge.source === nodeId) {
                neighbors.push(edge.target);
            } else if (edge.target === nodeId) {
                neighbors.push(edge.source);
            }
        });
        return neighbors;
    }
}


const element = document.getElementById("player");
const path = findShortestPath(startNodeId, endNodeId);
moveAlongPath(path, element)

function moveAlongPath(path, element) {

    const mapData = loadMapData();
    const nodes = mapData.nodes;
    const edges = mapData.edges;
    
    const moveInterval = setInterval(moveAlongPathHelper, 100);
    let currentIndex = 0;

    function moveAlongPathHelper() {
        const currentNodeId = path[currentIndex];
        const currentNode = nodes.find(node => node.id === currentNodeId);
        const nextNodeId = path[currentIndex + 1];
        const nextNode = nodes.find(node => node.id === nextNodeId);

        const currentLeft = parseInt(element.style.left);
        const currentTop = parseInt(element.style.top);

        const deltaX = nextNode.x - currentNode.x;
        const deltaY = nextNode.y - currentNode.y;

        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const speed = 5;

        const newX = currentLeft + (deltaX / distance) * speed;
        const newY = currentTop + (deltaY / distance) * speed;

        element.style.left = newX + "px";
        element.style.top = newY + "px";

        if (newX >= nextNode.x && newY >= nextNode.y) {
            currentIndex++;
        }

        if (currentIndex === path.length - 1) {
            clearInterval(moveInterval);
        }
    }



}