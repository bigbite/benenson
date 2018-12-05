<?php

/**
 * Checks whether the post has a Gutenberg Hero Block.
 *
 * @since 1.0.0
 * @return boolean
 */
if ( ! function_exists( 'benenson_post_has_header' ) ) {
	function benenson_post_has_header() {
		$content = get_the_content();

		return false !== strpos( $content, '<!-- wp:benenson/block-hero /-->' );
	}
}

/**
 * Get the header data for rendering the block.
 *
 * @since 1.0.0
 * @return array
 */
if ( ! function_exists( 'benenson_get_header_data' ) ) {
	function benenson_get_header_data() {
		global $post, $wpdb;

		$cached = wp_cache_get( 'benenson_get_header_data' );
		if ( $cached ) {
			return $cached;
		}

		// phpcs:ignore
		$raw_data = $wpdb->get_results( $wpdb->prepare(
			"SELECT substring(meta_key, 7) as meta_key, meta_value FROM {$wpdb->postmeta} WHERE post_id = %d AND meta_key LIKE %s",
			$post->ID, '_hero_%'
		), ARRAY_A );

		if ( empty( $raw_data ) ) {
			return [];
		}

		$raw_data = array_column( $raw_data, 'meta_value', 'meta_key' );

		$data = [];

		// Because Gutenberg attributes are camelCase we MUST
		// camelize any attribute keys before render so they are
		// accessible.
		foreach ( $raw_data as $key => $value ) {
			$data[ camel( $key ) ] = $value;
		}

		if ( isset( $data['videoId'] ) ) {
			$data['featuredVideoId'] = intval( $data['videoId'], 10 );
			unset( $data['videoId'] );
		}

		$data['imageID'] = intval( get_post_thumbnail_id(), 10 );

		wp_cache_add( 'benenson_get_header_data', $data );

		return $data;
	}
}
