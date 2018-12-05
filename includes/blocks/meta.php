<?php

/**
 * Register all meta required for gutenberg/REST API.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_register_meta' ) ) {
	function benenson_register_meta() {
		$args = [
			'show_in_rest'  => true,
			'single'        => true,
			'auth_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
		];

		register_meta( 'post', '_nav_style', $args );
		register_meta( 'post', '_thumbnail_style', $args );
		register_meta( 'post', '_hero_title', $args );
		register_meta( 'post', '_hero_content', $args );
		register_meta( 'post', '_hero_cta_text', $args );
		register_meta( 'post', '_hero_cta_link', $args );
		register_meta( 'post', '_hero_alignment', $args );
		register_meta( 'post', '_hero_background', $args );
		register_meta( 'post', '_hero_size', $args );
		register_meta( 'post', '_hero_show', $args );
		register_meta( 'post', '_hero_type', $args );
		register_meta( 'post', '_hero_embed', $args );
		register_meta( 'post', '_hero_video_id', array_merge( $args, [ 'type' => 'integer' ] ) );
		register_meta( 'post', '_hide_featured_image', array_merge( $args, [ 'type' => 'boolean' ] ) );
		register_meta( 'post', '_stretch_thumbnail', array_merge( $args, [ 'type' => 'boolean' ] ) );
		register_meta( 'post', '_reduce_content_width', array_merge( $args, [ 'type' => 'boolean' ] ) );
		register_meta( 'post', '_disable_sidebar', array_merge( $args, [ 'type' => 'boolean' ] ) );
		register_meta( 'post', '_disable_share_icons', array_merge( $args, [ 'type' => 'boolean' ] ) );
		register_meta( 'post', '_sidebar_id', array_merge( $args, [ 'type' => 'integer' ] ) );
		register_meta( 'post', 'download_id', array_merge( $args, [ 'type' => 'integer' ] ) );
		register_meta( 'post', 'download_text', array_merge( $args, [ 'type' => 'string' ] ) );
		register_meta( 'post', 'recipients', array_merge( $args, [ 'type' => 'string' ] ) );
		register_meta( 'post', 'recipients_refresh', array_merge( $args, [ 'type' => 'string' ] ) );
		register_meta( 'post', 'recipients_refreshed', array_merge( $args, [ 'type' => 'string' ] ) );
		register_meta( 'post', 'document_ref', array_merge( $args, [ 'type' => 'string' ] ) );
	}
}

add_action( 'init', 'benenson_register_meta' );
