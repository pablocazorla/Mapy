;
(function() {
	if (!Mapy) {
		try {
			console.log(':-( There is not Mapy loaded.');
		} catch (e) {}
		return false;
	}

	var u = Mapy.utils,
		box = function(classname, container, text) {
			var b = u.sel(document.createElement('div'));
			b.appendTo(container);
			b.html(text).addClass(classname);
			return b;
		};

	Mapy.extend().editor = function() {

		var self = this,
			$grid = box('mapy-editor-grid', this.$moveRotater, '').hide(),
			$gridX = box('mapy-editor-grid-x', $grid, ''),
			$gridY = box('mapy-editor-grid-y', $grid, ''),
			$cursor = box('mapy-editor-cursor', this.$moveRotater, '').hide(),
			$cursor_circX = box('mapy-editor-cursor-circ-x', $cursor, ''),
			$cursor_circY = box('mapy-editor-cursor-circ-y', $cursor, ''),
			$cursor_circZ = box('mapy-editor-cursor-circ-z', $cursor, ''),
			$cursor_lineX = box('mapy-editor-cursor-line-x', $cursor, '<span>X</span>'),
			$cursor_lineY = box('mapy-editor-cursor-line-y', $cursor, '<span>Y</span>'),
			$cursor_lineZ = box('mapy-editor-cursor-line-z', $cursor, '<span>Z</span>'),
			$cursor_scale = box('mapy-editor-cursor-scale', $cursor, ''),
			$cursor_reset = box('mapy-editor-cursor-reset', $cursor, 'Reset'),
			$cursor_indicator = box('mapy-editor-cursor-indicator', this.$container, '<b>X : </b>45');


		$cursor.css({
			'transform-style': 'preserve-3d'
		});
		$cursor_circX.transform({
			rotate: {
				y: 90
			}
		});
		$cursor_circY.transform({
			rotate: {
				x: 90
			}
		});
		$cursor_lineY.transform({
			rotate: {
				z: 90
			}
		});
		$cursor_lineZ.transform({
			rotate: {
				x: 90,
				z: 90
			}
		});

		var $editor = box('mapy-editor', this.$container, ''),
			$btn = box('mapy-editor-btn', $editor, 'Editor').attr('title', 'Open editor'),
			$tools = box('mapy-editor-tools', $editor, '').hide(),
			$btnPanMouse = box('mapy-editor-tools-btn', $tools, 'Mouse Pan').addClass('to-pan').addClass('active'),
			$btnRotateMouse = box('mapy-editor-tools-btn', $tools, 'Mouse Rotate').addClass('to-rotate'),
			$btnResetMouse = box('mapy-editor-tools-btn', $tools, 'Reset View').addClass('to-reset'),

			$separator = box('mapy-editor-tools-separator', $tools, ''),

			$btnPrev = box('mapy-editor-tools-btn', $tools, 'Select Prev').addClass('to-prev'),
			$btnNext = box('mapy-editor-tools-btn', $tools, 'Select Next').addClass('to-next'),

			$separator = box('mapy-editor-tools-separator', $tools, ''),
			$btnGetSetup = box('mapy-editor-tools-btn', $tools, 'Get Setup').addClass('to-setup');


		var activeEdit = 0,

			editMode = false,
			setActive = function(num) {
				self.slideList[activeEdit].removeClass('active-edition');
				activeEdit = num;
				$cursor.transform({
					translate: {
						x: self.slideList[num].t.translate.x,
						y: self.slideList[num].t.translate.y,
						z: self.slideList[num].t.translate.z
					}
				});
				self.slideList[activeEdit].addClass('active-edition');
			},
			toggleEditMode = function() {
				if (!editMode) {
					self.$container.css({
						'user-select': 'none'
					}).addClass('mapy-on-edition');
					$grid.show();
					$cursor.show();
					$tools.show();
					self.disable = true;
					editMode = true;
					$btn.attr('title', 'Close editor');
					self.$moveRotater.css({
						'transition': 'none'
					});
					setActive(activeEdit);
				} else {
					self.$container.css({
						'user-select': 'auto'
					}).removeClass('mapy-on-edition');
					$grid.hide();
					$cursor.hide();
					$tools.hide();
					self.disable = false;
					editMode = false;
					$btn.attr('title', 'Open editor');
					self.$moveRotater.css({
						'transition': 'all ' + self.config.duration + 'ms'
					});
					self.setPanorama();
				}
			},
			mode = 'translate',
			setMode = function(m) {
				mode = m;
				if (mode === 'translate') {
					$btnRotateMouse.removeClass('active');
					$btnPanMouse.addClass('active');
				} else {
					$btnPanMouse.removeClass('active');
					$btnRotateMouse.addClass('active');
				}
			},
			dragging = false,

			xMouseInit = 0,
			yMouseInit = 0,

			xMoveRotaterInit = 0,
			yMoveRotaterInit = 0,
			zMoveRotaterInit = 0,

			optionsToMove = {
				mode: 'translate',
				x: 0,
				y: 0
			},
			activeCursor = null,
			posX, posY, posZ, rotX, rotY, rotZ, scaleX,

			onMouseDown = function(e) {
				if (!dragging && editMode) {
					dragging = true;
					xMouseInit = e.pageX;
					yMouseInit = e.pageY;


					optionsToMove.mode = mode;
					if (mode === 'translate') {
						xMoveRotaterInit = self.$moveRotater.t.translate.x;
						yMoveRotaterInit = self.$moveRotater.t.translate.y;
					} else {
						zMoveRotaterInit = self.$moveRotater.t.rotate.z;
						yMoveRotaterInit = self.$moveRotater.t.rotate.x;
					}

					// for activeCursor
					posX = self.slideList[activeEdit].t.translate.x;
					posY = self.slideList[activeEdit].t.translate.y;
					posZ = self.slideList[activeEdit].t.translate.z;
					rotX = self.slideList[activeEdit].t.rotate.x;
					rotY = self.slideList[activeEdit].t.rotate.y;
					rotZ = self.slideList[activeEdit].t.rotate.z;
					scaleX = self.slideList[activeEdit].t.scale.x;


				}
			},
			onMouseMove = function(e) {
				if (dragging && editMode) {
					if (activeCursor === null) {
						if (mode === 'translate') {
							optionsToMove.x = xMoveRotaterInit + (e.pageX - xMouseInit) / newZoom;
							optionsToMove.y = yMoveRotaterInit + (e.pageY - yMouseInit) / newZoom;
						} else {
							optionsToMove.z = zMoveRotaterInit - 0.2 * (e.pageX - xMouseInit);
							optionsToMove.x = yMoveRotaterInit - 0.2 * (e.pageY - yMouseInit);
						}
						self.setPosition(optionsToMove);
					} else {
						var dx = (e.pageX - xMouseInit),
							dy = (e.pageY - yMouseInit),
							dposX = posX,
							dposY = posY,
							dposZ = posZ,
							drotX = rotX,
							drotY = rotY,
							drotZ = rotZ,
							dscaleX = scaleX,
							indicatorContent;
						switch (activeCursor) {
							case 'lineX':
								dposX = u.toNumber(Math.round(posX + Math.sqrt(dx * dx + dy * dy) * dx / Math.abs(dx) / newZoom));
								indicatorContent = '<b>X : </b>' + dposX + 'px';
								break;
							case 'lineY':
								dposY = u.toNumber(Math.round(posY + Math.sqrt(dx * dx + dy * dy) * dy / Math.abs(dy) / newZoom));
								indicatorContent = '<b>Y : </b>' + dposY + 'px';
								break;
							case 'lineZ':
								dposZ = u.toNumber(Math.round(posZ + Math.sqrt(dx * dx + dy * dy) * dy / Math.abs(dy) / newZoom));
								indicatorContent = '<b>Z : </b>' + dposZ + 'px';
								break;
							case 'circX':
								drotX = u.toNumber(Math.round(rotX + 0.2 * Math.sqrt(dx * dx + dy * dy) * dy / Math.abs(dy) / newZoom));
								indicatorContent = '<b>rotX : </b>' + drotX + '°';
								break;
							case 'circY':
								drotY = u.toNumber(Math.round(rotY + 0.2 * Math.sqrt(dx * dx + dy * dy) * dy / Math.abs(dy) / newZoom));
								indicatorContent = '<b>rotY : </b>' + drotY + '°';
								break;
							case 'circZ':
								drotZ = u.toNumber(Math.round(rotZ + 0.2 * Math.sqrt(dx * dx + dy * dy) * dy / Math.abs(dy) / newZoom));
								indicatorContent = '<b>rotZ : </b>' + drotZ + '°';
								break;
							case 'scale':
								dscaleX = u.toNumber(0.01 * Math.floor(100 * (scaleX + 0.01 * Math.sqrt(dx * dx + dy * dy) * dy / Math.abs(dy) / newZoom)), 1);
								dscaleX = (dscaleX < 0.05) ? 0.05 : dscaleX;
								dscaleX = (dscaleX > 12) ? 12 : dscaleX;
								indicatorContent = '<b>Scale : </b>' + dscaleX;
								break;
						}
						var objTrans = {
							translate: {
								x: dposX,
								y: dposY,
								z: dposZ
							},
							rotate: {
								x: drotX,
								y: drotY,
								z: drotZ
							},
							scale: {
								x: dscaleX
							}
						};
						$cursor.transform({
							translate: {
								x: dposX,
								y: dposY,
								z: dposZ
							}
						});
						self.slideList[activeEdit].transform(objTrans);
						var rect = self.$container.node().getBoundingClientRect();
						$cursor_indicator.html(indicatorContent).css({
							'top': e.pageY - rect.top + 'px',
							'left': e.pageX - rect.left + 'px',
							'display': 'block'
						});
					}
				}
			},
			onMouseUp = function() {
				if (dragging) {
					dragging = false;
					$cursor_indicator.hide();
				}
			},
			zoomScale = 0.6,
			newZoom = self.$scaler.t.scale.x,
			onMouseWheel = function(e) {
				if (editMode) {
					var dir;
					if (typeof e.detail !== 'undefined') {
						dir = (e.detail > 0) ? zoomScale : 1 / zoomScale;
					} else {
						dir = (e.wheelDelta < 0) ? zoomScale : 1 / zoomScale;
					}
					newZoom = self.$scaler.t.scale.x * dir;
					newZoom = (newZoom < 0.1) ? 0.1 : newZoom;
					newZoom = (newZoom > 5) ? 5 : newZoom;
					self.setZoom(newZoom);
				}
			},
			getSetup = function() {
				var txt = '[',
					t;
				for (var i = 0; i < self.length;i++) {
					txt += '{';
					t = self.slideList[i].t;
					if (t.translate.x !== 0 || t.translate.y !== 0 || t.translate.z !== 0) {
						txt += '\n\ttranslate: {';
						txt += (t.translate.x !== 0) ? '\n\t\tx: ' + t.translate.x+',' : '';
						txt += (t.translate.y !== 0) ? '\n\t\ty: ' + t.translate.y+',' : '';
						txt += (t.translate.z !== 0) ? '\n\t\tz: ' + t.translate.z : '';
						txt += '\n\t},';
					}
					if (t.rotate.x !== 0 || t.rotate.y !== 0 || t.rotate.z !== 0) {
						txt += '\n\trotate: {';
						txt += (t.rotate.x !== 0) ? '\n\t\tx: ' + t.rotate.x+',' : '';
						txt += (t.rotate.y !== 0) ? '\n\t\ty: ' + t.rotate.y+',' : '';
						txt += (t.rotate.z !== 0) ? '\n\t\tz: ' + t.rotate.z : '';
						txt += '\n\t},';
					}
					if (t.scale.x !== 1) {
						txt += '\n\tscale: {\n\t\tx: ' + t.scale.x + '\n\t}';
					}

					txt += '\n},\n';
				}
				txt += ']';
				txt = txt.replace(/,}/g,'}');
				txt = txt.replace(/,\n]/g,']');

				console.log(txt);
			};



		u.on($btn.node(), 'click', toggleEditMode);

		u.on($btnPanMouse.node(), 'click', function() {
			setMode('translate');
		});
		u.on($btnRotateMouse.node(), 'click', function() {
			setMode('rotate');
		});
		u.on($btnResetMouse.node(), 'click', function() {
			self.$moveRotater.transform({
				translate: {
					x: 0,
					y: 0,
					z: 0
				},
				rotate: {
					x: 0,
					y: 0,
					z: 0
				}
			});
			self.$scaler.transform({
				scale: {
					x: 1
				}
			});
		});



		u.on($btnPrev.node(), 'click', function() {
			var num = activeEdit - 1;
			if (num < 0) {
				num = self.length - 1;
			}
			setActive(num);
		});
		u.on($btnNext.node(), 'click', function() {
			var num = activeEdit + 1;
			if (num >= self.length) {
				num = 0;
			}
			setActive(num);
		});
		u.on($btnGetSetup.node(), 'click', function() {
			getSetup();
		});


		u.on(this.$container.node(), 'mousedown', function(e) {
			onMouseDown(e);
		});
		u.on(window, 'mousemove', function(e) {
			onMouseMove(e);
		});
		u.on(window, 'mouseup', onMouseUp);

		u.on(window, 'DOMMouseScroll', function(e) {
			onMouseWheel(e);
		});
		u.on(window, 'mousewheel', function(e) {
			onMouseWheel(e);
		});

		u.on(window, 'keyup', function(e) {
			var unicode = e.keyCode ? e.keyCode : e.charCode;
			if (unicode === 16) {
				setMode('translate');
			}
		});
		u.onKeyPress(window, 16, function() {
			setMode('rotate');
		});

		u.on($cursor_lineX.node(), 'mousedown', function(e) {
			activeCursor = 'lineX';
			$cursor_lineX.addClass('active');
			$cursor.addClass('edit');
		});
		u.on($cursor_lineY.node(), 'mousedown', function(e) {
			activeCursor = 'lineY';
			$cursor_lineY.addClass('active');
			$cursor.addClass('edit');
		});
		u.on($cursor_lineZ.node(), 'mousedown', function(e) {
			activeCursor = 'lineZ';
			$cursor_lineZ.addClass('active');
			$cursor.addClass('edit');
		});
		u.on($cursor_circX.node(), 'mousedown', function(e) {
			activeCursor = 'circX';
			$cursor_circX.addClass('active');
			$cursor.addClass('edit');
		});
		u.on($cursor_circY.node(), 'mousedown', function(e) {
			activeCursor = 'circY';
			$cursor_circY.addClass('active');
			$cursor.addClass('edit');
		});
		u.on($cursor_circZ.node(), 'mousedown', function(e) {
			activeCursor = 'circZ';
			$cursor_circZ.addClass('active');
			$cursor.addClass('edit');
		});
		u.on($cursor_scale.node(), 'mousedown', function(e) {
			activeCursor = 'scale';
			$cursor_scale.addClass('active');
			$cursor.addClass('edit');
		});
		u.on($cursor_reset.node(), 'click', function(e) {
			$cursor.transform({
				translate: {
					x: 0,
					y: 0,
					z: 0
				}
			});
			self.slideList[activeEdit].transform({
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
			});
		});



		u.on(window, 'mouseup', function() {
			if (activeCursor !== null) {
				activeCursor = null;
				$cursor_circX.removeClass('active');
				$cursor_circY.removeClass('active');
				$cursor_circZ.removeClass('active');
				$cursor_lineX.removeClass('active');
				$cursor_lineY.removeClass('active');
				$cursor_lineZ.removeClass('active');
				$cursor_scale.removeClass('active');
				$cursor.removeClass('edit');
			}
		});

	};
	Mapy.onInit('editor');
})();