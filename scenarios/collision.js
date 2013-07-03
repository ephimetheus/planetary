window.Planetary.prototype.scenario.collision = {
	suns: [],
	bodies: []
} ;

var planets = 15 ;
var height = 8000 ;

for(var i=1;i<=planets;i++) {
	
	var x = -height/2 + i*height/planets ;
	
	window.Planetary.prototype.scenario.collision.bodies.push({
		position: {x: x, y: -3000},
		color: 'orange',
		velocity: {
			x: 0,
			y: 100
		},
		mass: 500,
		name: 'planet '+(i),
	}) ;
	
	window.Planetary.prototype.scenario.collision.bodies.push({
		position: {x: x, y: 3000},
		color: 'orange',
		velocity: {
			x: 0,
			y: -100
		},
		mass: 500,
		name: 'planet '+(2*i+1),
	}) ;
}