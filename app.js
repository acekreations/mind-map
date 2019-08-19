var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

let nodes = [];
let activeNode = null;

function Node(x, y, r, body) {
    this.color = "#72fcd5";
    this.x = x;
    this.y = y;
    this.r = r;
    this.dragging = false;
    this.children = [];
    this.link;
    this.body = body;

    this.draw = () => {
        ctx.beginPath();
        ctx.globalCompositeOperation = "source-over";
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();

        this.drawText();
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            child.draw();
            this.link = new Link(this.x, this.y, child.x, child.y);
            this.link.draw();
        }
    };

    this.drawText = () => {
        const fontSize = 16;
        ctx.font = `${fontSize}px Arial`;
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#212121";
        ctx.textAlign = "center";
        const lines = this.getLines(ctx, this.body, this.r * 2);
        let y;
        if (lines.length > 1) {
            y = this.y - (lines.length * fontSize) / 4;
        } else {
            y = this.y + fontSize / 4;
        }
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
            ctx.shadowColor = "rgba(0,0,0,0)";
            ctx.fillText(line, this.x, y);
            y += fontSize;
        }
    };

    this.getLines = (ctx, text, maxWidth) => {
        var words = text.split(" ");
        var lines = [];
        var currentLine = words[0];

        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    };

    this.createChild = (xOffset, yOffset, body) => {
        this.children.push(
            new Node(
                this.x + xOffset,
                this.y + yOffset,
                this.r - this.r / 5,
                body
            )
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
        ctx.strokeStyle = "#fff";
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.globalCompositeOperation = "destination-over";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();
    };
}

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
