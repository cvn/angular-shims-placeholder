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

angular.module('ng.shims.placeholder', []).directive('placeholder', function($timeout) {
	if (! angular.mock) {
		// run unit tests, even if your browser supports the placeholder field
		var test = document.createElement("input");
		if (test.placeholder !== void 0)
			return {};
	}

	// No native support for attribute placeholder
	return {
		restrict: 'A',
		require: '?ngModel',
		priority: 1,
		link: function(scope, elem, attrs, ngModel) {
			var orig_val = getValue(),
				is_pwd = attrs.type === 'password',
				text = attrs.placeholder,
				emptyClassName = 'empty',
				domElem = elem[0],
				clone;

			if (!text) { return; }

			if (is_pwd) { setupPasswordPlaceholder(); }

			// init
			setValue(orig_val);

			// on focus, replace auto-label with empty field
			elem.bind('focus', function() {
				if (elem.hasClass(emptyClassName)) {
					elem.val('');
					elem.removeClass(emptyClassName);
					elem.removeClass('error');
				}
			});

			// view -> model
			elem.bind('blur', updateValue);

			// handler for model-less inputs to interact with non-angular code
			if (!ngModel) {
				elem.bind('change', updateValue);
			}

			// model -> view
			if (ngModel) {
				ngModel.$render = function() {
					setValue(ngModel.$viewValue);
				};
			}

			function updateValue(e) {
				var val = elem.val();

				// don't update from placeholder, helps debounce
				if (elem.hasClass(emptyClassName) && val === text) { return; }

				// IE: ngModel uses a keydown handler with deferrered 
				// execution to check for changes to the input. this $timeout 
				// prevents updateValue from firing before the keydown handler,
				// which is an issue when tabbing out of an input.
				// the conditional tests IE version, matches $sniffer.
				if (document.documentMode <= 11) {
					$timeout(function(){
						setValue(val);
					},0);
				} else {
					setValue(val);
				}
			}

			function setValue(val) {
				if (!val) {
					elem.addClass(emptyClassName);
					if (is_pwd) {
						showPasswordPlaceholder();
					} else {
						elem.val(text);
					}
				} else {
					elem.removeClass(emptyClassName);
					if (is_pwd) {
						hidePasswordPlaceholder();
					}
					elem.val(val);
				}
			}

			function getValue() {
				if (ngModel) {
					return scope.$eval(attrs.ngModel) || '';
				}
				return getDomValue() || '';
			}

			// IE8/9: elem.val() on an empty field sometimes returns the
			// placeholder value, so return an empty string instead
			// http://stackoverflow.com/q/11208417/490592
			function getDomValue() {
				var val = elem.val();
				if (val === attrs.placeholder) {
					val = '';
				}
				return val;
			}

			// IE8: password inputs cannot display text, and inputs cannot
			// change type, so create a new element to display placeholder
			function setupPasswordPlaceholder() {
				clone = angular.element('<input type="text" value="'+text+'"/>');
				stylePasswordPlaceholder();
				clone.addClass(emptyClassName)
					.addClass('ng-hide')
					.bind('focus', hidePasswordPlaceholderAndFocus);
				domElem.parentNode.insertBefore(clone[0], domElem);
			}

			function stylePasswordPlaceholder() {
				clone.val(text)
					.attr('class', elem.attr('class') || '')
					.attr('style', elem.attr('style') || '');
			}

			function showPasswordPlaceholder() {
				stylePasswordPlaceholder();
				elem.addClass('ng-hide');
				clone.removeClass('ng-hide');
			}

			function hidePasswordPlaceholder() {
				clone.addClass('ng-hide');
				elem.removeClass('ng-hide');
			}

			function hidePasswordPlaceholderAndFocus() {
				hidePasswordPlaceholder();
				domElem.focus();
			}

		}
	};
});

})(window.angular, window.document);
