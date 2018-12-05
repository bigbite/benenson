<?php

/**
 * Prevent WordPress from overly compressing .jpg files.
 *
 * @since 1.0.0
 */
function benenson_image_quality() {
	return 100;
}

add_filter( 'jpeg_quality', 'benenson_image_quality' );
add_filter( 'wp_editor_set_quality', 'benenson_image_quality' );

/**
 * Return the image url of a posts featured image at the desired size.
 *
 * @since 1.0.0
 * @param int|bool $post_id The desired post's ID.
 * @param string   $size    The desired image size.
 * @return bool|string
 */
if ( ! function_exists( 'benenson_featured_image' ) ) {
	function benenson_featured_image( $post_id = false, $size = 'full' ) {
		if ( ! $post_id ) {
			$post_id = get_the_ID();
		}

		$img_url = get_the_post_thumbnail_url( $post_id, $size );

		$post_thumbnail_id = get_post_thumbnail_id( $post_id );

		if ( ! $img_url ) {
			/**
			 * Sets the feature image to a default if non set
			 *
			 * @since 1.0.0
			 *
			 * @param string $image_path String path to default image.
			 */
			return apply_filters( 'benenson_default_featured_image', '/wp-content/themes/benenson/assets/images/default-tall.png' );
		}

		return $img_url;
	}
}

/**
 * Gets array of image sizes
 * 'example' => array( 376, 282, true ),
 *
 * @since 1.0.0
 * @return array
 */
if ( ! function_exists( 'get_theme_image_sizes' ) ) {
	function get_theme_image_sizes() {
		return [
			'post-full'        => [ 720, 920, true ],
			'post-half'        => [ 360, 230, true ],
			'post-half@2x'     => [ 720, 460, true ],
			'post-featured'    => [ 914, 527, true ],
			'post-featured@2x' => [ 1828, 1054, true ],
			'grid-item'        => [ 900, 900, true ],
			'image-block'      => [ 0, 600, [ 'center', 'bottom' ] ],
			'hero-lg'          => [ 2560, 710, true ],
			'hero-md'          => [ 1444, 710, true ],
			'hero-sm'          => [ 770, 710, true ],
			'logotype'         => [ 180, 72, false ],
			'logotype@2x'      => [ 360, 144, false ],
			'logomark'         => [ 60, 60, false ],
			'logomark@2x'      => [ 120, 120, false ],
			'lwi-block-sm'     => [ 120, 120, false ],
			'lwi-block-sm@2x'  => [ 400, 400, false ],
			'lwi-block-md'     => [ 260, 260, false ],
			'lwi-block-md@2x'  => [ 520, 520, false ],
			'lwi-block-lg'     => [ 325, 325, false ],
			'lwi-block-lg@2x'  => [ 650, 650, false ],
			'logo-block'       => [ 9999, 110, false ],
		];
	}
}

/**
 * Loop through and add all of the image sizes declared in `get_theme_image_sizes`.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_theme_image_sizes' ) ) {
	function benenson_theme_image_sizes() {
		foreach ( get_theme_image_sizes() as $label => $dims ) {
			add_image_size( $label, $dims[0], $dims[1], $dims[2] );
		}
	}
}

add_action( 'after_setup_theme', 'benenson_theme_image_sizes' );

/**
 * Adds image size options to editor choice by taking size list
 * and making array with spaced words from hyphenated size names.
 *
 * @since 1.0.0
 * @param array $sizes List of sizes available.
 * @return array
 */
if ( ! function_exists( 'benenson_image_size_select' ) ) {
	function benenson_image_size_select( $sizes = [] ) {
		foreach ( array_keys( get_theme_image_sizes() ) as $size ) {
			$sizes[ $size ] = ucwords( preg_replace( '/[-@]/', ' ', $size ) );
		}

		ksort( $sizes );

		return $sizes;
	}
}

add_filter( 'image_size_names_choose', 'benenson_image_size_select' );
