'use strict';


describe('placeholder', function() {
	var scope, $compile, placeholderSniffer;

	function changeValue(elem, value) {
		elem.val(value);
		elem.triggerHandler('change'); // trigger the input directive's change handler
	}

	beforeEach(function() {
		module('ng.shims.placeholder');
	});

	beforeEach(inject(function($injector, _placeholderSniffer_) {
		placeholderSniffer = _placeholderSniffer_;
		$compile = $injector.get('$compile');
		scope = $injector.get('$rootScope');
		scope.form = {};
		// Force browser to report lack of placeholder support, so we can test the polyfill behavior
		placeholderSniffer.hasPlaceholder = function() {
			return false;
		}
	}));

	describe('on an empty text input', function() {
		var email_field;

		beforeEach(function() {
			email_field = angular.element('<input type="text" name="useremail" placeholder="E-Mail" ng-model="form.email" value="" />');
			$compile(email_field)(scope);
		});

		it('should display the placeholder as input value', function() {
			expect(email_field.val()).toBe('E-Mail');
			expect(email_field.hasClass('empty')).toBe(true);
			expect(scope.form.email).toBeUndefined();
		});

		describe('with focus', function() {
			beforeEach(function() {
				email_field.triggerHandler('focus');
			});

			afterEach(function() {
				email_field.triggerHandler('blur');
			});

			it('should hide the placeholder and remove class "empty"', function() {
				expect(email_field.val()).toBe('');
				expect(email_field.hasClass('empty')).toBe(false);
				expect(scope.form.email).toBeUndefined();
			});

			it('should restore the placeholder and class "empty" when leaving field unchanged', function() {
				email_field.triggerHandler('blur');
				expect(email_field.val()).toBe('E-Mail');
				expect(email_field.hasClass('empty')).toBe(true);
				expect(scope.form.email).toBeUndefined();
			});

			describe('when text is entered', function() {
				beforeEach(function() {
					changeValue(email_field, 'me@example.com');
					email_field.triggerHandler('blur');
				});

				it('should remember the entered text in scope.form and remove class "empty"', function() {
					expect(email_field.val()).toBe('me@example.com');
					expect(email_field.hasClass('empty')).toBe(false);
					expect(scope.form.email).toBe('me@example.com');
				});

				it('should reset the field as "empty"', function() {
					email_field.triggerHandler('focus');
					changeValue(email_field, '');
					email_field.triggerHandler('blur');
					expect(email_field.val()).toBe('E-Mail');
					expect(email_field.hasClass('empty')).toBe(true);
					expect(scope.form.email).toBe('');
				});
			});
		});

		describe('when the value is set through the model controller', function() {
			beforeEach(function() {
				expect(email_field.val()).toBe('E-Mail');
				scope.form.email = 'john@doe.com';
				scope.$digest();
			});

			it('should display the value in the input field', function() {
				expect(email_field.val()).toBe('john@doe.com');
				expect(email_field.hasClass('empty')).toBe(false);
			});

			it('should replace an empty value in the input field by placeholder', function() {
				scope.form.email = '';
				scope.$digest();
				expect(email_field.val()).toBe('E-Mail');
				expect(email_field.hasClass('empty')).toBe(true);
			});

		});

	});

	describe('on an empty password input', function() {
		var pwd_field, pwd_clone;

		beforeEach(function() {
			pwd_field = angular.element('<input type="password" name="userpwd" placeholder="Password" ng-model="form.passwd" value="" />');
			$compile(pwd_field)(scope);
			pwd_clone = angular.element(pwd_field[0].previousElementSibling);
		});

		it('should hide the password input, add class "empty", and show a separate placeholder text input', function() {
			expect(pwd_field.val()).toBe('');
			expect(pwd_field.attr('type')).toBe('password');
			expect(pwd_field.hasClass('ng-hide')).toBe(true);
			expect(pwd_field.hasClass('empty')).toBe(true);
			expect(pwd_clone.val()).toBe('Password');
			expect(pwd_clone.attr('type')).toBe('text');
			expect(pwd_clone.hasClass('ng-hide')).toBe(false);
			expect(pwd_clone.hasClass('empty')).toBe(true);
			expect(scope.form.passwd).toBeUndefined();
		});

		describe('with focus', function() {
			beforeEach(function() {
				pwd_clone.triggerHandler('focus');
				pwd_field.triggerHandler('focus');
			});

			afterEach(function() {
				pwd_field.triggerHandler('blur');
			});

			it('should show the password input, remove class "empty", and hide the placeholder', function() {
				expect(pwd_field.val()).toBe('');
				expect(pwd_field.hasClass('ng-hide')).toBe(false);
				expect(pwd_field.hasClass('empty')).toBe(false);
				expect(pwd_clone.val()).toBe('Password');
				expect(pwd_clone.hasClass('ng-hide')).toBe(true);
				expect(pwd_clone.hasClass('empty')).toBe(true);
				expect(scope.form.passwd).toBeUndefined();
			});
		});
	});

	describe('on an empty textarea', function() {
		var textarea;

		beforeEach(function() {
			textarea = angular.element('<textarea name="userprofile" placeholder="Profile" ng-model="form.profile" />');
			$compile(textarea)(scope);
		});

		it('should display the placeholder as input value and add class "empty"', function() {
			expect(textarea.val()).toBe('Profile');
			expect(textarea.hasClass('empty')).toBe(true);
			expect(scope.form.profile).toBeUndefined();
		});

		describe('with focus', function() {
			beforeEach(function() {
				textarea.triggerHandler('focus');
			});

			afterEach(function() {
				textarea.triggerHandler('blur');
			});

			it('should hide the placeholder and remove class "empty"', function() {
				expect(textarea.val()).toBe('');
				expect(textarea.hasClass('empty')).toBe(false);
				expect(scope.form.profile).toBeUndefined();
			});
		});
	});

	describe('on an empty html5 search input', function() {
		var search;

		beforeEach(function() {
			search = angular.element('<input type="search" name="query" placeholder="Search for terms..." ng-model="form.query" />');
			$compile(search)(scope);
		});

		it('should display the placeholder as input value and add class "empty"', function() {
			expect(search.val()).toBe('Search for terms...');
			expect(search.hasClass('empty')).toBe(true);
			expect(scope.form.query).toBeUndefined();
		});

		describe('with focus', function() {
			beforeEach(function() {
				search.triggerHandler('focus');
			});

			afterEach(function() {
				search.triggerHandler('blur');
			});

			it('should hide the placeholder and remove class "empty"', function() {
				expect(search.val()).toBe('');
				expect(search.hasClass('empty')).toBe(false);
				expect(scope.form.query).toBeUndefined();
			});
		});
	});

	describe('on an empty input without ngModel', function() {
		var elem;

		beforeEach(function() {
			elem = angular.element('<input type="text" placeholder="no model" />');
			$compile(elem)(scope);
		});

		it('should display the placeholder as input value and add class "empty"', function() {
			expect(elem.val()).toBe('no model');
			expect(elem.hasClass('empty')).toBe(true);
		});

		describe('with focus', function() {
			beforeEach(function() {
				elem.triggerHandler('focus');
			});

			afterEach(function() {
				elem.triggerHandler('blur');
			});

			it('should hide the placeholder and remove class "empty"', function() {
				expect(elem.val()).toBe('');
				expect(elem.hasClass('empty')).toBe(false);
			});
		});

		it('should change the value when the placeholder value changes', function() {
			elem.attr('placeholder', 'update');
			elem.triggerHandler('change');
			expect(elem.val()).toBe('update');
			expect(elem.hasClass('empty')).toBe(true);
		});
	});

	describe('on a pre-filled input without ngModel', function() {
		var elem;

		beforeEach(function() {
			elem = angular.element('<input type="text" placeholder="no model" value="existing" />');
			$compile(elem)(scope);
		});

		it('should display the value from the html element and not have class "empty"', function() {
			expect(elem.val()).toBe('existing');
			expect(elem.hasClass('empty')).toBe(false);
		});

		describe('with focus', function() {
			beforeEach(function() {
				elem.triggerHandler('focus');
			});

			afterEach(function() {
				elem.triggerHandler('blur');
			});

			it('should keep its value and not add class "empty"', function() {
				expect(elem.val()).toBe('existing');
				expect(elem.hasClass('empty')).toBe(false);
			});
		});

		it('should not change the value when the placeholder value changes', function() {
			elem.attr('placeholder', 'update');
			elem.triggerHandler('change');
			expect(elem.val()).toBe('existing');
			expect(elem.hasClass('empty')).toBe(false);
		});
	});

	describe('on an empty select element', function() {
		var elem;

		beforeEach(function() {
			elem = angular.element('<select placeholder="mistake"><option value="">Option 1</option></select>');
			$compile(elem)(scope);
		});

		it('should not be enabled', function() {
			expect(elem.hasClass('empty')).toBe(false);
		});
	});

	describe('on a empty password input with unselectable=on attribute', function() {
		var pwd_field, pwd_clone;

		beforeEach(function() {
			pwd_field = angular.element('<input type="password" name="userpwd" placeholder="Password" unselectable="on" value="" />');
			$compile(pwd_field)(scope);
			pwd_clone = angular.element(pwd_field[0].previousElementSibling);
		});

		describe('the placeholder element', function() {
			it('should be unselectable', function() {
				expect(pwd_clone.val()).toBe('Password');
				expect(pwd_clone.attr('unselectable')).toBe('on');
			});

			it('should become selectable when disabled attribute is removed', function() {
				pwd_field.removeAttr('unselectable');
				pwd_field.triggerHandler('change');
				expect(pwd_clone.val()).toBe('Password');
				expect(pwd_clone.attr('unselectable')).toBeUndefined();
			});
		});
	});

	describe('updates when attribute updates', function() {
		var elem;

		beforeEach(function() {
			scope.test = "value before";
			scope.model = "";
			elem = angular.element('<input type="text" placeholder="{{ test }}" ng-model="model" />');
			$compile(elem)(scope);
			scope.$digest();
		});

		it('should update when the attribute value is updated', function() {
			expect(elem.val()).toBe('value before');
			scope.test = "value after";
			scope.$digest();
			expect(elem.val()).toBe('value after');
		});

		it('should not update when the input field has text', function() {
			expect(elem.val()).toBe('value before');
			scope.model = "something";
			scope.$digest();
			scope.test = "value after";
			scope.$digest();
			expect(elem.val()).toBe('something');
		});
	});

	describe('on an input with ngModel value 0', function() {
	  var elem;

	  beforeEach(function () {
	    scope.model = 0;
	    elem = angular.element('<input type="text" placeholder="Empty" ng-model="model" />');
	    $compile(elem)(scope);
	    scope.$digest();
	  });

	  it('should display 0', function () {
	    console.log(elem.val());
	    expect(elem.val()).toBe('0');
	  });
	});

	describe('on an input with ngAttrPlaceholder', function() {
		var elem;

		beforeEach(function () {
			elem = angular.element('<input type="text" ng-attr-placeholder="Some text" ng-model="form.someText"/>');
			$compile(elem)(scope);
		});

		it('should display the placeholder as input value', function() {
			expect(elem.val()).toBe('Some text');
			expect(elem.hasClass('empty')).toBe(true);
			expect(scope.form.someText).toBeUndefined();
		});
	});

	describe('on a password input with ngAttrPlaceholder whose value is undefined', function() {
		var elem, clone;

		beforeEach(function () {
			elem = angular.element('<input type="password" ng-attr-placeholder="{{undefined}}" ng-model="form.somePassword"/>');
			$compile(elem)(scope);
			clone = angular.element(elem[0].previousElementSibling);
		});

		it('should display an empty placeholder', function() {
			expect(clone.val()).toBe('');
		});
	});

});
