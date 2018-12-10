<?php

/**
 * Registers and enqueues scripts for the theme admin.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_theme_options_scripts' ) ) {
	function benenson_theme_options_scripts() {
		if ( ! is_admin() ) {
			return;
		}

		wp_enqueue_media();
		wp_register_script( 'benenson-admin-scripts', get_template_directory_uri() . '/admin.js', [ 'jquery' ], '1.0', true );
		wp_enqueue_script( 'benenson-admin-scripts' );
	}
}

add_action( 'admin_enqueue_scripts', 'benenson_theme_options_scripts' );

/**
 * Register all settings with their given sanitizers.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_register_theme_options' ) ) {
	function benenson_register_theme_options() {
		$text_field_args = [
			'sanitize_callback' => 'sanitize_text_field',
			'default'           => '',
		];

		$sidebar_args = [
			'sanitize_callback' => 'benenson_sanitize_sidebar_id',
		];

		register_setting( 'theme_options', '_social_facebook', $text_field_args );
		register_setting( 'theme_options', '_social_twitter', $text_field_args );
		register_setting( 'theme_options', '_social_youtube', $text_field_args );
		register_setting( 'theme_options', '_social_instagram', $text_field_args );

		register_setting( 'theme_options', '_logo', [ 'sanitize_callback', 'benenson_sanitize_attachment_id' ] );
		register_setting( 'theme_options', '_logo_url', $text_field_args );

		register_setting( 'theme_options', '_default_sidebar_page', $sidebar_args );
		register_setting( 'theme_options', '_default_sidebar_archive', $sidebar_args );
		register_setting( 'theme_options', '_default_sidebar', $sidebar_args );

		register_setting( 'theme_options', '_search_disabled', [] );
		register_setting( 'theme_options', '_search_navigation_disabled', [] );

		register_setting( 'theme_options', '_analytics_gtm', $text_field_args );
		register_setting( 'theme_options', '_analytics_ga', $text_field_args );
	}
}

add_action( 'admin_init', 'benenson_register_theme_options' );

/**
 * Sanitizer for sidebar ID's.
 * Checks whether they are numberic and found with sidebar post_type.
 *
 * @since 1.0.0
 * @see benenson_is_post_type
 * @param string|int $value ID to do sanitization.
 * @return string Returns empty string if not numeric or post ID.
 */
if ( ! function_exists( 'benenson_sanitize_sidebar_id' ) ) {
	function benenson_sanitize_sidebar_id( $value ) {
		return benenson_is_post_type( $value, 'sidebar' );
	}
}

/**
 * Sanitizer for attachment ID's.
 * Checks whether they are numberic and found with attachment post_type.
 *
 * @since 1.0.0
 * @see benenson_is_post_type
 * @param string|int $value ID to do sanitization.
 * @return string Returns empty string if not numeric or post ID.
 */
if ( ! function_exists( 'benenson_sanitize_attachment_id' ) ) {
	function benenson_sanitize_attachment_id( $value ) {
		return benenson_is_post_type( $value, 'attachment' );
	}
}

/**
 * Checks whether a given value is numeric and of the provided
 * post type.
 *
 * @since 1.0.0
 * @param string|int $value     ID to check.
 * @param string     $post_type Post type to validate post against.
 * @return string Returns empty string if not numeric or post ID.
 */
if ( ! function_exists( 'benenson_is_post_type' ) ) {
	function benenson_is_post_type( $value, $post_type = 'post' ) {
		if ( ! is_numeric( $value ) ) {
			return '';
		}

		$post = get_post( $value, ARRAY_A );

		if ( isset( $post['post_type'] ) && $post_type === $post['post_type'] ) {
			return $value;
		}

		return '';
	}
}

/**
 * Adds the menu page for the theme settings.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_add_admin_page' ) ) {
	function benenson_add_admin_page() {
		add_theme_page(
			esc_html__( 'Theme Settings', 'benenson' ),
			esc_html__( 'Theme Settings', 'benenson' ),
			'manage_options',
			'theme-settings',
			'benenson_theme_option_admin_page'
		);
	}
}

add_action( 'admin_menu', 'benenson_add_admin_page' );

/**
 * Getter for the theme options.
 *
 * @since 1.0.0
 * @param string $name    The name of the option to retrieve.
 * @param mixed  $default The default to use if option not found or set.
 * @return mixed The found option, or default if none.
 */
if ( ! function_exists( 'benenson_get_option' ) ) {
	function benenson_get_option( $name, $default = false ) {
		$option = get_option( $name, $default );

		/**
		 * Allows for filtering of a benenson theme option.
		 *
		 * @since 1.0.0
		 *
		 * @param mixed  $option  Value of the given option.
		 * @param mixed  $default Default value of the given option.
		 * @param string $name    Name of the given option.
		 */
		$option = apply_filters( "benenson_option_{$name}", $option, $default, $name );

		return $option;
	}
}

/**
 * Creates the admin page view for the theme options.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_theme_option_admin_page' ) ) {
	function benenson_theme_option_admin_page() {
		if ( ! is_admin() ) {
			return;
		}

		$sidebar_post_list = [];

		$sidebar_posts = new \WP_Query( [
			'post_type' => 'sidebar',
			'orderby'   => 'post_title',
			'order'     => 'ASC',
		] );

		$posts = $sidebar_posts->get_posts();

		array_walk( $posts, function( &$item ) use ( &$sidebar_post_list ) {
			$sidebar_post_list[ $item->ID ] = $item->post_title;
		} );
		?>
<div class="wrap">
	<h1><?php esc_html_e( 'Theme Options', 'benenson' ); ?></h1>
	<form method="post" action="options.php">
		<?php settings_fields( 'theme_options' ); ?>

		<h2><?php esc_html_e( 'Social', 'benenson' ); ?></h2>
		<table class="form-table benenson-theme-options-table">
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Facebook', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_social_facebook', '' ); ?>
					<input type="url" name="_social_facebook" value="<?php echo esc_attr( $value ); ?>" placeholder="https://">
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Twitter', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_social_twitter', '' ); ?>
					<input type="url" name="_social_twitter" value="<?php echo esc_attr( $value ); ?>" placeholder="https://">
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'YouTube', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_social_youtube', '' ); ?>
					<input type="url" name="_social_youtube" value="<?php echo esc_attr( $value ); ?>" placeholder="https://">
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Instagram', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_social_instagram', '' ); ?>
					<input type="url" name="_social_instagram" value="<?php echo esc_attr( $value ); ?>" placeholder="https://">
				</td>
			</tr>
		</table>

		<h2><?php esc_html_e( 'Analytics', 'benenson' ); ?></h2>
		<table class="form-table benenson-theme-options-table">
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Google Tag Manager', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_analytics_gtm', '' ); ?>
					<input type="text" name="_analytics_gtm" value="<?php echo esc_textarea( $value ); ?>" placeholder="GTM-XXXX" />
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Google Analytics', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_analytics_ga', '' ); ?>
					<input type="text" name="_analytics_ga" value="<?php echo esc_html( $value ); ?>" placeholder="UA-XXXXX-X">
				</td>
			</tr>
		</table>

		<h2><?php esc_html_e( 'Sidebar', 'benenson' ); ?></h2>
		<table class="form-table benenson-theme-options-table">
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Default Sidebar', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_default_sidebar', 0 ); ?>
					<select name="_default_sidebar">
						<option value="" disabled>Select a Sidebar</option>
						<option value=""></option>
						<?php foreach ( $sidebar_post_list as $post_id => $post ) : ?>
						<option value="<?php echo esc_html( strval( $post_id ) ); ?>" <?php selected( $value, strval( $post_id ), true ); ?>><?php echo esc_html( $post ); ?></option>
						<?php endforeach; ?>
					</select>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Default Page Sidebar', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_default_sidebar_page', 0 ); ?>
					<select name="_default_sidebar_page">
						<option value="" disabled>Select a Sidebar</option>
						<option value=""></option>
						<?php foreach ( $sidebar_post_list as $post_id => $post ) : ?>
						<option value="<?php echo esc_html( strval( $post_id ) ); ?>" <?php selected( $value, strval( $post_id ), true ); ?>><?php echo esc_html( $post ); ?></option>
						<?php endforeach; ?>
					</select>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Default Archive Sidebar', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_default_sidebar_archive', 0 ); ?>
					<select name="_default_sidebar_archive">
						<option value="" disabled>Select a Sidebar</option>
						<option value=""></option>
						<?php foreach ( $sidebar_post_list as $post_id => $post ) : ?>
						<option value="<?php echo esc_html( $post_id ); ?>" <?php selected( $value, esc_html( $post_id ), true ); ?>><?php echo esc_html( $post ); ?></option>
						<?php endforeach; ?>
					</select>
				</td>
			</tr>
		</table>

		<h2><?php esc_html_e( 'Search', 'benenson' ); ?></h2>
		<table class="form-table benenson-theme-options-table">
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Disable All Search', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_search_disabled', false ) ? 'checked' : ''; ?>
					<input type="checkbox" name="_search_disabled" <?php echo esc_attr( $value ); ?> />
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Disable Search in Navigation', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_search_navigation_disabled', false ) ? 'checked' : ''; ?>
					<input type="checkbox" name="_search_navigation_disabled" <?php echo esc_attr( $value ); ?> />
				</td>
			</tr>
		</table>

		<h2><?php esc_html_e( 'Logo', 'benenson' ); ?></h2>
		<table class="form-table benenson-theme-options-table">
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Logo', 'benenson' ); ?></th>
				<td>
					<?php
					$value = benenson_get_option( '_logo', '' );

					if ( is_numeric( $value ) ) :
						$attachment = wp_get_attachment_thumb_url( $value );
					else :
						$attachment = '';
					endif;
					?>
					<div>
						<img id="_logo_image" src="<?php echo esc_url( $attachment ); ?>" />
					</div>
					<div>
						<input id="_logo_input" type="hidden" name="_logo" value="<?php echo esc_html( $value ); ?>" />
						<input id="upload_image_button" type="button" class="button-primary" value="Insert Image" />
					</div>
				</td>
			</tr>
			<tr valign="top">
				<th scope="row"><?php esc_html_e( 'Logo URL', 'benenson' ); ?></th>
				<td>
					<?php $value = benenson_get_option( '_logo_url', '' ); ?>
					<input type="url" name="_logo_url" value="<?php echo esc_attr( $value ); ?>" placeholder="https://">
				</td>
			</tr>
		</table>
		<?php submit_button(); ?>
	</form>
</div>
		<?php
	}
}
