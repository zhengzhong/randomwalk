// Project-wide assets (JavaScript and CSS).

// Bootstrap is dependent on jQuery and Popper (defined as `peerDependencies`).
// Make sure these two libraries are declared in our `package.json`.
// See: https://getbootstrap.com/docs/4.3/getting-started/webpack/
import 'bootstrap';

// Polyfills.
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';

import 'holderjs/holder';

// Our Bootstrap-based stylesheet.
import './scss/coral.scss';
// import './scss/purple.scss';

// To allow using jQuery in HTML pages, we add `jQuery` and `$` to global scope.
import jQuery from 'jquery';

window.jQuery = jQuery;
window.$ = jQuery;
