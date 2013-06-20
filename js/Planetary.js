window.Planetary = function(options) {
	this.options = $.extend({
		fps: 30,
		width:1500,
		height:850,
		onBodyAdd: function() {},
		onBodyRemove: function() {}
	}, options) ;
	
	this.collisionMassThreshold = 10 ;
	this.mergeMassThreshold = 10 ;
	this.bodyLimit = 150 ;
	
	
	this.running = false ;
	this.zoomFactor = 1/16 ;	
	this.offset = {
		y: this.options.height/2,
		x: this.options.width/2
	} ;
	this.offsetCopy = this.offset ;

	this.relativeOffset = {
		x: 0,
		y: 0
	} ;
	
	this.suns = [] ;
	
	this.frame = this.options.frame ;
	this.bodies = [] ;
	
	// initialize canvas
	this.nativeCanvas = $('<canvas id="planetary"></canvas>') ;
	this.frame.append(this.nativeCanvas) ;
	
	this.canvas = new fabric.StaticCanvas('planetary') ;
	this.canvas.setHeight(this.options.height) ;
	this.canvas.setWidth(this.options.width) ;
	
	this.fromObject(this.scenario.regular) ;
	
	this.render() ;
	
	//this.run() ;
} ;

Planetary.prototype.fromObject = function(scenario) {
	var self = this ;
	$.each(scenario.suns, function(index, element) {
		var newBody = new Body(element) ;
		newBody.calculateRadius() ;
		self.addSun(newBody) ;
	}) ;
	
	$.each(scenario.bodies, function(index, element) {
		var newBody = new Body(element) ;
		newBody.calculateRadius() ;
		self.addBody(newBody) ;
	}) ;
} ;

Planetary.prototype.addSun = function(sun) {
	this.suns.push(sun) ;
	this.addBody(sun) ;
}

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
	var remove = [] ;
	var debris = [] ;
	var merge = [] ;
	var mergeBlock = [] ;
	
	for(var i=0;i<this.bodies.length;i++) {
		// calculate interaction with other bodies
		for(var j=0;j<this.bodies.length;j++) {
			// skip self
			if(i === j) {
				continue;
			}
			
			if(this.bodies[i].intersect(this.bodies[j])) {
				// calculate mass difference and use threshold to determine if debris has to be spawned
				if(this.bodies[i].getMass()/this.collisionMassThreshold > this.bodies[j].getMass()) {
					continue;
				}
				
				// calculate if bodies are of similar mass to determine if to merge them
				if(Math.abs(this.bodies[i].getMass()-this.bodies[j].getMass())/this.bodies[i].getMass() < 0.1) {
					if(mergeBlock.indexOf(i) === -1 && mergeBlock.indexOf(j) === -1) {
						merge.push([i, j]) ;
						mergeBlock.push(i) ;
						mergeBlock.push(j) ;
					}
					continue;
				}
				
				remove.push(this.bodies[i]) ;
				debris.push(this.bodies[i]) ;	
				continue;		
			}
			
			this.bodies[i].calculateInteractionWith(this.bodies[j]) ;
		}
	}
	
	for(var y=0;y<merge.length;y++) {
		this.mergeBodies(this.bodies[merge[y][0]], this.bodies[merge[y][1]]) ;
		remove.push(this.bodies[merge[y][0]]) ;
		remove.push(this.bodies[merge[y][1]]) ;
	}
	
	for(var y=0;y<remove.length;y++) {
		this.bodies.splice(this.bodies.indexOf(remove[y]), 1) ;
		remove[y].destroy(this.canvas) ;
	}
	
	for(var k=0;k<debris.length;k++) {
		this.spawnDebris(debris[k]) ;
	}	
	
	for(var i=0;i<this.bodies.length;i++) {
		this.bodies[i].updatePosition() ;
	}
		
	this.render() ;
} ;

Planetary.prototype.mergeBodies = function(body1, body2) {
	var newBody = new Body({
		name: body1.getName()+' & '+body2.getName(),
		color: body1.getColor()
	}) ;
	
	newBody.mass = body1.getMass() + body2.getMass() ;
	newBody.calculateRadius() ;
	
	newBody.position = {
		x: -(body1.position.x - body2.position.x)/2 + body1.position.x,
		y: -(body1.position.y - body2.position.y)/2 + body1.position.y
	} ;
	
	newBody.velocity = {
		x: (body1.velocity.x*body1.getMass() + body2.velocity.x*body2.getMass())/newBody.getMass(),
		y: (body1.velocity.y*body1.getMass() + body2.velocity.y*body2.getMass())/newBody.getMass()
	} ;
	
	this.addBody(newBody) ;
} ;

Planetary.prototype.spawnDebris = function(body) {
	if(this.bodies.length >= this.bodyLimit) {
		return;
	}
	
	if(body.getMass() < 50) {
		// body is too small for debris
		return;
	}
	
	// reduce mass
	var newMass = body.getMass() - 10 ;
	if(newMass < 0) {
		return;
	}
	
	var numDebris = Math.ceil(Math.random()*3)+2 ;
	
	for(var i=0;i<numDebris;i++) {
		var newBody = new Body({name: body.getName() + ' debris'}) ;
		newBody.mass = Math.round(newMass/numDebris) ;
		newBody.setRandomColor() ;
		newBody.calculateRadius() ;
		newBody.velocity = {
			x: body.velocity.x + Math.random()*30 - Math.random()*30,
			y: body.velocity.y + Math.random()*30 - Math.random()*30
		} ;
		
		var relVector = {
			x: Math.random() - Math.random(),
			y: Math.random() - Math.random()
		} ;
		var unit = Math.sqrt(relVector.x*relVector.x + relVector.y*relVector.y) ;
		
		relVector = {
			x: relVector.x/unit,
			y: relVector.y/unit
		} ;
				
		var distance = Math.random()*200+100 ;
				
		newBody.position = {
			x: body.position.x + relVector.x * distance,
			y: body.position.y + relVector.y * distance
		} ;
		
		this.addBody(newBody) ;
	}
	
} ;

Planetary.prototype.clear = function() {
	for(var j=0;j<this.bodies.length;j++) {
		this.bodies[j].destroy(this.canvas) ;
	}
	
	this.bodies = [] ;
}

Planetary.prototype.addBody = function(body) {
	this.bodies.push(body) ;
	this.canvas.add(body.getShape()) ;
	this.canvas.add(body.label.getShape()) ;
	
	this.options.onBodyAdd.call(this) ;
} ;

Planetary.prototype.render = function() {
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
		x: this.offset.x - this.options.width/2,
		y: this.offset.y - this.options.height/2
	} ;
	
	this.offsetCopy = this.offset ;
} ;

Planetary.prototype.scenario = {} ;


