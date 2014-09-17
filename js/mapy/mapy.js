/*
 * MAPY
 *********************************************/

/*
 * Styles group, to verify if exist some style name
 * @type {function} @return {object}
 */
var mapy = function(options) {

	/*
	 * Constructor
	 * @type {function} @return {object}
	 */
	var MC = function(options) {
		return this.init(options);
	};

	/*
	 * MC prototype extension
	 */
	MC.prototype = {
		init: function(options) {

			/* Initial configuration
			 **************************************/
			this.config = extend({
				id: null,
				margin: 20,
				perspective: 1000,
				duration: 1000,
				circular: true,
				initial: -1
			}, options);

			// if not id, select the first node with class 'mapy' and asign some random id
			if (this.config.id === null) {
				this.config.id = 'mapy-' + idCounter;
				++idCounter;
				sel('.mapy').setId(this.config.id);
			}

			// For 'Edit Mode'. Default = false
			this.editMode = false;

			// If it's running some transition
			this.animating = false;

			// View panorama setting
			this.panorama = {
				minX: 9999999,
				maxX: -9999999,
				minY: 9999999,
				maxY: -9999999,
				width: function() {
					return this.maxX - this.minX;
				},
				height: function() {
					return this.maxY - this.minY;
				},
				t: {
					translate: {
						x: 0,
						y: 0,
						z: 0
					},
					rotate: {
						x: 0,
						y: 0,
						z: 0
					},
					scale: {
						x: 1
					}
				}
			}

			/* DOM elements initial configuration
			 **************************************/

			// Store selections. Every selection's name start with '$' to easy recognizing
			this.$container = sel('#' + this.config.id);
			this.$slides = sel('.slide', this.$container.node()).centered();

			// Array of slides used to setup, navigate between slides, etc
			this.slideList = this.$slides.toArray();
			this.length = this.slideList.length;

			// New node elements, to manage the visualization
			this.$scaler = sel(document.createElement('div'));
			this.$moveRotater = sel(document.createElement('div'));

			/* Add the new nodes to the main container, and wrap all slides
			 * @Structure:			 
			 $container
			 |_ _$scaler
			   |__$moveRotater
			   	 |__$slides			 
			 */
			this.$container.append(this.$scaler);
			this.$scaler.append(this.$moveRotater);
			this.$slides.appendTo(this.$moveRotater);

			/* Default CSS styles
			 **************************************/
			this.$scaler.perspective(this.config.perspective).css({
				'transform-style': 'preserve-3d',
				'transform-origin': 'left top 0',
				'transition': 'all ' + this.config.duration + 'ms',
				'position': 'absolute',
				'top': '50%',
				'left': '50%'
			});
			this.$moveRotater.css({
				'transform-style': 'preserve-3d',
				'transform-origin': 'left top 0',
				'transition': 'all ' + this.config.duration + 'ms',
				'position': 'absolute'
			});
			this.$slides.css({
				'transform-style': 'preserve-3d',
				'position': 'absolute'
			});

			/* Initial configuration for slider
			 **************************************/

			// Current slide showing. To init: none (-2)
			this.current;

			// Set width and height of container, depending of window size
			this.setSizes()

			// Set Events
			.setEvents(this);			

			return this;
		},
		setSizes: function() {
			this.width = this.$container.width() - 2 * this.config.margin;
			this.height = this.$container.height() - 2 * this.config.margin;

			// Module of rectangle
			this.mod = this.width / this.height;
			return this;
		},
		changeSlide: function(num, callback) {
			if (!this.animating && this.current !== num) {
				var cbk = callback || function() {},
					self = this;

				this.current = num;
				this.animating = true;
				this.setZoom().setPosition();

				setTimeout(function() {
					self.animating = false;
					cbk();
				}, this.config.duration);
			}
			return this;
		},
		prevSlide: function(onFinish) {
			var num = this.current - 1;
			if (num < -1) {
				if (this.config.circular) {
					this.changeSlide(this.length - 1, onFinish);
				}
			} else {
				this.changeSlide(num, onFinish);
			}
			return this;
		},
		nextSlide: function(onFinish) {
			var num = this.current + 1;
			if (num >= this.length) {
				if (this.config.circular) {
					this.changeSlide(-1);
				}
			} else {
				this.changeSlide(num, onFinish);
			}

			return this;
		},
		setZoom: function() {
			var slide = (this.current === -1) ? this.panorama : this.slideList[this.current];

			var width = slide.width(),
				height = slide.height(),
				mod = width / height,
				scale = slide.t.scale.x,
				zoom = (this.mod > mod) ? this.height / height / scale : this.width / width / scale;

			this.$scaler.perspective(this.config.perspective / zoom).transform({
				scale: {
					x: zoom
				}
			}, true);

			return this;
		},
		setPosition: function() {
			var slide = (this.current === -1) ? this.panorama : this.slideList[this.current];

			var xt = -1 * slide.t.translate.x,
				yt = -1 * slide.t.translate.y,
				zt = -1 * slide.t.translate.z,
				xr = -1 * slide.t.rotate.x,
				yr = -1 * slide.t.rotate.y,
				zr = -1 * slide.t.rotate.z;

			this.$moveRotater.transform({
				translate: {
					x: xt,
					y: yt,
					z: zt
				},
				rotate: {
					x: xr,
					y: yr,
					z: zr
				}
			}, true);

			return this;
		},
		setEvents: function(self) {
			on(window, 'resize', function() {
				self.setSizes().setZoom();
			});

			onKeyPress(window, 37, function() {
				self.prevSlide();
			});
			onKeyPress(window, 38, function() {
				self.prevSlide();
			});
			onKeyPress(window, 39, function() {
				self.nextSlide();
			});
			onKeyPress(window, 40, function() {
				self.nextSlide();
			});

			return this;
		},
		setup: function(props) {
			var p = props || [],
				l = (this.length < props.length) ? this.length : props.length;
			for (var i = 0; i < l; i++) {
				this.slideList[i].transform(p[i]);
			}

				// Start
			return this.setPanorama().changeSlide(this.config.initial);;
		},
		setPanorama: function() {

			this.panorama.minX = 9999999;
			this.panorama.maxX = -9999999;
			this.panorama.minY = 9999999;
			this.panorama.maxY = -9999999;

			for (var i = 0; i < this.length; i++) {
				var x = this.slideList[i].t.translate.x,
					y = this.slideList[i].t.translate.y,
					width = this.slideList[i].width(),
					height = this.slideList[i].height(),

					minX = x - width / 2,
					maxX = x + width / 2,
					minY = y - height / 2,
					maxY = y + height / 2;

				if (minX < this.panorama.minX) {
					this.panorama.minX = minX;
				}
				if (maxX > this.panorama.maxX) {
					this.panorama.maxX = maxX;
				}
				if (minY < this.panorama.minY) {
					this.panorama.minY = minY;
				}
				if (maxY > this.panorama.maxY) {
					this.panorama.maxY = maxY;
				}
			}
			this.panorama.t.translate.x = this.panorama.width() / 2 + this.panorama.minX;
			this.panorama.t.translate.y = this.panorama.height() / 2 + this.panorama.minY;

			return this;
		}
	};

	return new MC(options);
};