// Apps
var myMapy = mapy();


myMapy.setup([{
	translate: {
		x: 300,
		y: 400,
		z: -1000
	},
	rotate: {
		x: 60,
		y: 60,
		z: 45
	}
}, {
	translate: {
		x: 400,
		y: 0,
		z: 0
	},
	rotate: {
		z: -55
	}
}, {
	translate: {
		x: 0,
		y: 300,
		z: 0
	}
}]);


n = 0;


setInterval(function() {
	myMapy.changeSlide(n);
	n++;
	if (n > 2) {
		n = 0;
	}
}, 4000);

console.log(myMapy);