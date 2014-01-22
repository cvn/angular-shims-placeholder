/*! angular-shims-placeholder - v0.1.0 - 2013-10-14
* https://github.com/jrief/angular-shims-placeholder
* Copyright (c) 2013 Jacob Rief; Licensed MIT */
(function(angular, document, undefined) {
  'use strict';
  angular.module('ng.shims.placeholder', []).directive('placeholder', function() {
    if (!angular.mock) {
      var test = document.createElement('input');
      if (test.placeholder !== void 0)
        return {};
    }
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
        var orig_type = attrs.type,
            is_pwd = orig_type === 'password',
            text = attrs.placeholder,
            emptyClassName = 'empty',
            clone;
        if (!text) { return; }
        if (is_pwd) {
            clone = elem.clone().attr({
                    'type': 'text',
                    'value': text,
                    'placeholder': ''
                })
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
        ngModel.$setViewValue(elem.val());
        setValue(elem.val());
        elem.bind('focus', function() {
          if (elem.hasClass(emptyClassName)) {
            elem.val('');
            elem.removeClass(emptyClassName);
          }
        });
        elem.bind('blur', function() {
          var orig_val = elem.val();
          scope.$apply(function() {
            setValue(orig_val);
            ngModel.$setViewValue(orig_val);
          });
        });
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
      }
    };
  });
}(window.angular, window.document));
