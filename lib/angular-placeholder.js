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

(function(angular, document, undefined) {
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
		priority: 1,
		link: function(scope, elem, attrs, ngModel) {
			var orig_type = attrs.type,
				is_pwd = orig_type === 'password',
				text = attrs.placeholder,
				emptyClassName = 'empty',
				clone;

			if (!text) { return; }

			if (is_pwd) { setupPasswordPlaceholder(); }

			// load initial value from element
			setValue(elem.val());
			ngModel.$setViewValue(elem.val());

			// on focus, replace auto-label with empty field
			elem.bind('focus', function() {
				if (elem.hasClass(emptyClassName)) {
					elem.val('');
					elem.removeClass(emptyClassName + ' error');
				}
			});

			// view -> model
			elem.bind('blur', function() {
				var orig_val = elem.val();
				scope.$apply(function() {
					setValue(orig_val);
					ngModel.$setViewValue(orig_val);
				});
			});

			// model -> view
			ngModel.$render = function() {
				setValue(ngModel.$viewValue);
			};

			function setValue(val) {
				if (!val) {
					elem.addClass(emptyClassName);
					elem.val(text);
					if (is_pwd) {
						elem.hide();
						clone.show();
						clone.addClass(emptyClassName);
					}
				} else {
					elem.removeClass(emptyClassName);
					elem.val(val);
				}
			}

			// in IE8, password inputs cannot display text, and inputs cannot
			// change type, so create a new element to display placeholder
			function setupPasswordPlaceholder() {
				clone = angular.element('<input/>').attr(
					angular.extend(extractAttributes(elem[0]), {
						'type': 'text',
						'value': text,
						'placeholder': '',
						'id': '',
						'name': ''
					}))
					.hide()
					.bind('focus', function(e) {
						clone.hide();
						elem.show().focus();
					})
					.insertBefore(elem);
				elem.bind('blur', function(e) {
					if (!elem.val()) {
						elem.hide();
						clone.show();
					}
				});
			}

			// extractAttributes from https://github.com/matoilic/jquery.placeholder
			function extractAttributes(element) {
				var attr = element.attributes, copy = {}, skip = /^jQuery\d+/;
				for(var i = 0; i < attr.length; i++) {
					if(attr[i].specified && !skip.test(attr[i].name)) {
						copy[attr[i].name] = attr[i].value;
					}
				}
				return copy;
			}

		}
	};
});

})(window.angular, window.document);
