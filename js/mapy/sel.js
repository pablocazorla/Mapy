/*
 * Sel: DOM Nodes HANDLER
 *********************************************/

/*
 * All interaction with DOM nodes is through this function
 * @type {function} @return {object}
 */
var sel = function(selection, context) {
	var selectorNode = function(selection, context) {
		return this.init(selection, context);
	};
	selectorNode.prototype = {
		mapySelector: true,
		init: function(selection, context) {
			if (typeof selection === 'string') {
				var ctx = context || document;
				this.elem = NodeListToArray(ctx.querySelectorAll(selection));
			} else {
				this.elem = [selection];
			}

			this.length = this.elem.length;

			this.id();

			var data = (typeof this.elem[0] !== 'undefined' && typeof document.body.dataset !== 'undefined') ? this.elem[0].dataset : {};
			this.t = {
				translate: {
					x: toNumber(data.x),
					y: toNumber(data.y),
					z: toNumber(data.z)
				},
				rotate: {
					x: toNumber(data.rotateX),
					y: toNumber(data.rotateY),
					z: toNumber(data.rotateZ || data.rotate)
				},
				scale: {
					x: toNumber(data.scale, 1)
				},
				centered: false,
				perspective: 0
			};
			return this.transform();
		},
		id: function(str) {
			if (this.length > 0) {
				if (typeof str === 'string') {
					// Set
					this.elem[0].id = str;
					return this;
				} else {
					// Get
					var i = this.elem[0].id,
						idd;
					if (i === '' || i === undefined || i === null) {
						idd = this.elem[0].id = 'mapy-' + idCounter++;
					} else {
						idd = i;
					}
					return idd;
				}
			}
		},
		node: function() {
			return this.elem[0];
		},
		toArray: function() {
			var a = [];
			for (var i = 0; i < this.length; i++) {
				var el = sel(this.elem[i]);
				el.t.centered = true;
				el.transform();
				a.push(el);
			}
			return a;
		},
		centered: function(flag) {
			var fl = flag || true;
			this.t.centered = fl;
			return this;
		},
		append: function(el) {
			if (typeof el.mapySelector !== 'undefined') {
				var self = this;
				el.each(function(e) {
					self.elem[0].appendChild(e);
				});
			} else {
				this.elem[0].appendChild(el);
			}
			return this;
		},
		appendTo: function(el) {
			if (typeof el.mapySelector !== 'undefined') {
				el.append(this);
			} else {
				sel(el).append(this);
			}
			return this;
		},
		css: function(properties) {
			if (typeof properties === 'string') {
				// Get
				var sty = window.getComputedStyle(this.elem[0]),
					attr = sty.getPropertyValue(computedCss(properties));
				if (attr === '' || attr === undefined || attr === null) {
					attr = sty.getPropertyValue(properties);
					if (attr === '' || attr === undefined || attr === null) {
						attr = sty.getPropertyValue(cssfix(properties));
					}
				}
				return attr;
			} else {
				// Set
				var pk;
				for (k in properties) {
					pk = cssfix(k);
					if (pk !== null) {
						this.each(function(el) {
							el.style[pk] = properties[k];
						});
					}
				}
				return this;
			}
		},
		each: function(handler) {
			for (var i = 0; i < this.length; i++) {
				handler(this.elem[i]);
			}
			return this;
		},
		transform: function(properties, reverse) {
			var rev = reverse || false;
			for (var a in properties) {
				props = properties[a];
				for (var b in props) {
					if (typeof this.t[a] !== 'undefined') {
						this.t[a][b] = props[b];
					}
				}
			}
			var strTransform = (this.t.perspective > 0) ? 'perspective(' + this.t.perspective + 'px) ' : '';
			if (rev) {
				strTransform += ' scale(' + this.t.scale.x + ')';
				strTransform += ' rotateZ(' + this.t.rotate.z + 'deg) rotateY(' + this.t.rotate.y + 'deg) rotateX(' + this.t.rotate.x + 'deg)';
				strTransform += 'translate3d(' + this.t.translate.x + 'px,' + this.t.translate.y + 'px,' + this.t.translate.z + 'px)';
				strTransform += (this.t.centered) ? 'translate(-50%,-50%) ' : '';
			} else {
				strTransform += (this.t.centered) ? 'translate(-50%,-50%) ' : '';
				strTransform += 'translate3d(' + this.t.translate.x + 'px,' + this.t.translate.y + 'px,' + this.t.translate.z + 'px)';
				strTransform += ' rotateX(' + this.t.rotate.x + 'deg) rotateY(' + this.t.rotate.y + 'deg) rotateZ(' + this.t.rotate.z + 'deg)';
				strTransform += ' scale(' + this.t.scale.x + ')';
			}
			if(mapySupported){
this.css({
				'transform': strTransform
			});
			}			
			return this;
		},
		width: function() {
			return this.elem[0].offsetWidth;
		},
		height: function() {
			return this.elem[0].offsetHeight;
		},
		perspective: function(val) {
			this.t.perspective = val;
			return this.transform();
		},
		hasClass: function(str) {
			return (classToData(this.elem[0], str).position !== -1);
		},
		addClass: function(str) {
			this.each(function(el) {
				var dataClass = classToData(el, str);
				if (dataClass.position === -1) {
					el.className += ' ' + str;
				}
			});
			return this;
		},
		removeClass: function(str) {
			this.each(function(el) {
				var dataClass = classToData(el, str);
				if (dataClass.position !== -1) {
					dataClass.list.splice(dataClass.position, 1);
					el.className = dataClass.list.join(' ');
				}
			});
			return this;
		}
	};

	return new selectorNode(selection, context);
};