SIZE = 50;
walls = generateMap(SIZE, .1, .03, 2);
Game = {
	// This defines our grid's size and the size of each of its tiles
	tile: 16,
 
	// The total width of the game screen. Since our grid takes up the entire screen
	//	this is just the width of a tile times the width of the grid
	width: function() {
		return SIZE * this.tile;
	},
 
	// The total height of the game screen. Since our grid takes up the entire screen
	//	this is just the height of a tile times the height of the grid
	height: function() {
		return SIZE * this.tile;
	},
 
	// Initialize and start our game
	start: function() {
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(), Game.height());
		Crafty.background('rgb(0, 128, 255)');
 
		// Place a tree at every edge square on our grid of 16x16 tiles
		for (var i=0; i<SIZE; i++)
			for (var j=0; j<SIZE; j++)
				if (walls[i][j]===null)
					Crafty.e('Block')
						.at(i,j)
						.color('rgb(20, 185, 40)');
		var s;
		while(true){
			s = [Math.floor(Math.random()*SIZE), Math.floor(Math.random()*SIZE)];
			if(walls[s[0]]&&(walls[s[0]][s[1]]!==null))break
		}
		Crafty.e('PlayerCharacter').at(s[0],s[1]);
	}
};

Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.tile,
      h: Game.tile
    })
  },
 
  // Locate this entity at the given position on the grid
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.tile, y: this.y/Game.tile }
    } else {
      this.attr({ x: x * Game.tile, y: y * Game.tile });
    }
	return this;
  }
});

Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	},
});

Crafty.c('Block', {
  init: function() {
    this.requires('Actor, Solid, Color');
  },
});

Crafty.c('PlayerCharacter', {
  init: function() {
    this.requires('Actor, Fourway, Color, Collision')
      .fourway(4)
	  .stopOnSolids()
      .color('rgb(0, 0, 0)')
	  .collision(new Crafty.circle(8,8,6));
  },
  stopOnSolids: function() {
     this.onHit('Solid', this.stopMovement);
     return this;
   },
   stopMovement: function() {
   		this._speed = 0;
   		if (this._movement) {
   			this.x -= this._movement.x;
   			this.y -= this._movement.y;
   		}
   	},
});