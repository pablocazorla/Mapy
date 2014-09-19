// Apps
var myMapy = Mapy();


myMapy.setup([
	/*{
		translate: {
			x: 0,
			y: 0,
			z: 0
		}
	}, */
	{
		id: 'azul',
		translate: {
			x: 0,
			y: 0,
			z: 0
		}
	}, {
		id: 'gris',
		translate: {
			x: 600,
			y: -200,
			z: 0
		},
		rotate: {
			x: -20,
			y: 150
		}
	}, {
		id: 'rojo',
		translate: {
			x: 0,
			y: 270,
			z: 0
		},
		rotate: {
			x: 45,
			z: 15
		}
	}, {
		id: 'verde',
		translate: {
			x: 500,
			y: 270,
			z: 0
		},
		rotate: {
			z: 90
		}
	}
]);


//console.log(myMapy.initActions);