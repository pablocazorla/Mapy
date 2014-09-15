// Utils
var cssfix = (function() {
	var styles = document.createElement('div').style,
		prefixes = 'Webkit Moz O ms'.split(' '),
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
				prefixedProperties = (camelProperty + ' ' + prefixes.join(capitalizedProperty + ' ') + capitalizedProperty).split(' ');

			cache[property] = null;
			for (var i in prefixedProperties) {
				if (styles[prefixedProperties[i]] !== undefined) {
					cache[property] = prefixedProperties[i];
					break;
				}
			}
		}
		return cache[property];
	}
})();

// 'arraify' takes an array-like object and turns it into real Array
// to make all the Array.prototype goodness available.
var arrayify = function(a) {
	return [].slice.call(a);
};

var extend = function(destination, source) {
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
};