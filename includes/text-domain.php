<?php

/**
 * Load the theme text domain for all template strings within the content
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_load_textdomain' ) ) {
	function benenson_load_textdomain() {
		load_theme_textdomain( 'benenson', get_stylesheet_directory() . '/languages' );
	}
}

add_action( 'after_setup_theme', 'benenson_load_textdomain' );
