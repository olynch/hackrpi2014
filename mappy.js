
function generateMap(SIZE, BORDER_CHANCE){

	var map = new Array(SIZE);
	
	//make blocks
	for(var row = 0; row < SIZE; row++){
		map[row] = new Array(SIZE);

		for(var col = 0; col < SIZE; col++){
			//make block, set borders on outside edges
			map[row][col] = Math.random()<BORDER_CHANCE?1:0		
		}
	}

	var OFFSETS = {
		'top':{row:-1,col:0},
		'left':{row:0,col:-1},
		'bottom':{row:1,col:0},
		'right':{row:0,col:1}
	};

	for(var row = 0; row < SIZE; row++){

		for(var col = 0; col < SIZE; col++){
			var p = 0;
			for(var key in OFFSETS){
				var nr = row + OFFSETS[key].row;
				var nc = row + OFFSETS[key].col;
				if(nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE){
					p += 0.05;
				}
			}
			if(Math.random() < p){
				map[row][col] = 1;
			}

		}
	}

	return map;
}