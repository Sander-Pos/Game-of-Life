var mainCanvas = document.getElementById("DrawArea");
var canvasCtx = mainCanvas.getContext("2d");

var canvasWidth = mainCanvas.width;
var canvasHeight = mainCanvas.height;

// variables 
var toggle = 0; // to toggle play or pause
var loop = 0; // a counter to slow down the animation

// create two empty grids
var conwayGrid = generateGridGlobal();

// load some HTML elements
var notes = document.getElementById("notifier");
var displayArea = document.getElementById("display");

notes.innerHTML = "welcome to the JavaScript Game of Life simulator";
background();
drawSeed();

var requestAnimationFrame = window.requestAnimationFrame ||
							window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
function background() {
	var backgroundElement = document.getElementById("backGround");
	var bgContext = backgroundElement.getContext("2d");
	var n;

	bgContext.fillStyle = "#eeeeff";
	bgContext.fillRect(0,0,canvasWidth,canvasHeight);

	bgContext.beginPath();
	for(n=0;n<=mainCanvas.width;n++) {
		bgContext.moveTo(n*10,0);
		bgContext.lineTo(n*10,400);
	}
	for(n=0;n<=mainCanvas.height;n++) {
		bgContext.moveTo(0,n*10);
		bgContext.lineTo(600,n*10);
	}
	bgContext.closePath();
	bgContext.lineWidth = 1;
	bgContext.strokeStyle = "#aaaaff";
	bgContext.stroke();
	
}
function playStep() {
	if(toggle == 1) {
		loop++;
		if(loop % 5 == 0) {
			gameOfLife();
			drawSeed();
			loop = 0;
		}
		requestAnimationFrame(playStep);
	}
}

function toggleAction() {
// function to pause or play the simulation
	if(toggle == 1) {
		toggle = 0;
		notes.innerHTML = "paused";
	} else if(toggle == 0) {
		toggle = 1;
		notes.innerHTML = "running";
		playStep();
	}
}

function step() {
// function to advance the simulation one single generation
	if(toggle == 1) {
		toggle = 0;
		notes.innerHTML = "paused";
	}
	gameOfLife();
	drawSeed();
}

function gameOfLife() {
// main function for the simulation, following Conway's rules.
	var i, j, x, y, counter;
	var tempGrid = generateGridGlobal();

	for(i=1;i<59;i++) {
		for(j=1;j<39;j++) {
			counter = 0;
			for(x=-1;x<=1;x++) {
				for(y=-1;y<=1;y++) {
					if(x == 0 && y == 0) {
						continue;
					} else if(conwayGrid[(i+x)][(j+y)] == 1) {
						counter++;
						if(counter > 3) { tempGrid[i][j] = 0; break; }
					}
				}
			}
			if(counter == 3) {
				tempGrid[i][j] = 1;
			}
			if(conwayGrid[i][j] == 1) {
				if( counter >= 2 && counter <= 3) {
					tempGrid[i][j] = 1;
				} else { tempGrid[i][j] = 0; }
			}
		}
	}
	conwayGrid = tempGrid.slice();
}

function drawSeed() {
// function to draw the grid
	canvasCtx.clearRect(0,0,canvasWidth,canvasHeight);
	var x, y;
// beginPath starts "recording" the path of strokes on the canvas
	canvasCtx.beginPath();
	for(x=0;x<60;x++) {
		for(y=0;y<40;y++) {
			if(conwayGrid[x][y] == 1) {
				canvasCtx.rect(x*10,y*10,10,10);
			}
		}
	}				
// closePath stops "recording" 
	canvasCtx.closePath();
// fill will finally draw the recorded strokes on the canvas in one go
	canvasCtx.fillStyle = "#aa0000";
	canvasCtx.fill();
}

function toggleGrid(posX, posY) {
// set a cell to active or dead when the user clicks on it
	if(conwayGrid[posX][posY] != 1) {
		conwayGrid[posX][posY] = 1;
	} else {
		conwayGrid[posX][posY] = 0;
	}
}

function generateGridGlobal() {
// function to generate an empty grid to avoid 'undefined' typeErrors
	var emptyGrid = [[],[]];
	var i, j;
	for(i=0;i<60;i++) {
		emptyGrid[i] = [];
		for(j=0;j<40;j++) {
			emptyGrid[i][j] = 0;
		}
	}
	return emptyGrid;
}
function clearGrids() {
// clears the canvas and the active grids, the grid that's being displayed
// and the temporary grid
	canvasCtx.fillStyle = "#ffffff";
	canvasCtx.fillRect(0,0,canvasWidth,canvasHeight);
	conwayGrid = generateGridGlobal();
	drawSeed();
}

function saveGrid() {
//function to convert the active grid to JSON string
	var jsonArray = JSON.stringify(conwayGrid);
	displayArea.value = jsonArray;
}

function loadGrid() {
// function to load the data from the HTML textarea !!has no filtering yet!!
	var txt = document.getElementById("display").value;
	conwayGrid = JSON.parse(txt);
	drawSeed();
}

function locate(mainCanvas,evt) {
// function to find the coordinates of the mouse on the canvas
// and convert it to a grid location.
	var rect = mainCanvas.getBoundingClientRect();
	return {
		a: Math.floor((evt.clientX-rect.left)/(rect.right-rect.left)*canvasWidth/10),
		b: Math.floor((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvasHeight/10)
	};
}

mainCanvas.addEventListener('click', function(evt) {
// function to find the location of the mouse on the grid and draw when the grid
// is being clicked
	if(toggle == 1) {
		toggle = 0;
		notes.innerHTML = "paused";
	}
	var mousePos = locate(mainCanvas,evt);
	toggleGrid(mousePos.a,mousePos.b);
	var noteMessage = "coordinates are: "+mousePos.a+", "+mousePos.b;
	notes.innerHTML = noteMessage;
	drawSeed();
},false);



