window.Planetary = function(options) {
	this.options = $.extend({
		fps: 30,
		width:1500,
		height:850
	}, options) ;
	
	this.running = false ;
	this.zoomFactor = 1/8 ;	
	this.offset = {
		y: this.options.height/2,
		x: this.options.width/2
	} ;
	this.offsetCopy = this.offset ;
	
	this.relativeOffset = {
		x: 0,
		y: 0
	}
	
	this.frame = this.options.frame ;
	this.bodies = [] ;
	
	// initialize canvas
	this.nativeCanvas = $('<canvas id="planetary"></canvas>') ;
	this.frame.append(this.nativeCanvas) ;
	
	this.canvas = new fabric.StaticCanvas('planetary') ;
	this.canvas.setHeight(this.options.height) ;
	this.canvas.setWidth(this.options.width) ;
	
	this.sun = new Body({
		position: {x: 0, y: 0},
		color: 'yellow',
		velocity: {
			x: 0,
			y: 0
		},
		mass: 5000,
		name: 'sun',
		radius: 80
	}) ;
	this.canvas.add(this.sun.getShape()) ;
	
	/*this.addBody(new Body({
		position: {x: -400, y: 0},
		color: '#0000ff',
		velocity: {
			x: 0,
			y: -20
		},
		mass: 100,
		name: 'planet 1',
		radius: 30
	})) ;
	
	this.addBody(new Body({
		position: {x: -1200, y: 0},
		color: '#ff0000',
		velocity: {
			x: 0,
			y: -14
		},
		mass: 50,
		name: 'planet 2',
		radius: 30
	})) ;
	
	this.addBody(new Body({
		position: {x: -600, y: 0},
		color: '#00ff00',
		velocity: {
			x: 0,
			y: -20
		},
		mass: 5,
		name: 'planet 3',
	})) ;
	
	this.addBody(new Body({
		position: {x: -3000, y: 0},
		color: 'orange',
		velocity: {
			x: 0,
			y: -10
		},
		mass: 500,
		name: 'planet 4',
		radius: 60
	})) ;
	
	this.addBody(new Body({
		position: {x: -3000, y: 200},
		color: 'orange',
		velocity: {
			x: -11,
			y: -10
		},
		mass: 5,
		name: 'planet 4',
		radius: 15
	})) ;
	
	this.addBody(new Body({
		position: {x: -3000, y: -700},
		color: 'orange',
		velocity: {
			x: -5,
			y: -10
		},
		mass: 5,
		name: 'planet 4',
		radius: 25
	})) ;
	
	this.addBody(new Body({
		position: {x: 150, y: 0},
		color: 'purple',
		velocity: {
			x: 0,
			y: 55.5
		},
		mass: 50,
		name: 'planet 4',
		radius: 25
	})) ;
	
	this.addBody(new Body({
		position: {x: 400, y: 0},
		color: 'grey',
		velocity: {
			x: 0,
			y: 30
		},
		mass: 50,
		name: 'planet 4',
		radius: 25
	})) ;*/
	
	this.render() ;
	
	//this.run() ;
} ;

Planetary.prototype.addRandom = function(orbit) {
	var body = new Body({name: 'random planet'}) ;
	body.random() ;
	
	if(orbit === true) {
		body.orbit(this.sun) ;
	}
	
	this.addBody(body) ;
	
	this.render() ;
} ;

Planetary.prototype.run = function() {
	if(this.running) {
		return ;
	}
	
	this.running = true ;
	
	var self = this ;
	this.interval = setInterval(function() {
		
		self.tick() ;
		
	}, 1000/this.options.fps) ;
} ;

Planetary.prototype.stop = function() {
	clearInterval(this.interval) ;
	this.running = false ;
} ;

Planetary.prototype.tick = function() {
	//console.log('tick') ;
	for(var i=0;i<this.bodies.length;i++) {
		// calculate interaction with sun
		this.bodies[i].calculateInteractionWith(this.sun) ;
		
		// calculate interaction with other bodies
		for(var j=0;j<this.bodies.length;j++) {
			// skip self
			if(i === j) {
				continue;
			}
			
			this.bodies[i].calculateInteractionWith(this.bodies[j]) ;
		}
	}
	
	for(var i=0;i<this.bodies.length;i++) {
		this.bodies[i].updatePosition() ;
	}
		
	//this.bodies[1].calculateInteractionWith(this.bodies[0]) ;
	//this.bodies[1].updatePosition() ;
	
	this.render() ;
} ;

Planetary.prototype.addBody = function(body) {
	this.bodies.push(body) ;
	this.canvas.add(body.getShape()) ;
} ;

Planetary.prototype.render = function() {
	this.sun.draw(this.zoomFactor, this.offset) ;
	
	for(var i=0;i<this.bodies.length;i++) {
		this.bodies[i].draw(this.zoomFactor, this.offset) ;
	}
	
	this.canvas.renderAll() ;
} ;

Planetary.prototype.zoom = function(factor) {
	this.zoomFactor = this.zoomFactor*factor ;
	
	// update positions now;
	this.render() ;
	
} ;

Planetary.prototype.move = function(rel) {
	this.offset = {
		x: this.offsetCopy.x + rel.x,
		y: this.offsetCopy.y + rel.y
	} ;
	
	this.render() ;
} ;

Planetary.prototype.lockMove = function() {
	this.relativeOffset = {
		x: this.offset.x - this.offsetCopy.x,
		y: this.offset.y - this.offsetCopy.y
	}
	this.offsetCopy = this.offset ;
} ;


