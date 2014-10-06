;
(function() {
	if (!Mapy) {
		try {
			console.log(':-( There is not Mapy loaded.');
		} catch (e) {}
		return false;
	}
	Mapy.extend().mousebalance = function(options) {
		var cfg = Mapy.utils.extendObject({
				factorX: 25,
				factorY: 10
			}, options),
			self = this,
			enabled = false,
			mousePosition = function(e) {
				return {
					x: e.pageX - (.5 * self.$container.width() + self.$container.node().offsetLeft),
					y: e.pageY - (.5 * self.$container.height() + self.$container.node().offsetTop)
				}
			},
			firstMoved = false,
			onMouseMove = function(e) {
				if (enabled) {
					var mp = mousePosition(e);

					self.$scaler.transform({
						rotate: {
							x: -1 * mp.y / self.height * cfg.factorY,
							y: mp.x / self.width * cfg.factorX
						}
					});
					if (!firstMoved) {
						firstMoved = true;
						setTimeout(function() {
							self.$scaler.css({
								'transition': 'none'
							});
						}, self.config.duration);
					}
				}
			};
		Mapy.utils.on(window, 'mousemove', function(e) {
			onMouseMove(e);
		});
		self.onStartChange(function() {
			enabled = false;
			self.$scaler.css({
				'transition': 'all ' + self.config.duration + 'ms'
			}).transform({
				rotate: {
					x: 0,
					y: 0
				}
			});
		});
		self.onFinishChange(function() {
			enabled = true;
			firstMoved = false;
		});
	};
})();