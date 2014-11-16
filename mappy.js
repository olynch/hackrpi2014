
console.log(generateMap(20,0.1,0.05, 2));
//3rd arg = how likey it is to have a 1 when neighbor is a 1
//4th arg = how many times to add new borders
function generateMap(SIZE, BORDER_CHANCE, NEIGHBOR_BORDER_CHANCE, NUM_PASSES){

	var map = new Array(SIZE);
	
	//make blocks
	for(var row = 0; row < SIZE; row++){
		map[row] = new Array(SIZE);

		for(var col = 0; col < SIZE; col++){
			//make block, set borders on outside edges
			map[row][col] = -1;	
		}
	}




	//chunk time
	var chunks = getChunkiness();
	for(var ch = 1; ch < chunks+1; ch++){
		var found = false;
		while(!found){
			var rr = Math.floor(Math.random()*SIZE);
			var cc = Math.floor(Math.random()*SIZE);
			if(map[rr][cc] == -1){
				map[rr][cc] = ch;
				found = true;
			}
		}
	}


	var OFFSETS = {
		'top':{row:-1,col:0},
		'left':{row:0,col:-1},
		'bottom':{row:1,col:0},
		'right':{row:0,col:1}
	};



	while(needsChunking(map)){

		var cmap = new Array(SIZE);
		
		//make blocks
		for(var row = 0; row < SIZE; row++){
			cmap[row] = new Array(SIZE);
			for(var col = 0; col < SIZE; col++){
				//make block, set borders on outside edges
				cmap[row][col] = -1;	
			}
		}

		for(var row = 0; row < SIZE; row++){
			for(var col = 0; col < SIZE; col++){
				if(map[row][col] != -1){
					cmap[row][col] = map[row][col];
					var keys = Object.keys(OFFSETS);
					for(var k = 0; k < 4; k++){
						var re = row + OFFSETS[keys[k]].row;
						var ce = col + OFFSETS[keys[k]].col;
						if(map[re] && map[re][ce] && map[re][ce] == -1){
							cmap[re][ce] = map[row][col];
						}
					}
				}	
			}
		}

		map = cmap;
	}




	for(var row = 0; row < SIZE; row++){
		for(var col = 0; col < SIZE; col++){
			//make block, set borders on outside edges
			map[row][col] = Math.random()<BORDER_CHANCE?0:map[row][col];		
		}
	}

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
					map[row][col] = 0;
				}

			}
		}
	}



	return map;
}

function needsChunking(m){
	for(var r = 0; r < m.length; r++){
		for(var c = 0; c < m[r].length; c++){
			if(m[r][c] == -1){

				return true;
			}
		}
	}
	return false;
}



function getChunkiness(){
	return 10;
}