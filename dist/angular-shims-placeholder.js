/*! angular-shims-placeholder - v0.2.0 - 2014-04-30
* https://github.com/jrief/angular-shims-placeholder
* Copyright (c) 2014 Jacob Rief; Licensed MIT */
(function (angular, document, undefined) {
  'use strict';
  angular.module('ng.shims.placeholder', []).directive('placeholder', function () {
    if (!angular.mock) {
      var test = document.createElement('input');
      if (test.placeholder !== void 0)
        return {};
    }
    return {
      restrict: 'A',
      require: 'ngModel',
      priority: 1,
      link: function (scope, elem, attrs, ngModel) {
        var orig_val = elem.val() || '', is_pwd = attrs.type === 'password', text = attrs.placeholder, emptyClassName = 'empty', domElem = elem[0], clone;
        if (!text) {
          return;
        }
        if (is_pwd) {
          setupPasswordPlaceholder();
        }
        setValue(orig_val);
        ngModel.$setViewValue(orig_val);
        elem.bind('focus', function () {
          if (elem.hasClass(emptyClassName)) {
            elem.val('');
            elem.removeClass(emptyClassName);
            elem.removeClass('error');
          }
        });
        elem.bind('blur', function () {
          var val = elem.val();
          scope.$apply(function () {
            setValue(val);
            ngModel.$setViewValue(val);
          });
        });
        ngModel.$render = function () {
          setValue(ngModel.$viewValue);
        };
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
            elem.val(val);
          }
        }
        function setupPasswordPlaceholder() {
          clone = angular.element('<input/>').attr(angular.extend(extractAttributes(domElem), {
            'type': 'text',
            'value': text,
            'placeholder': '',
            'id': '',
            'name': ''
          })).addClass(emptyClassName).addClass('ng-hide').bind('focus', hidePasswordPlaceholder);
          domElem.parentNode.insertBefore(clone[0], domElem);
        }
        function showPasswordPlaceholder() {
          elem.addClass('ng-hide');
          clone.removeClass('ng-hide');
        }
        function hidePasswordPlaceholder() {
          clone.addClass('ng-hide');
          elem.removeClass('ng-hide');
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
  });
}(window.angular, window.document));