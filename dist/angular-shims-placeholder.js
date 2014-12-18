/*! angular-shims-placeholder - v0.3.4 - 2014-12-17
* https://github.com/cvn/angular-shims-placeholder
* Copyright (c) 2014 Chad von Nau; Licensed MIT */
(function (angular, document, undefined) {
  'use strict';
  angular.module('ng.shims.placeholder', []).service('placeholderSniffer', [
    '$document',
    function ($document) {
      this.emptyClassName = 'empty', this.hasPlaceholder = function () {
        var test = $document[0].createElement('input');
        return test.placeholder !== void 0;
      };
    }
  ]).directive('placeholder', [
    '$timeout',
    '$document',
    'placeholderSniffer',
    function ($timeout, $document, placeholderSniffer) {
      if (placeholderSniffer.hasPlaceholder())
        return {};
      var documentListenersApplied = false;
      return {
        restrict: 'A',
        require: '?ngModel',
        priority: 110,
        link: function (scope, elem, attrs, ngModel) {
          var orig_val = getValue(), domElem = elem[0], elemType = domElem.nodeName.toLowerCase(), isInput = elemType === 'input' || elemType === 'textarea', is_pwd = attrs.type === 'password', text = attrs.placeholder, emptyClassName = placeholderSniffer.emptyClassName, hiddenClassName = 'ng-hide', clone;
          if (!isInput) {
            return;
          }
          attrs.$observe('placeholder', function (newValue) {
            if (elem.hasClass(emptyClassName) && elem.val() === text) {
              elem.val('');
            }
            text = newValue;
            updateValue();
          });
          if (is_pwd) {
            setupPasswordPlaceholder();
          }
          setValue(orig_val);
          elem.bind('focus', function () {
            if (elem.hasClass(emptyClassName)) {
              elem.val('');
              elem.removeClass(emptyClassName);
              domElem.select();
            }
          });
          elem.bind('blur', updateValue);
          if (!ngModel) {
            elem.bind('change', updateValue);
          }
          if (ngModel) {
            ngModel.$render = function () {
              setValue(ngModel.$viewValue);
              if (domElem === document.activeElement && !elem.val()) {
                domElem.select();
              }
            };
          }
          if (!documentListenersApplied) {
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
            if (elem.hasClass(emptyClassName) && val && val === text) {
              return;
            }
            conditionalDefer(function () {
              setValue(val);
            });
          }
          function conditionalDefer(callback) {
            if (document.documentMode <= 11) {
              $timeout(callback, 0);
            } else {
              callback();
            }
          }
          function setValue(val) {
            if (!val && domElem !== document.activeElement) {
              elem.addClass(emptyClassName);
              if (!is_pwd) {
                elem.val(text);
              }
            } else {
              elem.removeClass(emptyClassName);
              elem.val(val);
            }
            if (is_pwd) {
              updatePasswordPlaceholder();
            }
          }
          function getValue() {
            if (ngModel) {
              return scope.$eval(attrs.ngModel) || '';
            }
            return getDomValue() || '';
          }
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
          function setupPasswordPlaceholder() {
            clone = angular.element('<input type="text" value="' + text + '"/>');
            stylePasswordPlaceholder();
            clone.addClass(emptyClassName).addClass(hiddenClassName).bind('focus', hidePasswordPlaceholderAndFocus);
            domElem.parentNode.insertBefore(clone[0], domElem);
            var watchAttrs = [
                attrs.ngDisabled,
                attrs.ngReadonly,
                attrs.ngRequired,
                attrs.ngShow,
                attrs.ngHide
              ];
            for (var i = 0; i < watchAttrs.length; i++) {
              if (watchAttrs[i]) {
                scope.$watch(watchAttrs[i], updatePasswordPlaceholder);
              }
            }
          }
          function updatePasswordPlaceholder() {
            stylePasswordPlaceholder();
            if (isNgHidden()) {
              clone.addClass(hiddenClassName);
            } else if (elem.hasClass(emptyClassName) && domElem !== document.activeElement) {
              showPasswordPlaceholder();
            } else {
              hidePasswordPlaceholder();
            }
          }
          function stylePasswordPlaceholder() {
            clone.val(text).attr('class', elem.attr('class') || '').attr('style', elem.attr('style') || '').prop('disabled', elem.prop('disabled')).prop('readOnly', elem.prop('readOnly')).prop('required', elem.prop('required'));
            setAttrUnselectable(clone, elem.attr('unselectable') === 'on');
          }
          function showPasswordPlaceholder() {
            elem.addClass(hiddenClassName);
            clone.removeClass(hiddenClassName);
          }
          function hidePasswordPlaceholder() {
            clone.addClass(hiddenClassName);
            elem.removeClass(hiddenClassName);
          }
          function hidePasswordPlaceholderAndFocus() {
            hidePasswordPlaceholder();
            domElem.focus();
          }
          function isNgHidden() {
            var hasNgShow = typeof attrs.ngShow !== 'undefined', hasNgHide = typeof attrs.ngHide !== 'undefined';
            if (hasNgShow || hasNgHide) {
              return hasNgShow && !scope.$eval(attrs.ngShow) || hasNgHide && scope.$eval(attrs.ngHide);
            } else {
              return false;
            }
          }
        }
      };
    }
  ]);
}(window.angular, window.document));