<?php
/**
 * Setup theme support.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_theme_support' ) ) {
	function benenson_theme_support() {
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'editor-color-palette' );
		add_theme_support( 'disable-custom-colors' );

		remove_theme_support( 'post-formats' );

		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
		$GLOBALS['content_width'] = apply_filters( 'benenson_content_width', 1200 );
	}
}

add_action( 'after_setup_theme', 'benenson_theme_support' );

/**
 * Add excerpt support to pages to use on the grid blocks.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_page_type_support' ) ) {
	function benenson_page_type_support() {
		add_post_type_support( 'page', 'excerpt' );
	}
}

add_action( 'init', 'benenson_page_type_support' );

/**
 * Rename default template for clarity.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_default_template_rename' ) ) {
	function benenson_default_template_rename() {
		return __( 'Standard Post Template', 'benenson' );
	}
}

add_filter( 'default_page_template_title', 'benenson_default_template_rename' );
