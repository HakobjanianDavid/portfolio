let currentTool;
const toolschoose = document.querySelectorAll('.chooseOfInstrument > div');
const additionalPixels = document.querySelectorAll('.pixel');

let canvasWidth = 600;
let canvasHeight = 600;
let line_Width = 2;
let strokeColor = 'black';
let savedImageData;
let dragging = false;
let fillColor = 'black';


for(let i = 0; i < toolschoose.length; i++) {
    toolschoose[i].onclick = function(){
        SelectTool(toolschoose[i].id, toolschoose);
    };
}

for(let i = 0; i < additionalPixels.length; i++) {
    additionalPixels[i].onclick = function() {
        SelectPXSize(additionalPixels[i].id, additionalPixels);
    }
}

function SelectTool(toolClicked, allTools) {
    for (let i = 0; i < allTools.length; i++) {
        if(allTools[i].classList.contains('selected')) {
            allTools[i].classList.remove('selected');
        }
    }
    document.getElementById(toolClicked).classList.add('selected');
    currentTool = toolClicked;
}

function SelectPXSize(clickedElement, pixelsArray) {
    for (let i = 0; i < pixelsArray.length; i++) {
        if(pixelsArray[i].classList.contains('selected')) {
            pixelsArray[i].classList.remove('selected');
        }
    }
    document.getElementById(clickedElement).classList.add('selected');
}

let usingBrush = false;
// Stores line x & ys used to make brush lines
let brushXPoints = [];
let brushYPoints = [];
// Stores whether mouse is down
let brushDownPos = [];

class ShapeBoundingBox{
    constructor(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}
 
// Holds x & y position where clicked
class MouseDownPos{
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}
 
// Holds x & y location of the mouse
class Location{
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}
 
let shapeBoundingBox = new ShapeBoundingBox(0,0,0,0);
let mousedown = new MouseDownPos(0,0);
let loc = new Location(0,0);

document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas(){
    // Get reference to canvas element
    canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get methods for manipulating the canvas
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = line_Width;
    // Execute ReactToMouseDown when the mouse is clicked
    canvas.addEventListener("mousedown", ReactToMouseDown);
    // Execute ReactToMouseMove when the mouse is clicked
    canvas.addEventListener("mousemove", ReactToMouseMove);
    // Execute ReactToMouseUp when the mouse is clicked
    canvas.addEventListener("mouseup", ReactToMouseUp);
}

function GetMousePosition(x,y){
   // Get canvas size and position in web page
   let canvasSizeData = canvas.getBoundingClientRect();
   return { x: (x - canvasSizeData.left) * (canvas.width  / canvasSizeData.width),
       y: (y - canvasSizeData.top)  * (canvas.height / canvasSizeData.height)
     };
}

function SaveCanvasImage(){
   // Save image
   savedImageData = ctx.getImageData(0,0,canvas.width,canvas.height);
}

function RedrawCanvasImage(){
    // Restore image
    ctx.putImageData(savedImageData,0,0);
}

function UpdateRubberbandSizeData(loc){
    shapeBoundingBox.width = Math.abs(loc.x - mousedown.x);
    shapeBoundingBox.height = Math.abs(loc.y - mousedown.y);

    if(loc.x > mousedown.x){
        shapeBoundingBox.left = mousedown.x;
    } else {
        shapeBoundingBox.left = loc.x;
    }
    if(loc.y > mousedown.y){
        shapeBoundingBox.top = mousedown.y;
    } else {
        shapeBoundingBox.top = loc.y;
    }
}

function drawRubberbandShape(loc){
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    if(currentTool === "brush"){
        // Create paint brush
        line_Width = 8;
        DrawBrush();
    } else if(currentTool === "line"){
        // Draw Line
        ctx.beginPath();
        ctx.moveTo(mousedown.x, mousedown.y);
        ctx.lineTo(loc.x, loc.y);
        ctx.stroke();
    }
}

function UpdateRubberbandOnMove(loc){
    UpdateRubberbandSizeData(loc);
    drawRubberbandShape(loc);

}

function AddBrushPoint(x, y, mouseDown){
    brushXPoints.push(x);
    brushYPoints.push(y);
    // Store true that mouse is down
    brushDownPos.push(mouseDown);
}

function DrawBrush(){
    for(let i = 1; i < brushXPoints.length; i++){
        ctx.beginPath();
 
        if(brushDownPos[i]){
            ctx.moveTo(brushXPoints[i-1], brushYPoints[i-1]);
        } else {
            ctx.moveTo(brushXPoints[i]-1, brushYPoints[i]);
        }
        ctx.lineTo(brushXPoints[i], brushYPoints[i]);
        ctx.closePath();
        ctx.stroke();
    }
}
 
function ReactToMouseDown(e){
    canvas.style.cursor = "crosshair";

    loc = GetMousePosition(e.clientX, e.clientY);

    SaveCanvasImage();

    mousedown.x = loc.x;
    mousedown.y = loc.y;

    dragging = true;

    if(currentTool === 'brush'){
        for(let i = 0; i < additionalPixels.length; i++) {
            if(additionalPixels[i].classList.contains('selected')) {
                ctx.lineWidth = additionalPixels[i].id;
            }
        }
        usingBrush = true;
        AddBrushPoint(loc.x, loc.y);
    }
}

function ReactToMouseMove(e){
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);

    if(currentTool === 'brush' && dragging && usingBrush){
        if(loc.x > 0 && loc.x < canvasWidth && loc.y > 0 && loc.y < canvasHeight){
            AddBrushPoint(loc.x, loc.y, true);
        }
        RedrawCanvasImage();
        DrawBrush();
    } else {
        if(dragging){
            RedrawCanvasImage();
            UpdateRubberbandOnMove(loc);
        }
    }
}

function ReactToMouseUp(e){
    canvas.style.cursor = "default";
    loc = GetMousePosition(e.clientX, e.clientY);
    RedrawCanvasImage();
    UpdateRubberbandOnMove(loc);
    dragging = false;
    usingBrush = false;
}