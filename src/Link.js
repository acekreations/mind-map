var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

export default class Link {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.globalCompositeOperation = "destination-over";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();
    }
}
