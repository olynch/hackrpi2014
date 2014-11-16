SIZE = 50;
COLORS = ['rgb(0, 128, 255)','rgb(0, 255, 128)','rgb(128, 0, 255)','rgb(128, 255, 0)','rgb(255, 0, 128)', 'rgb(255, 128, 0)','rgb(255,0,0)','rgb(0,255,0)','rgb(0,0,255)','rgb(128,128,128)'];
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
		window.walls = generateMap(SIZE, .1, .03, 2);
		// Start crafty and set a background color so that we can see it's working
		Crafty.init(Game.width(), Game.height());
		Crafty.background('rgb(255, 255, 255)');
 
		// Place a tree at every edge square on our grid of 16x16 tiles
		for (var i=0; i<SIZE; i++)
			for (var j=0; j<SIZE; j++)
					Crafty.e(walls[i][j]?'Chunk':'Wall')
						.at(i,j)
						.num(walls[i][j])
						.color(walls[i][j]?COLORS[walls[i][j]-1]:'rgb(0,0,0)');
		var s;
		while(true){
			s = [Math.floor(Math.random()*SIZE), Math.floor(Math.random()*SIZE)];
			if(walls[s[0]]&&(walls[s[0]][s[1]]!==null))break
		}
		Crafty.e('PlayerCharacter').at(s[0],s[1]).setChunk(s[0],s[1]);
		UpdatePeriod();
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

Crafty.c('Chunk', {
  init: function() {
	this.requires('Actor, Color')
  },
  num: function(i) {
	this.chunk=i;
	return this
  }
});

Crafty.c('Wall', {
  init: function() {
    this.requires('Actor, Color');
  },
  num: function(){return this}
});

Crafty.c('PlayerCharacter', {
  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x/Game.tile, y: this.y/Game.tile }
    } else {
      this.attr({ x: x * Game.tile, y: y * Game.tile });
    }
	return this
  },
  setChunk: function(x, y) {
  	this.chunk = walls[x][y]
  },
  init: function() {
    this.requires('2D, Canvas, Fourway, HTML, Collision')
	  .attr({w:Game.tile*3/4,h:Game.tile*3/4})
      .fourway(4)
	  .stopOnSolids()
	  .replace('<div id="player"></div>');
	  var t = this;
	  this.ticker = setTimeout(function(){t.checkChunks()},400);
  },
  checkChunks: function() {
	  var t = this;
	  this.ticker = setTimeout(function(){t.checkChunks()},400);
	  var newChunk = walls[Math.floor(this.x/Game.tile)][Math.floor(this.y/Game.tile)];
	  if (newChunk==0 || (newChunk === this.chunk)) {return this}
	  this.chunk = newChunk;
	  Inform(this.chunk);
	  UpdatePeriod();
	  return this
  },
  stopOnSolids: function() {
     this.onHit('Wall', this.stopMovement);
     return this
  },
  stopMovement: function() {
  	this._speed = 0;
  	if (this._movement) {
  		this.x -= this._movement.x;
  		this.y -= this._movement.y;
  	}
  },
});

function UpdatePeriod(){document.getElementById('rate').innerHTML="#player{-webkit-animation:pulsate "+String(Period())+"s ease-out}"}