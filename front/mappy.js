function generateMap(SIZE, BORDER_CHANCE, NEIGHBOR_BORDER_CHANCE, NUM_PASSES){

	var map = new Array(SIZE);
	
	//make blocks
	for(var col = 0; col < SIZE; col++){
		map[col] = new Array(SIZE);

		for(var row = 0; row < SIZE; row++){
			//make block, set borders on outside edges
			map[col][row] = -1;	
		}
	}

	//chunk time
	var chunks = getChunkiness(), found, rr, cc;
	for(var ch = 1; ch < chunks+1; ch++){
		while(1){
			rr = Math.floor(Math.random()*SIZE);
			cc = Math.floor(Math.random()*SIZE);
			if(map[rr][cc] == -1){
				map[rr][cc] = ch;
				break;
			}
		}
	}

	var OFFSETS = {
		'top':{col:-1,row:0},
		'left':{col:0,row:-1},
		'bottom':{col:1,row:0},
		'right':{col:0,row:1}
	};

	while(needsChunking(map)){

		var cmap = new Array(SIZE);
		
		//make blocks
		for(var col = 0; col < SIZE; col++){
			cmap[col] = new Array(SIZE);
			for(var row = 0; row < SIZE; row++){
				//make block, set borders on outside edges
				cmap[col][row] = -1;	

			}
		}

		for(var col = 0; col < SIZE; col++){
			for(var row = 0; row < SIZE; row++){
				if(map[col][row] != -1){
					cmap[col][row] = map[col][row];
					var keys = Object.keys(OFFSETS);
					for(var k = 0; k < 4; k++){
						var re = col + OFFSETS[keys[k]].col;
						var ce = row + OFFSETS[keys[k]].row;
						if(map[re] && map[re][ce] && map[re][ce] == -1){
							cmap[re][ce] = map[col][row];
						}
					}
				}	
			}
		}
		map = cmap;
	}


	for(var col = 0; col < SIZE; col++){
		for(var row = 0; row < SIZE; row++){
			//make block, set borders on outside edges
			map[col][row] = Math.random()<BORDER_CHANCE?0:map[col][row];
			if(col == 0 || col == SIZE-1 || row == 0 || row == SIZE-1){
				map[col][row] = 0;
			}		
		}
	}

	for(var pass = 0; pass < NUM_PASSES; pass++){
		for(var col = 0; col < SIZE; col++){

			for(var row = 0; row < SIZE; row++){
				var p = 0;
				for(var key in OFFSETS){
					var nr = col + OFFSETS[key].col;
					var nc = col + OFFSETS[key].row;
					if(nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE){
						p += NEIGHBOR_BORDER_CHANCE;
					}
				}
				if(Math.random() < p){
					map[col][row] = 0;
				}

			}
		}
	}
	var rr, rc;
	while(true){
		rr = Math.floor(Math.random()*SIZE);
		rc = Math.floor(Math.random()*SIZE);
		if(map[rr][rc] === 1){
			debugger;
			map.spawn = {col:rr,row:rc};
			break
		}
	}
	debugger;
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