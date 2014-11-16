//SIZE = 50;
SIZE = Math.floor((window.innerHeight-8)/16);
COLORS = [
    '#FFB300', // Vivid Yellow
    '#803E75', // Strong Purple
    '#FF6800', // Vivid Orange
    '#A6BDD7', // Very Light Blue
    '#C10020', // Vivid Red
    '#CEA262', // Grayish Yellow
    '#817066', // Medium Gray
    '#007D34', // Vivid Green
    '#F6768E', // Strong Purplish Pink
    '#00538A', // Strong Blue
    '#FF7A5C', // Strong Yellowish Pink
    '#53377A', // Strong Violet
    '#FF8E00', // Vivid Orange Yellow
    '#B32851', // Strong Purplish Red
    '#F4C800', // Vivid Greenish Yellow
    '#7F180D', // Strong Reddish Brown
    '#93AA00', // Vivid Yellowish Green
    '#593315', // Deep Yellowish Brown
    '#F13A13', // Vivid Reddish Orange
    '#232C16', // Dark Olive Green
];

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
		function randomize(){
			var s;
			while(true){
				s = [Math.floor(Math.random()*SIZE), Math.floor(Math.random()*SIZE)];
				if(walls[s[0]]&&(walls[s[0]][s[1]]!==null))break
			}
			return s
		}
		s = randomize();
		Crafty.e('PlayerCharacter').setChunk(s[0],s[1]);
		document.getElementById('super').style.display='none';
		LOADER.close();
		window.pauseCounter = 0;
		$(window).keydown(function(e){
			if (e.which == 32) {
				if (pauseCounter%2==0) {
					player.stop();
				}
				if (pauseCounter%2==1) {
					player.queue(track.analysis.sections[player.newSectionIndex].children[player.barIndex]);
				}
				pauseCounter++
			}
		});
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
  },
});

Crafty.c('Wall', {
  init: function() {
    this.requires('Actor, Color');
  },
  num: function(){return this}
});

Crafty.c('PlayerCharacter', {
  setChunk: function(x, y) {
	  this.chunk = walls[x][y];
	  return this;
  },
  init: function() {
    this.requires('2D, Canvas, Fourway, HTML, Collision')
	  .attr({w:Game.tile*3/4,h:Game.tile*3/4,x:walls.spawn.col*Game.tile,y:walls.spawn.row*Game.tile})
      .fourway(4)
	  .stopOnSolids()
	  .replace('<div id="player"></div>');
	  var t = this;
	  this.ticker = setTimeout(function(){t.checkChunks()},400);
  },
  checkChunks: function() {
	  var t = this;
	  window.foo=t;
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