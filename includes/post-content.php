<?php

/**
 * Override default excerpt length
 *
 * @see excerpt_length
 * @param int $length Number of words.
 * @return int
 */
if ( ! function_exists( 'benenson_excerpt_length' ) ) {
	function benenson_excerpt_length( $length ) {
		return 20;
	}
}

add_filter( 'excerpt_length', 'benenson_excerpt_length', 999 );

/**
 * Override default excerpt ending.
 *
 * @see excerpt_more
 * @param string $more Excerpt ending, e.g. ellipsis.
 * @return string
 */
if ( ! function_exists( 'benenson_excerpt_more' ) ) {
	function benenson_excerpt_more( $more ) {
		return '';
	}
}

add_filter( 'excerpt_more', 'benenson_excerpt_more' );
