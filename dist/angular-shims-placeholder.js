/*! angular-shims-placeholder - v0.4.6 - 2015-10-21
* https://github.com/cvn/angular-shims-placeholder
* Copyright (c) 2015 Chad von Nau; Licensed MIT */
(function(angular, document, undefined) {
'use strict';

angular.module('ng.shims.placeholder', [])
.service('placeholderSniffer', ['$document', function($document){
	this.emptyClassName = 'empty',
	this.hasPlaceholder = function() {
		// test for native placeholder support
		var test = $document[0].createElement('input');
		return (test.placeholder !== void 0);
	};
}])
.directive('placeholder', ['$timeout', '$document', '$interpolate', '$injector', 'placeholderSniffer', function($timeout, $document, $interpolate, $injector, placeholderSniffer) {
	if (placeholderSniffer.hasPlaceholder()) return {};

	var documentListenersApplied = false,
		angularVersion = parseFloat(angular.version.full);

	// load $animate if available, to coordinate with other directives that use it
	try {
		var $animate = $injector.get('$animate');
	} catch (e) {}

	// No native support for attribute placeholder
	return {
		restrict: 'A',
		require: '?ngModel',
		// run after ngModel (0) and BOOLEAN_ATTR (100) directives.
		// priority order was reversed in Angular 1.2, so we must account for this
		priority: (angularVersion >= 1.2) ? 110 : -10,
		link: function(scope, elem, attrs, ngModel) {
			var orig_val = getValue(),
				domElem = elem[0],
				elemType = domElem.nodeName.toLowerCase(),
				isInput = elemType === 'input' || elemType === 'textarea',
				is_pwd = attrs.type === 'password',
				text = attrs.placeholder || '',
				emptyClassName = placeholderSniffer.emptyClassName,
				hiddenClassName = 'ng-hide',
				clone;

			if (!isInput) { return; }

			attrs.$observe('placeholder', function (newValue) {
				changePlaceholder(newValue);
			});

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
			if (!ngModel) {
				elem.bind('change', function (event) {
					changePlaceholder($interpolate(elem.attr('placeholder') || '')(scope), event);
				});
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
					if (isActiveElement(domElem) && !elem.val()) {
						domElem.select();
					}
				};
			}

			if (!documentListenersApplied) {
				// cancel selection of placeholder text on disabled elements
				// disabled elements do not emit selectstart events in IE8/IE9,
				// so bind to $document and catch the event as it bubbles
				$document.bind('selectstart', function (e) {
					var elmn = angular.element(e.target);
					if (elmn.hasClass(emptyClassName) && elmn.prop('disabled')) {
						e.preventDefault();
					}
				});
				documentListenersApplied = true;
			}

			function updateValue(event) {
				var val = elem.val();

				// don't update from placeholder, helps debounce
				if (elem.hasClass(emptyClassName) && val && val === text) { return; }

				conditionalDefer(function(){ setValue(val); }, event);
			}

			function conditionalDefer(callback, event) {
				// IE8/9: ngModel uses a keydown handler with deferrered
				// execution to check for changes to the input. this $timeout 
				// prevents callback from firing before the keydown handler,
				// which is an issue when tabbing out of an input.
				// the conditional tests IE version, matches $sniffer.
				//
				// TODO: remove this function when tab key behavior is fixed in
				// angular core
				if (document.documentMode <= 11 && event) {
					$timeout(callback, 0);
				} else {
					callback();
				}
			}

			function setValue(val) {
				if (!val && val !== 0 && !isActiveElement(domElem)) {
					// show placeholder when necessary
					elem.addClass(emptyClassName);
					elem.val(!is_pwd ? text : '');
				} else {
					// otherwise set input to actual value
					elem.removeClass(emptyClassName);
					elem.val(val);
				}
				if (is_pwd) {
					updatePasswordPlaceholder();
					if ($animate) {
						asyncUpdatePasswordPlaceholder();
					}
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

			function changePlaceholder(value, event) {
				if (elem.hasClass(emptyClassName) && elem.val() === text) {
					elem.val('');
				}
				text = value;
				updateValue(event);
			}

			// IE9: getting activeElement in an iframe raises error
			// http://tjvantoll.com/2013/08/30/bugs-with-document-activeelement-in-internet-explorer/
			function isActiveElement(elmn) {
				var result = false;
				try {
					result = elmn === document.activeElement;
				} catch (error) {}
				return result;
			}

			function setAttrConditional(elmn, attr, enable, value) {
				if (enable) {
					elmn.attr(attr, value);
				} else {
					elmn.removeAttr(attr);
				}
			}

			// IE8: password inputs cannot display text, and inputs cannot
			// change type, so create a new element to display placeholder
			function setupPasswordPlaceholder() {
				clone = angular.element('<input type="text" value="'+text+'"/>');
				stylePasswordPlaceholder();
				hideElement(clone);
				clone.addClass(emptyClassName)
					.bind('focus', hidePasswordPlaceholderAndFocus);
				domElem.parentNode.insertBefore(clone[0], domElem);

				// keep password placeholder in sync with original element.
				// update element after $watches
				var watchAttrs = [
					attrs.ngDisabled,
					attrs.ngReadonly,
					attrs.ngRequired,
					attrs.ngShow,
					attrs.ngHide
				];
				for (var i = 0; i < watchAttrs.length; i++) {
					if (watchAttrs[i]) {
						scope.$watch(watchAttrs[i], flexibleUpdatePasswordPlaceholder);
					}
				}
			}

			function updatePasswordPlaceholder() {
				stylePasswordPlaceholder();
				if (isNgHidden()) {
					// force hide the placeholder when element is hidden by
					// ngShow/ngHide. we cannot rely on stylePasswordPlaceholder
					// above to copy the ng-hide class, because the ngShow/ngHide
					// $watch functions apply the ng-hide class with $animate, 
					// so the class is not applied when our $watch executes
					hideElement(clone);
				} else if (elem.hasClass(emptyClassName) && domElem !== document.activeElement) {
					showPasswordPlaceholder();
				} else {
					hidePasswordPlaceholder();
				}
			}
			// update element after animation and animation-aware directives
			function asyncUpdatePasswordPlaceholder() {
				if (angularVersion >= 1.3) {
					$animate.addClass(elem, '').then(updatePasswordPlaceholder);
				} else {
					$animate.addClass(elem, '', updatePasswordPlaceholder);
				}
			}
			function flexibleUpdatePasswordPlaceholder() {
				if ($animate) {
					asyncUpdatePasswordPlaceholder();
				} else {
					updatePasswordPlaceholder();
				}
			}

			function stylePasswordPlaceholder() {
				clone.val(text);
				// chaining was failing in v1.0.8
				clone.attr('class', elem.attr('class') || '')
					.attr('style', elem.attr('style') || '')
					.prop('disabled', elem.prop('disabled'))
					.prop('readOnly', elem.prop('readOnly'))
					.prop('required', elem.prop('required'));
				setAttrConditional(clone, 'unselectable', elem.attr('unselectable') === 'on', 'on');
				setAttrConditional(clone, 'tabindex', elem.attr('tabindex') !== undefined, elem.attr('tabindex'));
			}

			function showElement(elmn) {
				if (angularVersion >= 1.2) {
					elmn.removeClass(hiddenClassName);
				} else {
					elmn.css('display', '');
				}
			}

			function hideElement(elmn) {
				if (angularVersion >= 1.2) {
					elmn.addClass(hiddenClassName);
				} else {
					elmn.css('display', 'none');
				}
			}

			function showPasswordPlaceholder() {
				hideElement(elem);
				showElement(clone);
			}

			function hidePasswordPlaceholder() {
				hideElement(clone);
				showElement(elem);
			}

			function hidePasswordPlaceholderAndFocus() {
				hidePasswordPlaceholder();
				domElem.focus();
			}

			function isNgHidden() {
				var hasNgShow = typeof attrs.ngShow !== 'undefined',
					hasNgHide = typeof attrs.ngHide !== 'undefined';
				if (hasNgShow || hasNgHide) {
					return (hasNgShow && !scope.$eval(attrs.ngShow)) ||
						(hasNgHide && scope.$eval(attrs.ngHide));
				} else {
					return false;
				}
			}

		}
	};
}]);

})(window.angular, window.document);
