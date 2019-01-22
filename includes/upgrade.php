<?php

add_action( 'load-themes.php', 'update_benenson' );
add_action( 'load-update.php', 'update_benenson' );
add_action( 'wp_update_themes', 'update_benenson' );
add_action( 'load-update-core.php', 'update_benenson' );

if ( ! function_exists( 'update_benenson' ) ) {
	/**
	 * Integrate Benenson version comparison into WP core's process.
	 *
	 * @return void
	 */
	function update_benenson() {
		// don't check during install.
		if ( wp_installing() ) {
			return;
		}

		$theme = wp_get_theme( 'benenson' );

		// theme has gone awry, somehow.
		if ( ! is_a( $theme, 'WP_Theme' ) ) {
			return;
		}

		$last_update = get_site_transient( 'update_themes' );

		// update already reported.
		if ( isset( $last_update->response['benenson'] ) ) {
			return;
		}

		// GitHub REST API v3
		$request_url    = 'https://api.github.com/repos/bigbitecreative/benenson/releases/latest';
		$request_params = [
			'httpversion' => '1.1',
			'headers'     => [
				'Content-Type: application/json',
			],
		];

		if ( function_exists( 'vip_safe_wp_remote_get' ) ) {
			$request = vip_safe_wp_remote_get( $request_url, $request_params );
		} else {
			// phpcs:ignore
			$request = wp_remote_get( $request_url, $request_params );
		}

		$code = wp_remote_retrieve_response_code( $request );

		// API call failed.
		if ( 200 !== $code ) {
			return;
		}

		$body = wp_remote_retrieve_body( $request );
		$body = json_decode( $body );

		// failed to parse JSON response.
		if ( JSON_ERROR_NONE !== json_last_error() ) {
			return;
		}

		// check installed version against latest GitHub release.
		$version = preg_replace( '/^v/', '', $body->tag_name );
		$status  = version_compare( $theme->get( 'Version' ), $version );

		// version is up to date.
		if ( 0 === $status ) {
			return;
		}

		// version is ahead somehow.
		// perhaps show a warning to use a child theme?
		if ( 1 === $status ) {
			return;
		}

		// no package zip found.
		if ( empty( $body->assets[0]->browser_download_url ) ) {
			return;
		}

		// inform of theme update.
		$last_update->response['benenson'] = [
			'theme'       => 'benenson',
			'url'         => 'https://github.com/bigbitecreative/benenson/',
			'new_version' => $version,
			'package'     => $body->assets[0]->browser_download_url,
		];

		set_site_transient( 'update_themes', $last_update );
	}
}
