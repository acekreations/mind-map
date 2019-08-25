import Link from "./Link";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

export default class Node {
    constructor(x, y, r, body) {
        this.color = "#72fcd5";
        this.x = x;
        this.y = y;
        this.r = r;
        this.dragging = false;
        this.children = [];
        this.link;
        this.body = body;
        this.hovering = false;
    }

    draw() {
        ctx.beginPath();
        ctx.globalCompositeOperation = "source-over";
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        if (this.hovering) {
            ctx.strokeStyle = "#ff7d78";
        } else {
            ctx.strokeStyle = "#fff";
        }
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
    }

    drawText() {
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
    }

    getLines(ctx, text, maxWidth) {
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
    }

    createChild(xOffset, yOffset, body) {
        this.children.push(
            new Node(
                this.x + xOffset,
                this.y + yOffset,
                this.r - this.r / 5,
                body
            )
        );
    }

    //determine if the mouse is over certain coordinance
    checkCoordinance(e, node) {
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

    //search node tree and return matching node
    hover(e, node) {
        node.hovering = false;
        if (this.checkCoordinance(e, node)) {
            node.hovering = true;
            return node;
        } else if (node.children.length > 0) {
            let result = false;
            for (let j = 0; result == false && j < node.children.length; j++) {
                result = this.hover(e, node.children[j]);
            }
            return result;
        }

        return false;
    }
}
