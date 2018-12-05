/**
 * Polyfills from https://github.com/zloirock/core-js
 */
import 'core-js/fn/array/from';
import 'core-js/fn/object/assign';
import 'core-js/fn/promise';

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector;
}
