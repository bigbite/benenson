<?php

/**
 * Checks if a string ends with any of the items
 * in the given array.
 *
 * @since 1.0.0
 * @param string $haystack String to check end of.
 * @param array  $array    List of items to check the existence of in $string.
 * @return boolean Whether $haystack ends with and $array item.
 */
if ( ! function_exists( 'benenson_array_ends_with' ) ) {
	function benenson_array_ends_with( $haystack, $array ) {
		$haystack_length = strlen( $haystack );

		foreach ( $array as $item ) {
			$item_length = strlen( $item );

			if ( 0 === substr_compare( $haystack, $item, $haystack_length - $item_length, $item_length ) ) {
				return true;
			}
		}

		return false;
	}
}

add_filter( 'bugsnag_release_stage', function( $stage = 'production' ) {
	if ( defined( 'RELEASE_STAGE' ) ) {
		return RELEASE_STAGE;
	}

	/**
	 * Provides a list of domains that are part of the
	 * development stage. If BugSnag is enabled when an
	 * error occurs on a matching domain, stage will
	 * be set to development.
	 *
	 * @since 1.0.0
	 * @param array $domains List of domains or tlds that are part of the development stage.
	 */
	$development_stages = apply_filters( 'benenson_bugsnag_development_domains', [ '.site' ] );

	/**
	 * Provides a list of domains that are part of the
	 * staging stage. If BugSnag is enabled when an
	 * error occurs on a matching domain, stage will
	 * be set to staging.
	 *
	 * @since 1.0.0
	 * @param array $domains List of domains or tlds that are part of the staging stage.
	 */
	$staging_stages = apply_filters( 'benenson_bugsnag_staging_domains', [] );

	if ( benenson_array_ends_with( wp_parse_url( home_url(), PHP_URL_HOST ), $development_stages ) ) {
		$stage = 'development';
	}

	if ( benenson_array_ends_with( wp_parse_url( home_url(), PHP_URL_HOST ), $staging_stages ) ) {
		$stage = 'staging';
	}

	return $stage;
} );
