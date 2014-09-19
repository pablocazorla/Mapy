/*
 * UTILITIES
 *********************************************/

/*
 * Styles group, to verify if exist some style name
 * @type {object}
 */
var dummyStyles = document.createElement('div').style,
	computedStyles = window.getComputedStyle(document.createElement('div')),

	/* It return right css property name, according to current prefix browser. Also convert the string to camel case
	 * @type {function} @return {string}
	 */
	cssfix = (function() {
		var prefixes = 'Webkit Moz O ms'.split(' '),
			cache = {},
			capitalize = function(str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			},
			toCamel = function(str) {
				var arryStr = str.split('-'),
					camelStr = arryStr[0];
				for (var i = 1; i < arryStr.length; i++) {
					camelStr += capitalize(arryStr[i]);
				}
				return camelStr;
			};
		return function(property) {
			if (typeof cache[property] === 'undefined') {
				var camelProperty = toCamel(property),
					capitalizedProperty = capitalize(camelProperty),
					prefixedProperties = (property + ' ' + camelProperty + ' ' + prefixes.join(capitalizedProperty + ' ') + capitalizedProperty).split(' ');

				cache[property] = null;
				for (var i in prefixedProperties) {
					if (dummyStyles[prefixedProperties[i]] !== undefined) {
						cache[property] = prefixedProperties[i];
						break;
					}
				}
			}
			return cache[property];
		}
	})(),

	/* It return css property name used to compute styles
	 * @type {function} @return {string}
	 */
	computedCss = (function() {
		var computedfixes = '-webkit- -moz- -o- -ms-'.split(' '),
			cache = {};
		return function(property) {
			if (typeof cache[property] === 'undefined') {
				var computedProperties = (property + ' ' + computedfixes.join(property + ' ')).split(' ');

				cache[property] = null;
				for (var i in computedProperties) {
					if (computedStyles.getPropertyValue(computedProperties[i]) !== undefined) {
						cache[property] = computedProperties[i];
						break;
					}
				}

			}
			return cache[property];
		}
	})(),

	/*
	 * Convert NodeList to Array
	 * @type {function} @return {array}
	 */
	NodeListToArray = function(nl) {
		/*var arr = [];
		for(var i = nl.length; i--; arr.unshift(nl[i]));*/
		return [].slice.call(nl);
	},
	/*
	 * Return a number from some value
	 * @type {function} @return {number}
	 */
	toNumber = function(num, defaultValue) {
		return isNaN(parseFloat(num)) ? (defaultValue || 0) : parseFloat(num);
	},

	/*
	 * Extend an object with another
	 * @type {function} @return {object}
	 */
	extendObject = function(destination, source) {
		var source = source || {};
		for (var property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				arguments.callee(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}
		return destination;
	},

	/*
	 * Counter used only to generate a unique and random id for a node, if necessary
	 * @type {number}
	 */
	idCounter = 0,

	/*
	 * Location hash handler
	 * @type {function} @return {string}
	 */
	hash = function(str) {
		if (typeof str === 'string') {
			window.location.hash = '#' + str;
			return str;
		} else {
			return window.location.hash.slice(1);
		}
	},

	/*
	 * Class List handler handler
	 * @type {function} @return {string}
	 */
	classToData = function(element, classToSearch) {
		var classList = element.className.split(' '),
			position = -1;
		if (classToSearch) {
			for (var i = 0; i < classList.length; i++) {
				if (classList[i] === classToSearch) {
					position = i;
				}
			}
		}
		return {
			list: classList,
			position: position
		}
	},

	/*
	 * Browser support for Mapy
	 * @type {boolean}
	 */
	mapySupported = (cssfix("perspective") !== null),

	/*
	 * Console log
	 * @type {function} @return {null}
	 */
	cons = function(str) {
		try {
			console.log(str);
		} catch (e) {};
	};

/*
 * Event handler
 * @type {function} @return {null}
 */
var on = function(element, eventType, handler) {
		element.addEventListener(eventType, handler, false);
	},

	/*
	 * Event Key handler
	 * @type {function} @return {null}
	 */
	onKeyPress = function(element, keycode, handler) {
		on(element, 'keydown', function(e) {
			var unicode = e.keyCode ? e.keyCode : e.charCode;
			if (keyUp && unicode === keycode) {
				keyUp = false;
				handler();
			}
		});
	},
	keyUp = true;
on(window, 'keyup', function() {
	keyUp = true;
});