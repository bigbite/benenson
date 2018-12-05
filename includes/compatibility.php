<?php
/**
 * Compatibility file purpose is to hold a number of fixes
 * and polyfills to ensure required functionality is handled
 * without throwing errors or causing other issues.
 */


/**
 * set_magic_quotes_runtime function was depreciated in
 * PHP 5.3 and removed in 7.0.
 * http://php.net/manual/en/function.set-magic-quotes-runtime.php
 *
 * This function is required by WordPress RSS Importer plugin,
 * which will fail if not found.
 */
if ( ! function_exists( 'set_magic_quotes_runtime' ) ) {
	function set_magic_quotes_runtime( $new_setting ) {
		return true;
	}
}
