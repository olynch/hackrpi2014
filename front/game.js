SIZE = 5;
walls = generateMap(SIZE, .3);
Game = {
	// This defines our grid's size and the size of each of its tiles
	map_grid: {
		width:	SIZE,
		height: SIZE,
		tile: {
			width:	16,
			height: 16
		},
		border: 8
	},
 
	// The total width of the game screen. Since our grid takes up the entire screen
	//	this is just the width of a tile times the width of the grid
	width: function() {
		return this.map_grid.width * (this.map_grid.tile.width + this.map_grid.border) + this.map_grid.border;
	},
 
	// The total height of the game screen. Since our grid takes up the entire screen
	//	this is just the height of a tile times the height of the grid
	height: function() {
		return this.map_grid.height * (this.map_grid.tile.height + this.map_grid.border) + this.map_grid.border;
	},
 
	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(), Game.height());
		Crafty.background('rgb(0, 128, 255)');
 
		// Place a tree at every edge square on our grid of 16x16 tiles
		[[0,0],[0,Game.height()-Game.map_grid.border],[0,0],[Game.width()-Game.map_grid.border,0]]
			.forEach(function(coord, i){
				Crafty.e('2D, Canvas, Color')
					.attr({
					  x: coord[0],
					  y: coord[1],
					  w: i<2?Game.width():Game.map_grid.border,
					  h: i<2?Game.map_grid.border:Game.height()
					})
					.color('rgb(20, 185, 40)');
			});
		for (var i=0; i<SIZE; i++) {
			for (var j=0; j<SIZE; j++) {
				['top','bottom','left','right'].forEach(function(k, q){
					var m = (walls[i][j][k] && walls.match(i,j,k));
					if (m) {
						console.log('match',i,j,k,walls);
						Crafty.e('2D, Canvas, Color')
							.attr({
								x: i?i*(Game.map_grid.tile.width * (1 + (q==3)) + Game.map_grid.border):(q==3)*Game.map_grid.tile.width,
								y: j?j*(Game.map_grid.tile.height * (1 + (q==1)) + Game.map_grid.border):(q==1)*Game.map_grid.tile.height,
								w: q<2?Game.map_grid.tile.width+Game.map_grid.border/2:Game.map_grid.border,
								h: q<2?Game.map_grid.border:Game.map_grid.tile.height+Game.map_grid.border/2
							})
							.color('rgb(20,185,40)');
					}
				});
			}
		}
	}
}
