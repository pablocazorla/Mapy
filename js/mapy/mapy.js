// Mapy
var idMapyCounter = Math.floor(Math.random() * 99999);
var mapy = function(id) {

	var idElement = id || (function() {
			var newId = 'mapy-' + idMapyCounter;
			++idMapyCounter;
			sel('.mapy').setId(newId);
			return newId;
		})(),

		mapyClass = function(id) {
			return this.init(id);
		};
	mapyClass.prototype = {
		init: function(id) {
			this.id = id;

			this.$container = sel('#'+id);

			var c = this.$container.node()

			this.$slides = sel('.slide',c);

			this.slideList = this.$slides.toArray();

			this.$cnv = sel(document.createElement('div'));


			this.$container.append(this.$cnv);

			this.$slides.appendTo(this.$cnv).css({
				'background':'#FF0'
			});
			this.$cnv.transform({
				scale: {
					x : 0.5
				}
			})






















			return this;
		}
	};

	return new mapyClass(idElement);
};