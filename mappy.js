
//3rd arg = how likey it is to have a 1 when neighbor is a 1
//4th arg = how many times to add new borders
function generateMap(SIZE, BORDER_CHANCE, NEIGHBOR_BORDER_CHANCE, NUM_PASSES){

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

	for(var pass = 0; pass < NUM_PASSES; pass++){
		for(var row = 0; row < SIZE; row++){

			for(var col = 0; col < SIZE; col++){
				var p = 0;
				for(var key in OFFSETS){
					var nr = row + OFFSETS[key].row;
					var nc = row + OFFSETS[key].col;
					if(nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE){
						p += NEIGHBOR_BORDER_CHANCE;
					}
				}
				if(Math.random() < p){
					map[row][col] = 1;
				}

			}
		}
	}

	return map;
}