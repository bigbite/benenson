<?php

/**
 * Remove hero meta if the hero block is removed.
 *
 * @param integer $post_id - Current post id.
 * @param WP_Post $post - Current post object.
 */
if ( ! function_exists( 'benenson_remove_hero_meta' ) ) {
	function benenson_remove_hero_meta( $post_id, $post ) {
		$block_identifier = '<!-- wp:benenson/block-hero /-->';

		if ( strpos( $post->post_content, $block_identifier ) !== false ) {
			return;
		}

		$meta_to_remove = [
			'_hero_alignment',
			'_hero_background',
			'_hero_size',
			'_hero_show',
			'_hero_cta_link',
			'_hero_content',
			'_hero_cta_text',
			'_hero_title',
		];

		foreach ( $meta_to_remove as $meta_key ) {
			if ( get_post_meta( $post_id, $meta_key, true ) ) {
				delete_post_meta( $post_id, $meta_key );
			}
		}
	}
}

add_action( 'save_post', 'benenson_remove_hero_meta', 100, 2 );

/**
 * Remove recipient meta if the recipient block is removed.
 *
 * @param integer $post_id - Current post id.
 * @param WP_Post $post - Current post object.
 */
if ( ! function_exists( 'benenson_remove_recipient_meta' ) ) {
	function benenson_remove_recipient_meta( $post_id, $post ) {
		$block_identifier = '<!-- wp:benenson/block-recipients /-->';

		if ( strpos( $post->post_content, $block_identifier ) !== false ) {
			return;
		}

		$meta_to_remove = [
			'recipients_refresh',
		];

		foreach ( $meta_to_remove as $meta_key ) {
			if ( get_post_meta( $post_id, $meta_key, true ) ) {
				delete_post_meta( $post_id, $meta_key );
			}
		}
	}
}

add_action( 'save_post', 'benenson_remove_recipient_meta', 100, 2 );


/**
 * Remove recipient meta if the recipient block is removed.
 *
 * @param integer $post_id - Current post id.
 * @param WP_Post $post - Current post object.
 */
if ( ! function_exists( 'benenson_remove_stale_recipient_meta' ) ) {
	function benenson_remove_stale_recipient_meta( $post_id, $post ) {
		if ( get_post_meta( $post_id, 'recipients_refreshed', true ) === 'true' &&
			get_post_meta( $post_id, 'recipients', true ) ) {
			delete_post_meta( $post_id, 'recipients' );
		}
	}
}

add_action( 'save_post', 'benenson_remove_stale_recipient_meta', 100, 2 );
