/*! angular-shims-placeholder - v0.2.0 - 2014-04-29
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
        var orig_type = attrs.type, is_pwd = orig_type === 'password', text = attrs.placeholder, emptyClassName = 'empty', clone;
        if (!text) {
          return;
        }
        if (is_pwd) {
          setupPasswordPlaceholder();
        }
        setValue(elem.val());
        ngModel.$setViewValue(elem.val());
        elem.bind('focus', function () {
          if (elem.hasClass(emptyClassName)) {
            elem.val('');
            elem.removeClass(emptyClassName + ' error');
          }
        });
        elem.bind('blur', function () {
          var orig_val = elem.val();
          scope.$apply(function () {
            setValue(orig_val);
            ngModel.$setViewValue(orig_val);
          });
        });
        ngModel.$render = function () {
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
        function setupPasswordPlaceholder() {
          clone = angular.element('<input/>').attr(angular.extend(extractAttributes(elem[0]), {
            'type': 'text',
            'value': text,
            'placeholder': '',
            'id': '',
            'name': ''
          })).hide().bind('focus', function (e) {
            clone.hide();
            elem.show().focus();
          }).insertBefore(elem);
          elem.bind('blur', function (e) {
            if (!elem.val()) {
              elem.hide();
              clone.show();
            }
          });
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