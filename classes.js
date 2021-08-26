class Formulas {
    static getDistance(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
    static getSlope(p1, p2) {
        return (p2.y - p1.y)/(p2.x - p1.x);
    }
    static getYIntercept(p, slope) {
        return p.y - slope * p.x;
    }
    static getYFromSlopeInterceptForm(x, slope, b) {
        return slope * x + b;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class GraphicPoint extends Point {
    constructor(ctx, x, y, radius=5) {
        super(x, y);
        this.radius = radius;
        this.moveState = false;
        this.ctx = ctx;

        this.pointPath = new Path2D();
        this.pointPath.arc(x, y, radius, 0, 2 * Math.PI);

        // draw point
        this.paint();
    }
    draw() {
        // draw path2d
        this.ctx.strokeStyle = "black";
        this.ctx.stroke(this.pointPath);
    }
    paint() {
        // clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // update path2d with new x, y coordinates
        this.pointPath = new Path2D();
        this.pointPath.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

        // draw path2d
        this.draw();
    }
    onMouseDown(mouseX, mouseY) {
        if (!this.moveState && this.ctx.isPointInPath(this.pointPath, mouseX, mouseY)) {
            this.moveState = true;
        }
    }
    onMouseMove(mouseX, mouseY) {
        if (this.moveState) {
            this.x = mouseX;
            this.y = mouseY;

            this.paint();
        }
    }
    onMouseUp(mouseX, mouseY) {
        if (this.moveState) {
            this.moveState = false;

            this.paint();
        }
    }
}

class Triangle {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    /** Returns the points of the triangle in ascending order according to the orientation given.
     * @param  {Boolean} orientation Default value is true. True for X, false for Y. It is the axis where it'll base the order of points.
     * @return {Point[]} Ascending points of this triangle according to given orientation.
     */
    getPointsAscending(orientation=true) {
        let ascendPts = [];
        let pts = [this.p1, this.p2, this.p3];

        while (pts.length != 0) {
            let pt = pts[0];
            let index = 0;
            if (pts.length != 1) {
                for (let i = 1; i < pts.length; i++) {
                    if (orientation) {
                        if (pts[i].x < pt.x) {
                            pt = pts[i];
                            index = i;
                        }
                    }
                    else {
                        if (pts[i].y < pt.y) {
                            pt = pts[i];
                            index = i;
                        }
                    }
                }
            }
            ascendPts.push(pts[index]);
            pts.splice(index, 1);
        }
        return ascendPts;
    }
}

class GraphicTriangle extends Triangle {
    constructor(ctx, p1, p2, p3, radius=5) {
        super(p1, p2, p3);
        this.ctx = ctx;
        this.radius = radius;

        // initialize handles
        this.hndl1 = new GraphicPoint(ctx, p1.x, p1.y);
        this.hndl2 = new GraphicPoint(ctx, p2.x, p2.y);
        this.hndl3 = new GraphicPoint(ctx, p3.x, p3.y);

        this.paint();
    }
    draw() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.moveTo(this.p1.x, this.p1.y);
        this.ctx.lineTo(this.p2.x, this.p2.y);
        this.ctx.lineTo(this.p3.x, this.p3.y);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    paint() {
        // clear canvas
        this.ctx.clearRect(0, 0, width, height);

        // update points
        this.p1 = new Point(this.hndl1.x, this.hndl1.y);
        this.p2 = new Point(this.hndl2.x, this.hndl2.y);
        this.p3 = new Point(this.hndl3.x, this.hndl3.y);

        // draw handles
        this.hndl1.draw();
        this.hndl2.draw();
        this.hndl3.draw();

        // draw triangle
        this.draw();
    }
    onMouseDown(mouseX, mouseY) {
        this.hndl1.onMouseDown(mouseX, mouseY);
        this.hndl2.onMouseDown(mouseX, mouseY);
        this.hndl3.onMouseDown(mouseX, mouseY);
    }
    onMouseMove(mouseX, mouseY) {
        this.hndl1.onMouseMove(mouseX, mouseY);
        this.hndl2.onMouseMove(mouseX, mouseY);
        this.hndl3.onMouseMove(mouseX, mouseY);

        this.paint();
    }
    onMouseUp(mouseX, mouseY) {
        this.hndl1.onMouseUp(mouseX, mouseY);
        this.hndl2.onMouseUp(mouseX, mouseY);
        this.hndl3.onMouseUp(mouseX, mouseY);
    }
}

class ElemPointsManager {
    constructor(gTri, gPt, x, y) {
        this.gTri = gTri;
        this.gPt = gPt;
        this.x = x;
        this.y = y;
        this.x.addEventListener('input', () => {
            this.gPt.x = this.x.value;
            this.gPt.paint();
            this.gTri.paint();
        });
        this.y.addEventListener('input', () => {
            this.gPt.y = this.y.value;
            this.gPt.paint();
            this.gTri.paint();
        });
    }
    setElemPoint(x, y) {
        this.x.value = x;
        this.y.value = y;
    }
    getX(){
        return this.x.value;
    }
    getY(){
        return this.y.value;
    }
}

class RebarOnTriangle {
    constructor(gTri, resultElem) {
        this.gTri = gTri;
        this.resultElem = resultElem;
    }
    draw(rebarAmt, orientation=true) {
        let pts = this.gTri.getPointsAscending(orientation);

        let minP = pts[0];
        let midP = pts[1];
        let maxP = pts[2];
        let rebarSpacing = (maxP.x - minP.x) / (rebarAmt + 1);

        let slopeMinPToMidP = Formulas.getSlope(minP, midP);
        let slopeMinPToMaxP = Formulas.getSlope(minP, maxP);
        let slopeMidPToMaxP = Formulas.getSlope(midP, maxP);

        let BminPToMidP = Formulas.getYIntercept(minP, slopeMinPToMidP);
        let BminPToMaxP = Formulas.getYIntercept(minP, slopeMinPToMaxP);
        let BmidPToMaxP = Formulas.getYIntercept(midP, slopeMidPToMaxP);
        
        let startX = minP.x;
        let slope = slopeMinPToMidP
        let b = BminPToMidP;
        let totalLength = 0;
        for (let i = 0; i < rebarAmt; i++) {
            startX += rebarSpacing;
            if (startX >= midP.x) {
                slope = slopeMidPToMaxP;
                b = BmidPToMaxP;
            }

            this.gTri.ctx.beginPath();
            let dy1 = Formulas.getYFromSlopeInterceptForm(startX, slope, b);
            let dy2 = Formulas.getYFromSlopeInterceptForm(startX, slopeMinPToMaxP, BminPToMaxP);
            this.gTri.ctx.strokeStyle = "red";
            this.gTri.ctx.moveTo(startX, dy1);
            this.gTri.ctx.lineTo(startX, dy2);
            this.gTri.ctx.stroke();

            totalLength += Formulas.getDistance(new Point(startX, dy1), new Point(startX, dy2));
        }
        
        this.resultElem.value = totalLength;
    }
}