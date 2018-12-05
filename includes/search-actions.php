<?php

/**
 * Checks whether search is entirely disabled via
 * theme options and forces a 404 if it is.
 *
 * @since 1.0.0
 * @param WP_Query $wp_query The query object that parsed the query.
 * @return void
 */
if ( ! function_exists( 'benenson_disable_search' ) ) {
	function benenson_disable_search( $wp_query ) {

		if ( ! is_search() || ! benenson_get_option( '_search_disabled', false ) ) {
			return;
		}

		$wp_query->is_search       = false;
		$wp_query->query_vars['s'] = false;
		$wp_query->query['s']      = false;
		$wp_query->is_404          = true;
	}
}

add_action( 'parse_query', 'benenson_disable_search' );
