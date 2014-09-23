var myMap = Mapy({
	onStartChange: function(num) {
		console.log('me voy de ' + num);
	},
	onFinishChange: function(num) {
		console.log('llego a ' + num);
	}
}).setup([{
	id: "rojo",
	translate: {
		x: 978,
		y: 353
	},
	rotate: {
		z: -27
	},
	scale: {
		x: 1.48
	}
}, {
	id: "azul",
	translate: {
		x: -69,
		y: -379
	},
	rotate: {
		y: 60
	}
}, {
	id: "verde",
	translate: {
		x: -715,
		y: 332
	},
	rotate: {
		z: -72
	}
}, {
	id: "gris",
	translate: {
		x: 273,
		y: 360
	},
	rotate: {
		z: 57
	}
}, {
	id: "naranja",
	translate: {
		x: 300,
		y: -300
	}
}]);