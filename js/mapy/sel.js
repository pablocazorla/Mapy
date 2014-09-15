// Selector Node
var sel = function(selection, context) {
	var selectorNode = function(selection, context) {
		return this.init(selection, context);
	};
	selectorNode.prototype = {
		mapySelector : true,
		init: function(selection, context) {
			if (typeof selection === 'string') {
				var ctx = context || document;
				this.elem = arrayify(ctx.querySelectorAll(selection));
			} else {
				this.elem = [selection];
			}

			this.length = this.elem.length;
			this.t = {
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
			};
			return this;
		},
		setId: function(str) {
			this.elem[0].id = str;
			return this;
		},
		node: function() {
			return this.elem[0];
		},
		toArray: function() {
			var a = [];
			for (var i = 0; i < this.length; i++) {
				var el = sel(this.elem[i]);
				a.push(el);
			}
			return a;
		},
		append : function(el){
			if(typeof el.mapySelector !== 'undefined'){
				var self = this;
				el.each(function(e){
					self.elem[0].appendChild(e);
				});
			}else{
				this.elem[0].appendChild(el);
			}
			return this;
		},
		appendTo : function(el){
			if(typeof el.mapySelector !== 'undefined'){
				el.append(this);			
			}else{
				sel(el).append(this);
			}
			return this;
		},
		css: function(properties) {
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
		},
		each: function(handler) {
			for (var i = 0; i < this.length; i++) {
				handler(this.elem[i]);
			}
			return this;
		},
		transform: function(properties) {
			for (var a in properties) {
				props = properties[a];
				for (var b in props) {
					this.t[a][b] = props[b];
				}
			}

			var strTransform = 'translate3d(' + this.t.translate.x + 'px,' + this.t.translate.y + 'px,' + this.t.translate.z + 'px)';
			strTransform += ' rotateX(' + this.t.rotate.x + 'deg) rotateY(' + this.t.rotate.y + 'deg) rotateZ(' + this.t.rotate.z + 'deg)';
			strTransform += ' scale(' + this.t.scale.x + ')';

			this.css({
				'transform': strTransform
			});
			return this;
		}
	};

	return new selectorNode(selection, context);
};