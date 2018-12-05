<?php

/**
 * Add a custom category to Gutenberg for easy selection of the custom blocks.
 *
 * @param array $categories Current Gutenberg categories.
 * @return array
 */
if ( ! function_exists( 'benenson_register_category' ) ) {
	function benenson_register_category( array $categories = [] ) {
		array_splice( $categories, 1, 0, [
			[
				'slug'  => 'benenson',
				'title' => __( 'Benenson', 'benenson' ),
			],
		] );

		return $categories;
	}
}

add_filter( 'block_categories', 'benenson_register_category', 100 );
