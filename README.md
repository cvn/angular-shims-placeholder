angular-shims-placeholder
=========================
[![Bower version](https://badge.fury.io/bo/angular-shims-placeholder.svg)](http://badge.fury.io/bo/angular-shims-placeholder)
[![npm version](https://badge.fury.io/js/angular-shims-placeholder.svg)](http://badge.fury.io/js/angular-shims-placeholder)
[![Build Status](https://travis-ci.org/cvn/angular-shims-placeholder.svg?branch=master)](https://travis-ci.org/cvn/angular-shims-placeholder)
[![devDependency Status](https://david-dm.org/cvn/angular-shims-placeholder/dev-status.svg)](https://david-dm.org/cvn/angular-shims-placeholder#info=devDependencies)

Angular directive to emulate the `placeholder` attribute on text and password input fields for
old browsers, such as IE9, IE8, and below. Also works on textareas and html5 input types.

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

Note
----
Remember to adapt your styles for forms using this placeholder directive. To an empty input field,
the class `empty` is added. So, when defining your styles, use a light grey, or similar, as text-color,
to distinguish optically between labels and real input.

Compatibility
-------------
This directive is compatible with ngModel, ngDisabled, ngReadonly, ngRequired, ngShow, and ngHide.

If you modify a shimmed input from outside of Angular, use the 'change' event to update the placeholder display. e.g. `elem.triggerHandler('change')`

Known Issues
------------
* Ignores text input from drag and drop
* Does not support modern-style placeholders that persist until text is entered
* IE8/9: Disabled textareas show the text insertion cursor on hover. This is due to an IE bug.
* IE8/9: Clearing a filled input while its text is selected can cause the resulting placeholder text to appear selected
* No way for an individual input to opt out
* Not tested with ngAnimate
* Not tested with ngSubmit
* Not tested with ngClass
* Not tested with dynamic placeholders e.g. placeholder="{{val}}"

Authors
-------

Original author: [Jacob Rief](https://github.com/jrief)  
Maintained by: [Chad von Nau](https://github.com/cvn)

License
-------
Released under the terms of MIT License.
