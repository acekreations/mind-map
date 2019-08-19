var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// ctx.scale(0.5, 0.5);
// ctx.translate(0.5, 0.5);

console.log(window.devicePixelRatio);

let nodes = [];
let activeNode = null;

function Node(color, x, y, r) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.r = r;
    this.dragging = false;
    this.children = [];
    this.link;

    this.draw = () => {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            child.draw();
            this.link = new Link(this.x, this.y, child.x, child.y);
            this.link.draw();
        }
    };

    this.drawLink = (startX, startY, endX, endY) => {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.globalCompositeOperation = "destination-over";
        ctx.lineWidth = 3;
        ctx.closePath();
        ctx.stroke();
    };

    this.createChild = (color, xOffset, yOffset, r) => {
        this.children.push(
            new Node(color, this.x + xOffset, this.y + yOffset, r)
        );
    };
}

function Link(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;

    this.draw = () => {
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.globalCompositeOperation = "destination-over";
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.closePath();
        ctx.stroke();
    };
}

nodes.push(
    new Node("#00fa92", window.innerWidth / 2, window.innerHeight / 2, 60)
);
nodes[0].createChild("#72fcd5", 150, 0, 50);
nodes[0].createChild("ff84ff", 150, 100, 40);
nodes[0].createChild("ff84ff", 250, 100, 30);

nodes[0].children[1].createChild("ff84ff", 150, 100, 20);

draw();
// resize();

canvas.onmousedown = e => {
    setActiveNode(e, nodes);
};

canvas.onmousemove = e => {
    if (activeNode && activeNode.dragging) {
        activeNode.x = e.clientX;
        activeNode.y = e.clientY;
        clear();
        draw();
    }
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
    canvas.width = window.innerWidth * Math.round(window.devicePixelRatio);
    canvas.height = window.innerHeight * Math.round(window.devicePixelRatio);
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        ctx.scale(2, 2);
        node.draw();
    }
}

window.addEventListener("resize", draw);
