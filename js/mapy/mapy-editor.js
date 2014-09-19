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
			$editor = box('mapy-editor', this.$container, ''),
			$btn = box('mapy-editor-btn', $editor, 'Editor').attr('title', 'Open editor'),
			$tools = box('mapy-editor-tools', $editor, '').hide(),
			$btnPanMouse = box('mapy-editor-tools-btn', $tools, 'Mouse Pan').addClass('to-pan').addClass('active'),
			$btnRotateMouse = box('mapy-editor-tools-btn', $tools, 'Mouse Rotate').addClass('to-rotate'),

			$separator = box('mapy-editor-tools-separator', $tools, ''),

			$btnPrev = box('mapy-editor-tools-btn', $tools, 'Select Prev').addClass('to-prev'),
			$btnNext = box('mapy-editor-tools-btn', $tools, 'Select Next').addClass('to-next'),

			$separator = box('mapy-editor-tools-separator', $tools, ''),
			$btnGetSetup = box('mapy-editor-tools-btn', $tools, 'Get Setup').addClass('to-setup');


		var editMode = false,
			toggleEditMode = function() {

				if (!editMode) {
					self.changeSlide(-1);

















					$tools.show();
					this.disable = true;
					editMode = true;
					$btn.attr('title', 'Close editor');
				} else {
					$tools.hide();
					this.disable = false;
					editMode = false;
					$btn.attr('title', 'Open editor');
				}
			};


		u.on($btn.node(), 'click', toggleEditMode);



	};
	Mapy.onInit('editor');
})();