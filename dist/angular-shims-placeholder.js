/*! angular-shims-placeholder - v0.1.0 - 2014-03-21
* https://github.com/jrief/angular-shims-placeholder
* Copyright (c) 2014 Jacob Rief; Licensed MIT */
(function (angular, undefined) {
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
        var orig_type = attrs.type;
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
        elem.bind('focus', function () {
          if (elem.hasClass('empty')) {
            elem.val('');
            elem.removeClass('empty error');
            elem.attr('type', orig_type);
          }
        });
        elem.bind('blur', function () {
          var orig_val = elem.val();
          setValue(orig_val);
          scope.$apply(function () {
            ngModel.$setViewValue(orig_val);
          });
        });
        ngModel.$render = function () {
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
}(window.angular));