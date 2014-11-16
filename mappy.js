function generateMap(SIZE, BORDER_CHANCE){

	var map = new Array(SIZE);
	
	//make blocks
	for(var row = 0; row < SIZE; row++){
		map[row] = new Array(SIZE);

		for(var col = 0; col < SIZE; col++){
			//make block, set borders on outside edges
			map[row][col] = {
				'top':row == 0,
				'left':col == 0,
				'bottom':row == SIZE-1,
				'right':col == SIZE-1				
			};			
		}
	}

	var OFFSETS = {
		'top':{row:-1,col:0},
		'left':{row:0,col:-1},
		'bottom':{row:1,col:0},
		'right':{row:0,col:1}
	};

	//generate borders
	for(var row = 0; row < SIZE; row++){
		for(var col = 0; col < SIZE; col++){
			var walls = 0;
			var keys = Object.keys(OFFSETS);
			//console.log(keys);
			for(var key in keys){
				if(map[row][col][key])walls++;
			}
			for(;walls < 3;walls++){
				if(Math.random() < BORDER_CHANCE){
					var key = keys[Math.floor(Math.random()*keys.length)];
					map[row][col][key] = true;
					var bRow = row + OFFSETS[key].row;
					var bCol = col + OFFSETS[key].col;
					if(bRow >= 0 && bRow < SIZE && bCol >= 0 && bCol < SIZE){
						//console.log("n["+bRow+"]["+bCol+"]["+key+"]");
						map[bRow][bCol][key] = true;
					}
					//console.log("["+row+"]["+col+"]["+key+"]");
				}
			}
		}
	}
	
	map.match = function(i, j, k) {
		if (k=='top') {
			return map[i][j-1] && map[i][j-1]['bottom']
		} else if (k=='bottom') {
			return map[i][j+1] && map[i][j+1]['top']
		} else if (k=='left') {
			return map[i-1] && map[i-1][j]['right']
		} else if (k=='right') {
			return map[i+1] && map[i+1][j]['left']
		}
	};

	return map;
}