angular-shims-placeholder
=========================

Angular directive to emulate attribute `placeholder` in input fields of type text and of type password
for all browsers, including IE8 and lower.

This directive works in both directions, which means that changing the value from inside the model 
is honoured in the form.  

In comparison to https://github.com/urish/angular-placeholder-shim, this Angular directive is
implementend purely on the AngularJS API and does not depend on other libraries, such as jQuery and
[jquery-html5-placeholder-shim](https://github.com/parndt/jquery-html5-placeholder-shim).

Build status
------------

[![Build Status](https://travis-ci.org/jrief/angular-shims-placeholder.png?branch=master)](https://travis-ci.org/jrief/angular-shims-placeholder)

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

License
-------
Released under the terms of MIT License.

Copyright (C) 2013, Jacob Rief <jacob.rief@gmail.com>
