/*
 * angular-shims-placeholder
 * https://github.com/jrief/angular-shims-placeholder
 *
 * Add Angular directives which emulates attribute ´placeholder´ in input fields
 * of type text for browsers not supporting this, ie. IE9 and below.
 *
 * Copyright (c) 2013 Jacob Rief
 * Licensed under the MIT license.
 */

(function(angular, document, undefined) {
'use strict';

angular.module('ng.shims.placeholder', [])
.service('placeholderSniffer', function($document){
	this.hasPlaceholder = function() {
		// test for native placeholder support
		var test = $document[0].createElement("input");
		return (test.placeholder !== void 0);
	};
})
.directive('placeholder', function($timeout, $document, placeholderSniffer) {
	if (placeholderSniffer.hasPlaceholder()) return {};

	var documentListenersApplied = false;

	// No native support for attribute placeholder
	return {
		restrict: 'A',
		require: '?ngModel',
		priority: 110, // run after ngModel (0) and BOOLEAN_ATTR (100) directives
		link: function(scope, elem, attrs, ngModel) {
			var orig_val = getValue(),
				domElem = elem[0],
				elemType = domElem.nodeName.toLowerCase(),
				isInput = elemType === 'input' || elemType === 'textarea',
				is_pwd = attrs.type === 'password',
				text = attrs.placeholder,
				emptyClassName = 'empty',
				clone;

			if (!text || !isInput) { return; }

			if (is_pwd) { setupPasswordPlaceholder(); }

			// init
			setValue(orig_val);

			// on focus, replace auto-label with empty field
			elem.bind('focus', function() {
				if (elem.hasClass(emptyClassName)) {
					elem.val('');
					elem.removeClass(emptyClassName);
					domElem.select(); // IE8/9 show text cursor after tabbing in
				}
			});

			// on blur, show placeholder if necessary
			elem.bind('blur', updateValue);

			// handler for model-less inputs to interact with non-angular code
			// TODO: vs `$watch(function(){return elem.val()})`
			if (!ngModel) {
				elem.bind('change', updateValue);
			}

			// model -> view
			if (ngModel) {
				ngModel.$render = function() {
					setValue(ngModel.$viewValue);
					// IE8/9: show text cursor after updating value while
					// focused, this happens when tabbing into a field, and the
					// deferred keydown handler from the previous field fires
					//
					// TODO: remove when tab key behavior is fixed in
					// angular core
					if (domElem === document.activeElement && !elem.val()) {
						domElem.select();
					}
				};
			}

			if (!documentListenersApplied) {
				// cancel selection of placeholder text on disabled elements
				// disabled elements do not emit selectstart events in IE8/IE9,
				// so bind to $document and catch the event as it bubbles
				$document.on('selectstart', function (e) {
					var elmn = angular.element(e.target);
					if (elmn.hasClass(emptyClassName) && elmn.prop('disabled')) {
						e.preventDefault();
					}
				});
				documentListenersApplied = true;
			}

			function updateValue(e) {
				var val = elem.val();

				// don't update from placeholder, helps debounce
				if (elem.hasClass(emptyClassName) && val === text) { return; }

				conditionalDefer(function(){ setValue(val); });
			}

			function conditionalDefer(callback) {
				// IE8/9: ngModel uses a keydown handler with deferrered
				// execution to check for changes to the input. this $timeout 
				// prevents callback from firing before the keydown handler,
				// which is an issue when tabbing out of an input.
				// the conditional tests IE version, matches $sniffer.
				//
				// TODO: remove this function when tab key behavior is fixed in
				// angular core
				if (document.documentMode <= 11) {
					$timeout(callback, 0);
				} else {
					callback();
				}
			}

			function setValue(val) {
				if (!val && domElem !== document.activeElement) {
					// show placeholder when necessary
					elem.addClass(emptyClassName);
					if (is_pwd) {
						showPasswordPlaceholder();
					} else {
						elem.val(text);
					}
				} else {
					// otherwise set input to actual value
					elem.removeClass(emptyClassName);
					if (is_pwd) {
						hidePasswordPlaceholder();
					}
					elem.val(val);
				}
			}

			function getValue() {
				if (ngModel) {
					// use eval because $viewValue isn't ready during init
					// TODO: this might not to work during unit tests, investigate
					return scope.$eval(attrs.ngModel) || '';
				}
				return getDomValue() || '';
			}

			// IE8/9: elem.val() on an empty field sometimes returns the
			// placeholder value, so return an empty string instead
			// http://stackoverflow.com/q/11208417/490592
			// I believe IE is persisting the field value across refreshes
			// TODO: vs `elem.attr('value')`
			function getDomValue() {
				var val = elem.val();
				if (val === attrs.placeholder) {
					val = '';
				}
				return val;
			}

			function setAttrUnselectable(elmn, enable) {
				if (enable) {
					elmn.attr('unselectable', 'on');
				} else {
					elmn.removeAttr('unselectable');
				}
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

				// keep password placeholder in sync with original element.
				// update element after BOOLEAN_ATTR directives' $watches
				var watchAttrs = [
					attrs.ngDisabled,
					attrs.ngReadonly
				];
				var watchUpdate = function() {
					if (elem.hasClass(emptyClassName)) {
						showPasswordPlaceholder();
					}
				};
				for (var i = 0; i < watchAttrs.length; i++) {
					if (watchAttrs[i]) {
						scope.$watch(watchAttrs[i], watchUpdate);
					}
				}
			}

			function stylePasswordPlaceholder() {
				clone.val(text)
					.attr('class', elem.attr('class') || '')
					.attr('style', elem.attr('style') || '')
					.prop('disabled', elem.prop('disabled'))
					.prop('readOnly', elem.prop('readOnly'));
				setAttrUnselectable(clone, elem.attr('unselectable') === 'on');
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
