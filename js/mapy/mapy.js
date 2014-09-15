// Mapy
var idMapyCounter = Math.floor(Math.random() * 99999);
var mapy = function(id) {

	var idElement = id || (function() {
			var newId = 'mapy-' + idMapyCounter;
			++idMapyCounter;
			sel('.mapy').setId(newId);
			return newId;
		})(),

		margin = 20,
		defaultPerspective = 1000,

		mapyClass = function(id) {
			return this.init(id);
		};
	mapyClass.prototype = {
		init: function(id) {
			this.id = id;

			var timing = 1000;

			// Select elements
			this.$container = sel('#' + id);
			this.$slides = sel('.slide', this.$container.node()).centered();

			this.slideList = this.$slides.toArray();
			this.length = this.slideList.length;
			this.$scaler = sel(document.createElement('div'));
			this.$moveRotater = sel(document.createElement('div'));

			this.$container.append(this.$scaler);
			this.$scaler.append(this.$moveRotater);
			this.$slides.appendTo(this.$moveRotater);

			// Set basic styles

			this.$scaler.perspective(defaultPerspective).css({
				'transform-style': 'preserve-3d',
				'transform-origin': 'left top 0',
				'transition': 'all ' + timing + 'ms',
				'position': 'absolute',
				'top': '50%',
				'left': '50%'
			});
			this.$moveRotater.css({
				'transform-style': 'preserve-3d',
				'transform-origin': 'left top 0',
				'transition': 'all ' + timing + 'ms',
				'position': 'absolute'
			});
			this.$slides.css({
				'transform-style': 'preserve-3d',
				'position': 'absolute'
			});

			// Initial parameters **********************************************/
			// current Step
			this.current = 0;
			this.setSizes().setEvents(this);
			return this;
		},
		setSizes: function() {
			this.width = this.$container.width() - 2*margin;
			this.height = this.$container.height() - 2*margin;
			this.mod = this.width / this.height;
			return this;
		},
		changeSlide: function(num) {
			this.current = num;
			this.setZoom().setPosition();

			return this;
		},
		setZoom: function() {
			var slide = this.slideList[this.current],
				w = slide.width(),
				h = slide.height(),
				m = w / h,
				s = slide.t.scale.x,
				z = (this.mod > m) ? this.height / h / s : this.width / w / s;

			this.$scaler.perspective(defaultPerspective / z).transform({
				scale: {
					x: z
				}
			}, true);

			return this;
		},
		setPosition: function() {
			var slide = this.slideList[this.current],
				xt = -1 * slide.t.translate.x,
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

		},
		setup: function(props) {
			var p = props || [],
				l = (this.length < props.length) ? this.length : props.length;
			for (var i = 0; i < l; i++) {
				this.slideList[i].transform(p[i]);
			}
			return this;
		}



	};

	return new mapyClass(idElement);
};