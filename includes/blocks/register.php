<?php

// Check whether blocks can be registered before continuing.
if ( ! function_exists( 'register_block_type' ) ) {
	return;
}

require_once __DIR__ . '/list-block/render.php';
require_once __DIR__ . '/menu/render.php';
require_once __DIR__ . '/iframe/render.php';
require_once __DIR__ . '/download/render.php';
require_once __DIR__ . '/header/render.php';
require_once __DIR__ . '/category-list/render.php';


/**
 * Register the blocks that require php to be rendered.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_register_php_rendered_blocks' ) ) {
	function benenson_register_php_rendered_blocks() {
		register_block_type( 'benenson/block-list', [
			'render_callback' => 'benenson_render_list_block',
			'editor_script'   => 'benenson-blocks-js',
		] );

		register_block_type( 'benenson/block-menu', [
			'render_callback' => 'benenson_render_menu_block',
			'editor_script'   => 'benenson-blocks-js',
		] );

		register_block_type( 'benenson/block-responsive-iframe', [
			'render_callback' => 'benenson_render_iframe_block',
			'editor_script'   => 'benenson-blocks-js',
		] );

		register_block_type( 'benenson/block-download', [
			'render_callback' => 'benenson_render_download_block',
			'editor_script'   => 'benenson-blocks-js',
		] );

		register_block_type( 'benenson/header', [
			'render_callback' => 'benenson_render_header_block',
			'editor_script'   => 'benenson-blocks-js',
		] );

		register_block_type( 'benenson/block-category-list', [
			'render_callback' => 'benenson_render_category_list',
			'editor_script'   => 'benenson-blocks-js',
		] );
	}
}

add_action( 'init', 'benenson_register_php_rendered_blocks' );
