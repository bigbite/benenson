<?php

/**
 * Disables the rest API for users that are not logged in.
 *
 * @since 1.0.0
 * @param WP_ERROR|null|boolean $result The current result of the REST request.
 * @return mixed
 */
if ( ! function_exists( 'benenson_disable_rest_api' ) ) {
	function benenson_disable_rest_api( $result ) {
		/**
		 * Sets whether to disable the REST API for users that
		 * are not logged in.
		 *
		 * @since 1.0.0
		 * @param boolean $disable Whether to disable the REST API.
		 */
		$is_disabled = apply_filters( 'benenson_disable_rest_api', false );
		/**
		 * Sets whether the disabled REST API should respond with a JSON error.
		 * If set to false, a 300 redirection will occur.
		 *
		 * @since 1.0.0
		 * @param boolean $show_error Whether to display a JSON error.
		 */
		$display_json_error = apply_filters( 'benenson_disable_rest_api_json_error', true );

		// Dont display errors before we get chance to check if logged in.
		if ( ( ! empty( $result ) && ! is_a( $result, \WP_Error ) ) || ! $is_disabled || ( $is_disabled && is_user_logged_in() ) ) {
			return $result;
		}

		if ( $is_disabled && ! is_user_logged_in() ) {
			$result = new WP_Error( 'rest_not_logged_in', 'You are not currently logged in.', [ 'status' => 401 ] );
		}

		if ( $display_json_error ) {
			return $result;
		}

		wp_safe_redirect( home_url(), 300 );
		exit;
	}
}

add_filter( 'rest_authentication_errors', 'benenson_disable_rest_api' );
