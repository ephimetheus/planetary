window.Planetary.prototype.scenario.regular = {
	suns: [
		{
			position: {x: 3000, y: 0},
			color: 'yellow',
			velocity: {
				x: 0,
				y: 0
			},
			mass: 500000,
			name: 'sun 2'
		}
	],
	bodies: [
		{
			position: {x: -3000, y: 0},
			color: 'orange',
			velocity: {
				x: 0,
				y: -70
			},
			mass: 500,
			name: 'planet 1',
			radius: 200
		},
		{
			position: {x: -3500, y: 0},
			color: 'orange',
			velocity: {
				x: 0,
				y: -61
			},
			mass: 50,
			name: 'planet 1 moon 1',
			radius: 15
		},
		{
			position: {x: 550, y: 0},
			color: 'purple',
			velocity: {
				x: 0,
				y: -88
			},
			mass: 285,
			name: 'planet 2',
		},
		{
			position: {x: 20000, y: 0},
			color: 'green',
			velocity: {
				x: 0,
				y: -38
			},
			mass: 1000,
			name: 'planet 3',
		},
	]
} ;