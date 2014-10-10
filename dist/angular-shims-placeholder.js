/*! angular-shims-placeholder - v0.2.1 - 2014-10-10
* https://github.com/jrief/angular-shims-placeholder
* Copyright (c) 2014 Jacob Rief; Licensed MIT */
(function (angular, document, undefined) {
  'use strict';
  angular.module('ng.shims.placeholder', []).directive('placeholder', [
    '$timeout',
    function ($timeout) {
      if (!angular.mock) {
        var test = document.createElement('input');
        if (test.placeholder !== void 0)
          return {};
      }
      return {
        restrict: 'A',
        require: '?ngModel',
        priority: 1,
        link: function (scope, elem, attrs, ngModel) {
          var orig_val = getValue(), is_pwd = attrs.type === 'password', text = attrs.placeholder, emptyClassName = 'empty', domElem = elem[0], clone;
          if (!text) {
            return;
          }
          if (is_pwd) {
            setupPasswordPlaceholder();
          }
          setValueWithModel(orig_val);
          elem.bind('focus', function () {
            if (elem.hasClass(emptyClassName)) {
              elem.val('');
              elem.removeClass(emptyClassName);
              elem.removeClass('error');
            }
          });
          elem.bind('blur', updateValue);
          if (!ngModel) {
            elem.bind('change', updateValue);
          }
          if (ngModel) {
            ngModel.$render = function () {
              setValue(ngModel.$viewValue);
            };
          }
          function updateValue(e) {
            var val = elem.val();
            if (elem.hasClass(emptyClassName) && val === text) {
              return;
            }
            if (document.documentMode <= 11) {
              $timeout(function () {
                setValueWithModel(val);
              }, 0);
            } else {
              setValueWithModel(val);
            }
          }
          function setValueWithModel(val) {
            setValue(val);
            if (ngModel) {
              ngModel.$setViewValue(val);
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
          function getDomValue() {
            var val = elem.val();
            if (val === attrs.placeholder) {
              val = '';
            }
            return val;
          }
          function setupPasswordPlaceholder() {
            clone = angular.element('<input type="text"/>').attr(angular.extend(extractAttributes(domElem), {
              'type': undefined,
              'value': text,
              'placeholder': '',
              'id': '',
              'name': ''
            })).addClass(emptyClassName).addClass('ng-hide').bind('focus', hidePasswordPlaceholderAndFocus);
            domElem.parentNode.insertBefore(clone[0], domElem);
          }
          function showPasswordPlaceholder() {
            clone.val(text);
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
          function extractAttributes(element) {
            var attr = element.attributes, copy = {}, skip = /^jQuery\d+/;
            for (var i = 0; i < attr.length; i++) {
              if (attr[i].specified && !skip.test(attr[i].name)) {
                copy[attr[i].name] = attr[i].value;
              }
            }
            return copy;
          }
        }
      };
    }
  ]);
}(window.angular, window.document));