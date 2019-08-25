var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

import Node from "./Node.js";

let nodes = [];
let activeNode = null;
let hoverNode = null;

nodes.push(
    new Node(
        window.innerWidth / 2,
        window.innerHeight / 2,
        60,
        "words go here and other stuff words go here and other stuff"
    )
);
nodes[0].createChild(150, -150, "words go here and other stuff");
nodes[0].createChild(150, 0, "adf");
nodes[0].createChild(150, 150, "asdf");
nodes[0].createChild(-150, 0, "asdf");

nodes[0].children[1].createChild(150, 0, "asdf");
nodes[0].children[1].children[0].createChild(150, 0, "sadfwe");

draw();

canvas.onmousedown = e => {
    setActiveNode(e, nodes);
};

canvas.onmousemove = e => {
    //move node
    if (activeNode && activeNode.dragging) {
        activeNode.x = e.clientX;
        activeNode.y = e.clientY;
    }

    //draw hover
    nodes.forEach(node => {
        node.hover(e, node);
    });
    draw();
};

canvas.onmouseup = e => {
    if (activeNode) {
        activeNode.dragging = false;
    }
    activeNode = null;
};

function setActiveNode(e, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        nodeCheck(nodes[i]);
    }

    function nodeCheck(node) {
        if (checkCoordinance(node)) {
            node.dragging = true;
            activeNode = node;
            return;
        }
        if (node.children.length > 0) {
            for (let j = 0; j < node.children.length; j++) {
                nodeCheck(node.children[j]);
            }
        } else {
            return;
        }
    }

    //determine if the mouse is over certain coordinance
    function checkCoordinance(node) {
        const x = e.clientX;
        const y = e.clientY;
        if (
            Math.sqrt(
                (x - node.x) * (x - node.x) + (y - node.y) * (y - node.y)
            ) < node.r
        ) {
            return true;
        }
        return false;
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clear();
    canvas.width = window.innerWidth * Math.round(window.devicePixelRatio);
    canvas.height = window.innerHeight * Math.round(window.devicePixelRatio);
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        ctx.scale(2, 2);
        node.draw();
    }
}

window.addEventListener("resize", draw);
