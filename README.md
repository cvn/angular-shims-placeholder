angular-shims-placeholder
=========================

Angular directive to emulate attribute `ng-src` in input fields of type text and password
for all browsers, including IE8 and lower.

In comparison to https://github.com/urish/angular-placeholder-shim, this Angular directive is
implementend purely on Angulars API and does not depend on other libraries, such as jQuery and
[jquery-html5-placeholder-shim](https://github.com/parndt/jquery-html5-placeholder-shim).

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

That's it. Now text fields having an attribute `placeholder` behave almost as native
placeholder fields, even on IE8 and below.
 
```html
<input type="text" name="email" placeholder="Enter your email" />
```

License
-------
Released under the terms of MIT License.

Copyright (C) 2013, Jacob Rief <jacob.rief@gmail.com>
