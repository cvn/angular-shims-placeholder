/*! angular-shims-placeholder - v0.3.1 - 2014-11-03
* https://github.com/jrief/angular-shims-placeholder
* Copyright (c) 2014 Jacob Rief; Licensed MIT */
(function (angular, document, undefined) {
  'use strict';
  angular.module('ng.shims.placeholder', []).service('placeholderSniffer', [
    '$document',
    function ($document) {
      this.hasPlaceholder = function () {
        var test = $document[0].createElement('input');
        return test.placeholder !== void 0;
      };
    }
  ]).directive('placeholder', [
    '$timeout',
    'placeholderSniffer',
    function ($timeout, placeholderSniffer) {
      if (placeholderSniffer.hasPlaceholder())
        return {};
      return {
        restrict: 'A',
        require: '?ngModel',
        priority: 1,
        link: function (scope, elem, attrs, ngModel) {
          var orig_val = getValue(), domElem = elem[0], elemType = domElem.nodeName.toLowerCase(), isInput = elemType === 'input' || elemType === 'textarea', is_pwd = attrs.type === 'password', text = attrs.placeholder, emptyClassName = 'empty', clone;
          if (!text || !isInput) {
            return;
          }
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
          function updateValue(e) {
            var val = elem.val();
            if (elem.hasClass(emptyClassName) && val === text) {
              return;
            }
            if (document.documentMode <= 11) {
              $timeout(function () {
                setValue(val);
              }, 0);
            } else {
              setValue(val);
            }
          }
          function setValue(val) {
            if (!val && domElem !== document.activeElement) {
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
          function getDomValue() {
            var val = elem.val();
            if (val === attrs.placeholder) {
              val = '';
            }
            return val;
          }
          function setupPasswordPlaceholder() {
            clone = angular.element('<input type="text" value="' + text + '"/>');
            stylePasswordPlaceholder();
            clone.addClass(emptyClassName).addClass('ng-hide').bind('focus', hidePasswordPlaceholderAndFocus);
            domElem.parentNode.insertBefore(clone[0], domElem);
          }
          function stylePasswordPlaceholder() {
            clone.val(text).attr('class', elem.attr('class') || '').attr('style', elem.attr('style') || '');
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
    }
  ]);
}(window.angular, window.document));