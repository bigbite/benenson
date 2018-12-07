<?php

/**
 * All valid post sorting methods on the news index.
 *
 * @return array
 */
if ( ! function_exists( 'benenson_valid_sort_parameters' ) ) {
	function benenson_valid_sort_parameters() {
		$sorts = [
			/* translators: Post sort by option */
			'date-desc'  => __( 'Most Recent', 'benenson' ),
			/* translators: Post sort by option */
			'date-asc'   => __( 'Oldest First', 'benenson' ),
			/* translators: Post sort by option */
			'title-asc'  => __( 'Title - Ascending', 'benenson' ),
			/* translators: Post sort by option */
			'title-desc' => __( 'Title - Descending', 'benenson' ),
		];

		if ( is_search() ) {
			/* translators: Post sort by option */
			$sorts = [ 'relevance-desc' => __( 'Most Relevant', 'benenson' ) ] + $sorts;
		}

		return $sorts;
	}
}

/**
 * Adds sorting parameters to the url passed to the function.
 *
 * @param string $current_url - Url to append sort query to.
 *
 * @return string
 */
if ( ! function_exists( 'benenson_add_sort_parameters' ) ) {
	function benenson_add_sort_parameters( $current_url = '' ) {
		$sort = get_query_var( 'sort' );

		if ( ! $sort ) {
			return remove_query_arg( 'sort', $current_url );
		}

		return add_query_arg( compact( 'sort' ), $current_url );
	}
}

add_filter( 'get_pagenum_link', 'benenson_add_sort_parameters' );

/**
 * Register custom query vars.
 *
 * @link https://codex.wordpress.org/Plugin_API/Filter_Reference/query_vars
 *
 * @param array $vars The array of available query variables.
 * @return array
 */
if ( ! function_exists( 'benenson_register_query_vars' ) ) {
	function benenson_register_query_vars( $vars ) {
		$vars[] = 'sort';
		return $vars;
	}
}

add_filter( 'query_vars', 'benenson_register_query_vars' );

/**
 * Applies the filter to the query if its valid.
 *
 * @param WP_Query $query - Current WordPress query.
 */
if ( ! function_exists( 'benenson_sort_posts_in_main_query' ) ) {
	function benenson_sort_posts_in_main_query( $query ) {
		if ( is_admin() || ! $query->is_main_query() ) {
			return;
		}

		$sort = get_query_var( 'sort' );

		if ( ! $sort ) {
			return;
		}

		$valid_sort_parameters = array_keys( benenson_valid_sort_parameters() );

		if ( ! in_array( $sort, $valid_sort_parameters, true ) ) {
			return;
		}

		list( $orderby, $order ) = explode( '-', $sort );

		$query->set( 'order', $order );
		$query->set( 'orderby', $orderby );
	}
}

add_action( 'pre_get_posts', 'benenson_sort_posts_in_main_query' );

/**
 * Trims text to a space then adds ellipses if desired.
 *
 * @param string $input       Text to trim.
 * @param int    $length      In characters to trim to.
 * @param bool   $ellipses    If ellipses (...) are to be added.
 * @param bool   $strip_html  If html tags are to be stripped.
 * @param bool   $strip_style If css style are to be stripped.
 * @return string
 */
if ( ! function_exists( 'trim_text' ) ) {
	function trim_text( $input, $length, $ellipses = true, $strip_html = true, $strip_style = true ) {
		if ( $strip_html ) {
			$input = wp_strip_all_tags( $input );
		}

		if ( $strip_style ) {
			$input = preg_replace( '/(<[^>]+) style=".*?"/i', '$1', $input );
		}

		if ( 'full' === $length ) {
			return $input;
		}

		// no need to trim, already shorter than trim length.
		if ( strlen( $input ) <= $length ) {
			return $input;
		}

		// find last space within length.
		$last_space   = strrpos( substr( $input, 0, $length ), ' ' );
		$trimmed_text = substr( $input, 0, $last_space );

		// add ellipses.
		if ( $ellipses ) {
			$trimmed_text .= '...';
		}

		return $trimmed_text;
	}
}

/**
 * Remove empty p tags from WordPress posts.
 *
 * @since
 * @author https://gist.github.com/ninnypants/1668216
 *
 * @param string $content Current content.
 * @return string
 */
if ( ! function_exists( 'remove_empty_p' ) ) {
	function remove_empty_p( $content = '' ) {
		$content = preg_replace( [
			'#<p>\s*<(div|aside|section|article|header|footer)#',
			'#</(div|aside|section|article|header|footer)>\s*</p>#',
			'#</(div|aside|section|article|header|footer)>\s*<br ?/?>#',
			'#<(div|aside|section|article|header|footer)(.*?)>\s*</p>#',
			'#<p>\s*</(div|aside|section|article|header|footer)#',
		], [
			'<$1',
			'</$1>',
			'</$1>',
			'<$1$2>',
			'</$1',
		], $content );

		return preg_replace( '#<p>(\s|&nbsp;)*+(<br\s*/*>)*(\s|&nbsp;)*</p>#i', '', $content );
	}
}

add_filter( 'the_content', 'remove_empty_p', 20, 1 );

/**
 * Removes the first image from the content if it
 * is the same as the featured image.
 *
 * @since 1.0.0
 *
 * @param string $content Current content.
 * @return string
 */
if ( ! function_exists( 'benenson_remove_duplicate_image' ) ) {
	function benenson_remove_duplicate_image( $post_content ) {
		$featured_image_id = get_post_thumbnail_id();
		$featured_image    = wp_get_attachment_image_url( $featured_image_id, 'full' );

		$first_line = strtok( $post_content, "\n" );

		preg_match( '/(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i', $first_line, $matches );

		if ( isset( $matches[0] ) && $matches[0] === $featured_image ) {
			$content_array = explode( "\n", $post_content );

			$post_content = implode( "\n", array_slice( $content_array, 1 ) );
		}

		return $post_content;
	}
}

add_filter( 'the_content', 'benenson_remove_duplicate_image', 20, 1 );

/**
 * Remove empty secctions from the content.
 * This is to adjust for user-error if empty section gutenblocks are added to the content.
 *
 * @since 1.0.0
 * @param string $content Post content.
 * @return string
 */

if ( ! function_exists( 'benenson_strip_empty_sections' ) ) {
	function benenson_strip_empty_sections( $content = '' ) {
		return preg_replace( '/<section[^>]+><div class="container">\s*?<\/div><\/section>/', '', $content );
	}
}

add_filter( 'the_content', 'benenson_strip_empty_sections', 20 );

/**
 * Add a classname to post tag term links
 */
add_filter( 'term_links-post_tag', function ( $links = [] ) {
	$tag_class = apply_filters( 'benenson_post_tag_classname', 'post-category' );

	foreach ( $links as &$link ) {
		$link = str_replace( '<a ', sprintf( '<a class="%s" ', $tag_class ), $link );
	}

	return $links;
} );
