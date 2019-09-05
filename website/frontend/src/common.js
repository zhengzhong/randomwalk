// Project-wide assets (JavaScript and CSS).
//
// - Bootstrap 4 JavaScript library
// - JavaScript polyfill libraries
// - Other vendor packages (holderjs, toastr, etc.)
//
// Note: jQuery is a provided vender package that needs to be loaded separately, from a CDN.

// Bootstrap JavaScript library, without stylesheets.
import 'bootstrap';

// Polyfills.
import '@babel/polyfill';
import 'whatwg-fetch';

import 'holderjs/holder';

// Toastr.
import 'toastr';
import 'toastr/build/toastr.min.css';
