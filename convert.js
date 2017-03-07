
function transformGrid() {
	var loadedGrid = JSON.parse(document.getElementById('display').value);
	var i, j, check;
	check = 0;
	var line = "";
	var xLen = loadedGrid.length;
	var yLen = loadedGrid[0].length;
//	console.log(xLen + ", "+yLen);
	for(i=0; i<xLen; i++) {
		for(j=0; j<yLen; j++) {
			if(loadedGrid[i][j] == 1) { 
				line += "C"+i+","+j+".";
			}
		}
	}
	console.log(line);
}
