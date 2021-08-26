var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

c.setAttribute('width', window.innerWidth);
c.setAttribute('height', window.innerHeight);

var width = c.width;
var height = c.height;

window.addEventListener('resize', () => {
    c.setAttribute('width', window.innerWidth);
    c.setAttribute('height', window.innerHeight);

    width = c.width;
    height = c.height;
});

var gTriangle = new GraphicTriangle(
    ctx,
    new Point(500, 200),
    new Point(400, 600),
    new Point(800, 400)
)

/* ====================== HTML Elements ======================= */
/* Inputs */
var p1Elem = new ElemPointsManager(
    gTriangle,
    gTriangle.hndl1,
    document.getElementById("p1-coord-inputs").children[0], 
    document.getElementById("p1-coord-inputs").children[1]
);
var p2Elem = new ElemPointsManager(
    gTriangle,
    gTriangle.hndl2,
    document.getElementById("p2-coord-inputs").children[0], 
    document.getElementById("p2-coord-inputs").children[1]
);
var p3Elem = new ElemPointsManager(
    gTriangle,
    gTriangle.hndl3,
    document.getElementById("p3-coord-inputs").children[0], 
    document.getElementById("p3-coord-inputs").children[1]
);
var rebarAmtElem = document.getElementById("no-of-rebars-input");

/* Outputs */
var totalLengthElem = document.getElementById("total-length-output");
/* ============================================================ */

/* set starting inputs */
p1Elem.setElemPoint(gTriangle.hndl1.x, gTriangle.hndl1.y);
p2Elem.setElemPoint(gTriangle.hndl2.x, gTriangle.hndl2.y);
p3Elem.setElemPoint(gTriangle.hndl3.x, gTriangle.hndl3.y);
rebarAmtElem.value = 10;
rebarAmtElem.addEventListener('input', () => {
    gTriangle.paint();
    rebarTri.draw(parseInt(rebarAmtElem.value));
})

var rebarTri = new RebarOnTriangle(gTriangle, totalLengthElem);

/* ===================== CANVAS EVENTS ====================== */
c.addEventListener('mousedown', function(event) {
    gTriangle.onMouseDown(event.offsetX, event.offsetY);
});

c.addEventListener('mousemove', function(event) {
    gTriangle.onMouseMove(event.offsetX, event.offsetY);

    /* update html element points */
    p1Elem.setElemPoint(gTriangle.hndl1.x, gTriangle.hndl1.y);
    p2Elem.setElemPoint(gTriangle.hndl2.x, gTriangle.hndl2.y);
    p3Elem.setElemPoint(gTriangle.hndl3.x, gTriangle.hndl3.y);

    /* draw rebars */
    rebarTri.draw(parseInt(rebarAmtElem.value));
});

c.addEventListener('mouseup', function(event) {
    gTriangle.onMouseUp(event.offsetX, event.offsetY);
});
/* ========================================================== */

// var scale = .1;
// c.addEventListener('wheel', function(event) {
//     if (event.deltaY < 0) // scrolling up
//     {
//         ctx.scale(1+scale, 1+scale);
//         gTriangle.paint();
//     }
//     else if (event.deltaY > 0) // scrolling down
//     {
//         ctx.scale(1-scale, 1-scale);
//         gTriangle.paint();
//     }
// })

/* io box js */

