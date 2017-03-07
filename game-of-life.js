
var mainCanvas = document.getElementById("DrawArea");
var canvasCtx = mainCanvas.getContext("2d");

var canvasWidth = mainCanvas.width;
var canvasHeight = mainCanvas.height;

var toggle = 0;
var counter = 0;
var loop = 0;

var conwayGrid = [[],[]];
generateGrid();
var tempGrid = [[],[]];
generateTempGrid();
init();
var notes = document.getElementById("notifier");
var displayArea = document.getElementById("display");

notes.innerHTML = "welcome to the JavaScript Game of Life simulator";
function init() {
	canvasCtx.fillStyle = "#FFFFFF";
	canvasCtx.fillRect(0,0,canvasWidth,canvasHeight);
}
function locate(mainCanvas,evt) {
	var rect = mainCanvas.getBoundingClientRect();
	return {
		a: Math.floor((evt.clientX-rect.left)/(rect.right-rect.left)*canvasWidth/10),
		b: Math.floor((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasHeight/10)
	};
}
var requestAnimationFrame = window.requestAnimationFrame ||
							window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
function drawGrid() {
	canvasCtx.clearRect(0,0,canvasWidth,canvasHeight);
	canvasCtx.fillStyle = "#ffffff";
	canvasCtx.fillRect(0,0,canvasWidth,canvasHeight);

	canvasCtx.beginPath();
	var x, y;
	for(x=0;x<60;x++) {
		for(y=0;y<40;y++) {
			 if(conwayGrid[x][y] == 1) {
				canvasCtx.rect(x*10,y*10,9,9);
			}
		}
	}
	canvasCtx.closePath();

	canvasCtx.fillStyle = "#dd0000";
	canvasCtx.fill();
	canvasCtx.stroke();
	if(toggle == 1) {
		loop++;
		if(loop % 5 == 0) {
			gameOfLife();
			loop = 0;
		}
		requestAnimationFrame(drawGrid);
		generateTempGrid();
	}
}
function toggleAction() {
	if(toggle == 1) {
		toggle = 0;
		notes.innerHTML = "paused";
	} else if(toggle == 0) {
		toggle = 1;
		notes.innerHTML = "running";
		drawGrid();
	}
}
function step() {
	gameOfLife();
	drawGrid();
//	console.log(conwayGrid);
	generateTempGrid();
}
function gameOfLife() {

	var i, j, x, y;
	var counter = 0;
	for(i=1;i<59;i++) {
		for(j=1;j<39;j++) {
			counter = 0;
			for(x=-1;x<=1;x++) {
				for(y=-1;y<=1;y++) {
					//console.log(i+x);
					if(x == 0 && y == 0) {
						continue;
					} else if(conwayGrid[(i+x)][(j+y)] == 1) {
						counter++;
					}
					
				}
			}
			
			if(counter == 3) {
				tempGrid[i][j] = 1;
			//	console.log("birth at: "+i+", "+j);
			}
			if(conwayGrid[i][j] == 1) {
				if( counter >= 2 && counter <= 3) {
					tempGrid[i][j] = 1;
				} else if(counter < 2) {
					tempGrid[i][j] = 0;
				//console.log("death at: "+i+", "+j);
				} else if(counter > 3) {
					tempGrid[i][j] = 0;
				//console.log("death at: "+i+", "+j);
				}
			}
			/*
			if( counter == 1 ||
				counter == 3 || 
				counter == 5 ||
				counter == 7 ) {
				tempGrid[i][j] = 1;
			} else { 
				tempGrid[i][j] = 0;
			} */

		}
	}

	conwayGrid = tempGrid.slice();
}
function drawSeed() {
	canvasCtx.fillStyle = "#aaaaff";
	canvasCtx.fillRect(0,0,canvasWidth,canvasHeight);
	var x, y;
	for(x=0;x<60;x++) {
		for(y=0;y<40;y++) {
			if(conwayGrid[x][y] == 1) {
			canvasCtx.fillStyle = "#ff0000";
			canvasCtx.fillRect(x*10,y*10,9,9);
			} else if (conwayGrid[x][y] == 0) {
				canvasCtx.fillStyle = "#ffffff";
				canvasCtx.fillRect(x*10,y*10,9,9);
			}
		}
	}
}

function toggleGrid(posX, posY) {
	if(conwayGrid[posX][posY] != 1) {
		conwayGrid[posX][posY] = 1;
		notes.innerHTML = "set to false at"+posX+", "+posY;
	} else {
		conwayGrid[posX][posY] = 0;
	}
}

function generateTempGrid() {
	var i, j;
	for(i=0;i<60;i++) {
		tempGrid[i] = [];
		for(j=0;j<40;j++) {
			tempGrid[i][j] = 0;
		}
	}
}
function generateGrid() {
	var i, j;
	for(i=0;i<60;i++) {
		conwayGrid[i] = [];
		for(j=0;j<40;j++) {
			conwayGrid[i][j] = 0;

		}
	}
}
function clearGrids() {
	canvasCtx.fillStyle = "#ffffff";
	canvasCtx.fillRect(0,0,canvasWidth,canvasHeight);
	generateGrid();
	generateTempGrid();
//	console.log(conwayGrid);
	drawSeed();
}
function saveGrid() {
	var jsonArray = JSON.stringify(conwayGrid);
	//console.log(jsonArray);
	displayArea.value = jsonArray;
}
function loadGrid() {
	var txt = document.getElementById("display").value;
	conwayGrid = JSON.parse(txt);
	drawSeed();
}
mainCanvas.addEventListener('click', function(evt) {

	var mousePos = locate(mainCanvas,evt);
	toggleGrid(mousePos.a,mousePos.b);
	var noteMessage = "coordinates are: "+mousePos.a+", "+mousePos.b;
	notes.innerHTML = noteMessage;
	drawSeed();
//	console.log(conwayGrid);
},false);



