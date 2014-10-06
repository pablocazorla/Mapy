;
(function() {
	if (!Mapy) {
		try {
			console.log(':-( There is not Mapy loaded.');
		} catch (e) {}
		return false;
	}
	if (Mapy.utils.select('#mapy-keyanimation-styles') > 0) {
		return false;
	}

	var styleNode = document.createElement('style'),
		$style = Mapy.utils.select(styleNode);

	$style.attr('id', 'mapy-keyanimation-styles').appendTo(document.body);

	var pfx = Mapy.prefix,
		idCounter = 0,
		kaList = [],
		drawKaList = function() {
			var txt = '';
			for (var i = 0; i < kaList.length; i++) {
				txt += kaList[i].draw();
			}
			$style.html(txt);
		},
		ka = function(selection, keyframes, opt) {
			return this.init(selection, keyframes, opt)
		};

	ka.prototype = {
		init: function(selection, keyframes, opt) {

			this.id = 'mapy-keyanimation-' + idCounter++;
			this.select(selection);
			this.keyframes(keyframes);
			this.options(opt);

			return this;
		},
		select: function(selection) {
			var sel = selection || '';
			this.selection = sel;
			return this;
		},
		keyframes: function(keyframes) {
			var kf = keyframes || {};
			this.kf = kf;
			return this;
		},
		options: function(opt) {
			this.cfg = Mapy.utils.extendObject({
				duration: 1000,
				timing: 'ease',
				iterationCount: 1 // # or infinite
			}, opt);
			return this;
		},
		draw: function() {
			var txt = '.' + this.id + 'class{\n\t' + pfx + 'animation: ' + this.id + ' ' + this.cfg.duration + 'ms ' + this.cfg.timing + ' ' + this.cfg.iterationCount + ';\n}\n';
			txt += '@' + pfx + 'keyframes ' + this.id + ' {\n\t';
			for (var a in this.kf) {
				txt += a + ' {\n';
				for (var b in this.kf[a]) {
					txt += '\t\t' + Mapy.utils.cssfix(b, true) + ': ' + this.kf[a][b] + ';\n';
				}
				txt += '\t}\n';
			}
			txt += '}';
			return txt;
		},

		start: function() {
			Mapy.utils.select(this.selection).addClass(this.id + 'class');
			return this;
		},
		stop: function() {
			Mapy.utils.select(this.selection).removeClass(this.id + 'class');
			return this;
		}
	};
	
	Mapy.keyAnimation = function(selection, keyframes, opt) {
		var newKA = new ka(selection, keyframes, opt);
		kaList.push(newKA);
		drawKaList();
		return newKA;
	};
})();