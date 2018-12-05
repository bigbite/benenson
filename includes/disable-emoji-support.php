<?php

/**
 * Provides the ability to remove emoji scripts and
 * styles for both desktop and print.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_disable_emoji_support' ) ) {
	function benenson_disable_emoji_support() {
		/**
		 * Allows for disabling of emojis on the site.
		 *
		 * @since 1.0.0
		 *
		 * @param boolean $disable Whether to disable emojis.
		 */
		if ( ! apply_filters( 'benenson_disable_emoji', false ) ) {
			return;
		}

		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
	}
}

add_action( 'wp_loaded', 'benenson_disable_emoji_support' );
