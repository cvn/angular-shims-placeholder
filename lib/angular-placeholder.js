/*
 * angular-shims-placeholder
 * https://github.com/jrief/angular-shims-placeholder
 *
 * Add Angular directives which emulates attribute ´placeholder´ in input fields
 * of type text for browsers not supporting this, ie. IE8 and below.
 *
 * Copyright (c) 2013 Jacob Rief
 * Licensed under the MIT license.
 */

(function(angular, undefined) {
'use strict';

angular.module('ng.shims.placeholder', []).directive('placeholder', function() {
	if (! angular.mock) {
		// run unit tests, even if your browser supports the placeholder field
		var test = document.createElement("input");
		if (test.placeholder !== void 0)
			return {};
	}

	// No native support for attribute placeholder
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elem, attrs, ngModel) {
			var orig_type = attrs.type;

			// load initial value from element
			if (!elem.val()) {
				elem.addClass('empty');
				elem.val(attrs.placeholder);
				if (orig_type === 'password') {
					elem.attr('type', 'text');
				}
				ngModel.$setViewValue('');
			} else {
				ngModel.$setViewValue(elem.val());
			}

			// on focus, replace auto-label with empty field
			elem.bind('focus', function() {
				if (elem.hasClass('empty')) {
					elem.val('');
					elem.removeClass('empty error');
					elem.attr('type', orig_type);
				}
			});

			// view -> model
			elem.bind('blur', function() {
				var orig_val = elem.val();
				setValue(orig_val);
				scope.$apply(function() {
					ngModel.$setViewValue(orig_val);
				});
			});

			// model -> view
			ngModel.$render = function() {
				setValue(ngModel.$viewValue);
			};

			function setValue(val) {
				if (!val) {
					elem.addClass('empty');
					elem.val(attrs.placeholder);
					if (orig_type === 'password') {
						elem.attr('type', 'text');
					}
				} else {
					elem.removeClass('empty');
					elem.val(val);
				}
			}

		}
	};
});

})(window.angular);
