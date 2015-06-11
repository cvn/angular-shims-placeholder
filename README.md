angular-shims-placeholder
=========================
[![Bower version](https://badge.fury.io/bo/angular-shims-placeholder.svg)](http://badge.fury.io/bo/angular-shims-placeholder)
[![npm version](https://badge.fury.io/js/angular-shims-placeholder.svg)](http://badge.fury.io/js/angular-shims-placeholder)
[![Build Status](https://travis-ci.org/cvn/angular-shims-placeholder.svg?branch=master)](https://travis-ci.org/cvn/angular-shims-placeholder)
[![devDependency Status](https://david-dm.org/cvn/angular-shims-placeholder/dev-status.svg)](https://david-dm.org/cvn/angular-shims-placeholder#info=devDependencies)

Angular directive to emulate the `placeholder` attribute on text and password input fields for
old browsers, such as IE9, IE8, and IE7. Also works on textareas and html5 input types.

This directive works in both directions, which means that changing the value from inside the model 
is honoured in the form.  

In comparison to https://github.com/urish/angular-placeholder-shim, this Angular directive is
implementend purely on the AngularJS API and does not depend on other libraries, such as jQuery and
[jquery-html5-placeholder-shim](https://github.com/parndt/jquery-html5-placeholder-shim).

Demo
----

[View Demo](http://cvn.github.io/angular-shims-placeholder)

Usage
-----
Include 
```html
<script src="angular-shims-placeholder.min.js"></script>
```
into your application.

Add the module as a dependency to your application module:

```js
angular.module('MyAwesomeApp', [/* other dependencies */, 'ng.shims.placeholder']);
```

That's it. Now, text fields having an attribute `placeholder` behave almost as native
placeholder fields, even on IE8 and below.

Example:
```html
<input type="text" name="email" placeholder="Enter your email" />
```

Notes
-----
The class `empty` is added when the input is empty and the placeholder is
showing. Make it look like a placeholder e.g. `.empty { color: #a9a9a9; }`

If you modify a shimmed input from outside of Angular, trigger the 'change'
event to update the placeholder display e.g. `elem.triggerHandler('change')`

Compatibility
-------------
* Angular 1.0.8 - 1.4
* IE9, IE8, IE7 * (see known issues)
* ngModel, ngDisabled, ngReadonly, ngRequired, ngShow, ngHide, ngAttrPlaceholder
* ngAnimate (Angular 1.3+ only)

Known Issues
------------
* Angular 1.3 dropped support for IE8, and 1.2 dropped IE7. If you need to support those browsers, use an older version of Angular.
* Ignores text input from drag and drop
* Does not support modern-style placeholders that persist until text is entered
* IE8/9: Disabled textareas show the text insertion cursor on hover. This is due to an IE bug.
* IE8/9: Clearing a filled input while its text is selected can cause the resulting placeholder text to appear selected
* No way for an individual input to opt out
* Not tested with ngSubmit
* Not tested with ngClass
* ngAnimate: Password placeholder text pops in after animations complete
* The unit tests only work with Angular 1.2 and up

Authors
-------

Original author: [Jacob Rief](https://github.com/jrief)  
Maintained by: [Chad von Nau](https://github.com/cvn)

License
-------
Released under the terms of MIT License.
