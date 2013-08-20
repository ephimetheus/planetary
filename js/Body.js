window.Body = function(params) {
	this.position = params.position ;
	this.params = params ;
	this.gravConst = 50 ;
	this.maxMass = 800 ;
	this.age = 0 ;
	this.planetary = null ;
	this.remove = false ;

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
	
	this.label = new Label(this) ;
	this.selected = false ;
} ;

Body.prototype.select = function() {
	this.selected = true ;
} ;

Body.prototype.attach = function(canvas) {
	canvas.add(this.shape) ;
	canvas.add(this.label.shape) ;
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

Body.prototype.calculateRadius = function() {
	this.radius = (1 - Math.exp(-this.mass/1000)) * 400 + 40 ;
	
	this.shape.set({
		radius: this.radius
	}) ;
} ;

Body.prototype.random = function() {
	this.mass = Math.floor(Math.random()*this.maxMass) ;
	
	this.setRandomColor() ;
	
	this.calculateRadius() ;
	
	this.position = {
		x: Math.floor(Math.random()*2500) - Math.floor(Math.random()*2500) + 400,
		y: Math.floor(Math.random()*2500) - Math.floor(Math.random()*2500) + 400
	} ;
	
	this.velocity = {
		x: Math.floor(Math.random()*40) - Math.floor(Math.random()*40),
		y: Math.floor(Math.random()*40) - Math.floor(Math.random()*40)
	} ;
} ;

Body.prototype.setRandomColor = function() {
	var colors = [
		'red',
		'green',
		'blue',
		'purple',
		'black',
		'grey',
		'violet',
		'tan',
		'olive',
		'gold',
		'cyan',
		'aqua',
		'tomato',
		'yellowgreen'
	] ;
	
	this.params.color = colors[parseInt(Math.floor(Math.random()*colors.length))] ;
	this.shape.set({
		fill: this.params.color
	}) ;
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
		x: unit.x * velo + sun.velocity.x,
		y: unit.y * velo + sun.velocity.y
	}

} ;

Body.prototype.intersect = function(other) {
	if(this.age<20) {
		return false ;
	}
	
	var dist = this.calculateDistanceTo(other) ;
	
	return dist.total < this.radius+other.radius ;
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

Body.prototype.setColor = function(color) {
	this.params.color = color ;
	
	this.shape.set({
		color: this.params.color
	}) ;
	
} ;

Body.prototype.draw = function(zoom, offset) {
	if(this.age<500) {
		this.age++;
	}

	this.shape.set({
		left: this.position.x * zoom + offset.x,
		top: this.position.y * zoom + offset.y
	}) ;
	
	this.shape.scaleX = zoom ;
	this.shape.scaleY = zoom ;
	
	this.label.draw(zoom, offset) ;
} ;

Body.prototype.destroy = function(canvas) {
	canvas.remove(this.shape) ;
	canvas.remove(this.label.shape) ;
} ;

Body.prototype.select = function() {
	this.shape.set({ strokeWidth: 100, stroke: 'rgba(255,255,255,1)' });
}

Body.prototype.unselect = function() {
	this.shape.set({ strokeWidth: 0});
}

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

Body.prototype.getColor = function() {
	return this.params.color ;
} ;

