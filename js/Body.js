window.Body = function(params) {
	this.position = params.position ;
	this.params = params ;
	this.gravConst = 50 ;

	this.velocity = {x:0,y:0} ;
	if(typeof this.params.velocity !== 'undefined') {
		this.velocity = this.params.velocity ;
	}
	
	this.mass = 0 ;
	if(typeof this.params.mass !== 'undefined') {
		this.mass = this.params.mass ;
	}
	
	this.offset = 0 ;
	if(typeof this.params.offset !== 'undefined') {
		this.offset = this.params.offset ;
	}
	
	this.radius = 20 ;
	if(typeof this.params.radius !== 'undefined') {
		this.radius = this.params.radius ;
	}
	
	this.shape = new fabric.Circle({
		radius: this.radius, 
		fill: params.color,
	}) ;
} ;

Body.prototype.calculateInteractionWith = function(otherBody) {
	var distance  = this.calculateDistanceTo(otherBody) ;
	
	var factor = this.gravConst * otherBody.getMass() / (distance.total*distance.total*distance.total) ;
	
	var force = {
		x: factor * distance.x,
		y: factor * distance.y
	} ;
	
	this.velocity = {
		x: this.velocity.x + force.x,
		y: this.velocity.y + force.y
	} ;
} ;

Body.prototype.random = function() {
	var colors = [
		'red',
		'green',
		'blue',
		'purple',
		'black',
		'grey',
		'cyan',
		'yellow'
	] ;
	
	this.mass = Math.floor(Math.random()*400) ;
	
	this.shape.set({
		fill: colors[parseInt(Math.floor(Math.random()*colors.length)-1)],
		radius: this.mass/400 * 100 + 15
	}) ;
	
	this.position = {
		x: Math.floor(Math.random()*2500) - Math.floor(Math.random()*2500) + 400,
		y: Math.floor(Math.random()*2500) - Math.floor(Math.random()*2500) + 400
	} ;
	
	this.velocity = {
		x: Math.floor(Math.random()*40) - Math.floor(Math.random()*40),
		y: Math.floor(Math.random()*40) - Math.floor(Math.random()*40)
	} ;
} ;

Body.prototype.orbit = function(sun) {
	// calculate necessary velocity
	var distance = this.calculateDistanceTo(sun) ;
	var velo = Math.sqrt(this.gravConst * sun.getMass()/distance.total) ;
	
	// get unit vector orthogonal to r
	var unit = {
		x: -distance.y/distance.total,
		y: distance.x/distance.total
	} ;
	
	this.velocity = {
		x: unit.x * velo,
		y: unit.y * velo
	}

} ;

Body.prototype.intersect = function() {
} ;

Body.prototype.calculateDistanceTo = function(otherBody) {
	var dist = {
		x: (otherBody.position.x - this.position.x),
		y: (otherBody.position.y - this.position.y)
	} ;
	
	dist.total = Math.sqrt(dist.x*dist.x + dist.y*dist.y) ;
	
	return dist ;
} ;

Body.prototype.updatePosition = function() {
	this.position = {
		x: this.position.x + this.velocity.x,
		y: this.position.y + this.velocity.y,
	} ;
} ;

Body.prototype.draw = function(zoom, offset) {
	this.shape.set({
		left: this.position.x * zoom + offset.x,
		top: this.position.y * zoom + offset.y
	}) ;
	
	this.shape.scaleX = zoom ;
	this.shape.scaleY = zoom ;
} ;

Body.prototype.getShape = function() {
	return this.shape ;
} ;

Body.prototype.getName = function() {
	return this.params.name ;
} ;

Body.prototype.getMass = function() {
	return this.mass ;
} ;

Body.prototype.setZoom = function(zoom) {
	this.zoom = zoom ;
} ;

