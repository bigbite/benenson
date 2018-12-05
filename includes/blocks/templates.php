<?php

/**
 * When creating a new page, automatically add a section block.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_add_section_to_pages' ) ) {
	function benenson_add_section_to_pages() {
		$object = get_post_type_object( 'page' );

		$object->template = [
			[ 'benenson/block-section' ],
		];
	}
}

add_action( 'init', 'benenson_add_section_to_pages' );
