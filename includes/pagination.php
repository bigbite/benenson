<?php

/**
 * Wrapper for paginate_links to add a11y labels.
 *
 * @see paginate_links
 * @param array $args the pagination arguments.
 * @return array
 */
if ( ! function_exists( 'benenson_paginate_links' ) ) {
	function benenson_paginate_links( array $args = [] ) {
		$page_numbers = paginate_links( $args );

		$page_numbers = is_array( $page_numbers ) ? $page_numbers : [];

		foreach ( $page_numbers as $index => $html ) {
			// ignore "..." decorative span
			if ( false !== strpos( $html, '>&hellip;<' ) ) {
				$page_numbers[ $index ] = $html;
				continue;
			}

			// insert aria label for each page number.
			$page_numbers[ $index ] = preg_replace(
				'/^\s*?<(\w+)\s+([^>]+)>([^<]+)<\/\1>/',
				/* translators: page number prefix, e.g. "[Page] 1" */
				'<$1 aria-label="' . esc_attr( __( 'Page', 'benenson' ) ) . ' $3" $2>$3</$1>',
				$html
			);
		}

		return $page_numbers;
	}
}
