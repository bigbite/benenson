<?php

if ( ! function_exists( 'benenson_customiser' ) ) {
	function benenson_customiser( $customiser = null ) {
		/**
		 * Social network settings.
		 */
		$customiser->add_section( 'benenson_social_networks', [
			'title'       => __( 'Social Networks', 'benenson' ),
			'description' => __( 'Manage your social network accounts', 'benenson' ),
			'priority'    => 30,
			'capability'  => 'edit_theme_options',
		] );

		$customiser->add_setting( '_social_facebook', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_social_facebook', '', true ),
			'sanitize_callback' => 'sanitize_url',
		] );

		$customiser->add_control( '_social_facebook', [
			'label'    => __( 'Facebook', 'benenson' ),
			'section'  => 'benenson_social_networks',
			'type'     => 'url',
			'priority' => 10,
		] );

		$customiser->add_setting( '_social_twitter', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_social_twitter', '', true ),
			'sanitize_callback' => 'sanitize_url',
		] );

		$customiser->add_control( '_social_twitter', [
			'label'    => __( 'Twitter', 'benenson' ),
			'section'  => 'benenson_social_networks',
			'type'     => 'url',
			'priority' => 10,
		] );

		$customiser->add_setting( '_social_youtube', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_social_youtube', '', true ),
			'sanitize_callback' => 'sanitize_url',
		] );

		$customiser->add_control( '_social_youtube', [
			'label'    => __( 'YouTube', 'benenson' ),
			'section'  => 'benenson_social_networks',
			'type'     => 'url',
			'priority' => 10,
		] );

		$customiser->add_setting( '_social_instagram', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_social_instagram', '', true ),
			'sanitize_callback' => 'sanitize_url',
		] );

		$customiser->add_control( '_social_instagram', [
			'label'    => __( 'Instagram', 'benenson' ),
			'section'  => 'benenson_social_networks',
			'type'     => 'url',
			'priority' => 10,
		] );

		/**
		 * Site logo settings.
		 */
		$customiser->add_setting( '_logo', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_logo', '', true ),
			'sanitize_callback' => 'sanitize_url',
		] );

		$customiser->add_control( new WP_Customize_Image_Control( $customiser, '_logo', [
			'label'    => __( 'Site Logo', 'benenson' ),
			'section'  => 'title_tagline',
			'priority' => 100,
		] ) );

		$customiser->add_setting( '_logo_url', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_logo_url', '', true ),
			'sanitize_callback' => 'sanitize_url',
		] );

		$customiser->add_control( '_logo_url', [
			'label'    => __( 'Site Logo URL', 'benenson' ),
			'section'  => 'title_tagline',
			'type'     => 'url',
			'default'  => home_url(),
			'priority' => 100,
		] );

		/**
		 * Sidebar settings.
		 */
		$customiser->add_section( 'benenson_sidebars', [
			'title'       => __( 'Sidebars', 'benenson' ),
			'description' => __( 'Manage your sidebar settings', 'benenson' ),
			'priority'    => 35,
			'capability'  => 'edit_theme_options',
		] );

		$sidebar_post_list = [];
		$sidebar_posts     = new WP_Query( [
			'post_type' => 'sidebar',
			'orderby'   => 'post_title',
			'order'     => 'ASC',
		] );

		$posts = $sidebar_posts->get_posts();

		array_walk( $posts, function( &$item ) use ( &$sidebar_post_list ) {
			$sidebar_post_list[ $item->ID ] = $item->post_title;
		} );

		$customiser->add_setting( '_default_sidebar_page', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_default_sidebar_page', '', true ),
			'sanitize_callback' => 'benenson_sanitize_sidebar_id',
		] );

		$customiser->add_control( '_default_sidebar_page', [
			'label'    => __( 'Default Page Sidebar', 'benenson' ),
			'section'  => 'benenson_sidebars',
			'type'     => 'select',
			'priority' => 100,
			'choices'  => $sidebar_post_list,
		] );

		$customiser->add_setting( '_default_sidebar_archive', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_default_sidebar_archive', '', true ),
			'sanitize_callback' => 'benenson_sanitize_sidebar_id',
		] );

		$customiser->add_control( '_default_sidebar_archive', [
			'label'    => __( 'Default Archive Sidebar', 'benenson' ),
			'section'  => 'benenson_sidebars',
			'type'     => 'select',
			'priority' => 100,
			'choices'  => $sidebar_post_list,
		] );

		$customiser->add_setting( '_default_sidebar', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_default_sidebar', '', true ),
			'sanitize_callback' => 'benenson_sanitize_sidebar_id',
		] );

		$customiser->add_control( '_default_sidebar', [
			'label'    => __( 'Default Sidebar', 'benenson' ),
			'section'  => 'benenson_sidebars',
			'type'     => 'select',
			'priority' => 100,
			'choices'  => $sidebar_post_list,
		] );

		/**
		 * Search settings.
		 */
		$customiser->add_section( 'benenson_search', [
			'title'       => __( 'Search', 'benenson' ),
			'description' => __( 'Manage your search settings', 'benenson' ),
			'priority'    => 60,
			'capability'  => 'edit_theme_options',
		] );

		$customiser->add_setting( '_search_disabled', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_search_disabled', '', true ),
			'sanitize_callback' => 'benenson_sanitize_boolean',
		] );

		$customiser->add_control( '_search_disabled', [
			'label'   => __( 'Disable all search', 'benenson' ),
			'section' => 'benenson_search',
			'type'    => 'checkbox',
		] );

		$customiser->add_setting( '_search_navigation_disabled', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_search_navigation_disabled', '', true ),
			'sanitize_callback' => 'benenson_sanitize_boolean',
		] );

		$customiser->add_control( '_search_navigation_disabled', [
			'label'   => __( 'Disable Search in Navigation', 'benenson' ),
			'section' => 'benenson_search',
			'type'    => 'checkbox',
		] );

		/**
		 * Analytics settings.
		 */
		$customiser->add_section( 'benenson_analytics', [
			'title'       => __( 'Analytics', 'benenson' ),
			'description' => __( 'Manage your Analytics settings', 'benenson' ),
			'priority'    => 20,
			'capability'  => 'edit_theme_options',
		] );

		$customiser->add_setting( '_analytics_gtm', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_analytics_gtm', '', true ),
			'sanitize_callback' => 'sanitize_text_field',
		] );

		$customiser->add_control( '_analytics_gtm', [
			'label'    => __( 'Google Tag Manager', 'benenson' ),
			'section'  => 'benenson_analytics',
			'type'     => 'text',
			'priority' => 10,
		] );

		$customiser->add_setting( '_analytics_ga', [
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'default'           => benenson_get_option( '_analytics_ga', '', true ),
			'sanitize_callback' => 'sanitize_text_field',
		] );

		$customiser->add_control( '_analytics_ga', [
			'label'    => __( 'Google Analytics', 'benenson' ),
			'section'  => 'benenson_analytics',
			'type'     => 'text',
			'priority' => 10,
		] );
	}
}

add_action( 'customize_register', 'benenson_customiser' );


/**
 * Retrieve a theme modification by overriding return value of benenson_get_option.
 *
 * @since 1.0.3
 * @see benenson_get_option()
 *
 * @param mixed  $value   the return value from benenson_get_option
 * @param mixed  $default the default value from benenson_get_option
 * @param string $name    the option name
 *
 * @return mixed
 *
 */
if ( ! function_exists( 'benenson_override_get_option' ) ) {
	function benenson_override_get_option( $value, $default, $name ) {
		return get_theme_mod( $name ) ?: $value;
	}
}

add_filter( 'benenson_option__social_facebook', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__social_twitter', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__social_googleplus', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__social_youtube', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__social_instagram', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__logo', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__logo_url', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__default_sidebar_page', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__default_sidebar_archive', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__default_sidebar', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__search_disabled', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__search_navigation_disabled', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__analytics_gtm', 'benenson_override_get_option', 10, 3 );
add_filter( 'benenson_option__analytics_ga', 'benenson_override_get_option', 10, 3 );

/**
 * Registers and enqueues scripts for the theme admin.
 *
 * @since 1.0.0
 * @deprecated 1.0.3
 * @return void
 */
if ( ! function_exists( 'benenson_theme_options_scripts' ) ) {
	function benenson_theme_options_scripts() {
		_deprecated_function( __FUNCTION__, '1.0.3' );

		if ( ! is_admin() || 'appearance_page_theme-settings' !== get_current_screen()->id ) {
			return;
		}

		wp_enqueue_media();
		wp_register_script( 'benenson-admin-scripts', get_template_directory_uri() . '/admin.js', [ 'jquery' ], '1.0', true );
		wp_enqueue_script( 'benenson-admin-scripts' );
	}
}

/**
 * Register all settings with their given sanitizers.
 *
 * @since 1.0.0
 * @deprecated 1.0.3
 * @see benenson_customiser()
 * @return void
 */
if ( ! function_exists( 'benenson_register_theme_options' ) ) {
	function benenson_register_theme_options() {
		_deprecated_function( __FUNCTION__, '1.0.3', 'benenson_customiser' );

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

		register_setting( 'theme_options', '_logo', [ 'sanitize_callback' => 'benenson_sanitize_attachment_id' ] );
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
 * Explicitly cast a value to a boolean.
 *
 * @since 1.0.3
 *
 * @param mixed $value the value to cast.
 *
 * @return bool
 */
if ( ! function_exists( 'benenson_sanitize_boolean' ) ) {
	function benenson_sanitize_boolean( $value ) {
		// nothing required.
		if ( is_bool( $value ) ) {
			return $value;
		}

		// assume 0 or 1.
		if ( is_numeric( $value ) ) {
			return (bool) $value;
		}

		// truthy values.
		if ( in_array( $value, [ 'true', '1', 'yes', 'on' ], true ) ) {
			return true;
		}

		// falsey values.
		if ( in_array( $value, [ 'false', '0', 'no', 'off' ], true ) ) {
			return false;
		}

		// assume invalid.
		return false;
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
 *
 * @return void
 */
if ( ! function_exists( 'benenson_add_admin_page' ) ) {
	function benenson_add_admin_page() {
		add_theme_page(
			esc_html__( 'Theme Settings', 'benenson' ),
			esc_html__( 'Theme Settings', 'benenson' ),
			'manage_options',
			'theme-settings',
			function () {
				$return_to    = rawurlencode( admin_url( 'themes.php', 'relative' ) );
				$new_location = add_query_arg( 'return', $return_to, admin_url( 'customize.php' ) );

				// just in case.
				if ( ! headers_sent() ) {
					header( 'Location: %s', esc_url( $new_location ) );
				} else {
					printf( '<script>window.location="%s";</script>', esc_url( $new_location ) );
				}

				exit;
			}
		);
	}
}

add_action( 'admin_menu', 'benenson_add_admin_page' );

/**
 * Getter for the theme options.
 *
 * @since 1.0.0
 *
 * @param string $name    The name of the option to retrieve.
 * @param mixed  $default The default to use if option not found or set.
 * @param bool   $suppress_filters Whether to suppress the option filter.
 *
 * @return mixed The found option, or default if none.
 */
if ( ! function_exists( 'benenson_get_option' ) ) {
	function benenson_get_option( $name, $default = false, $suppress_filters = false ) {
		$option = get_option( $name, $default );

		if ( false === $suppress_filters ) {
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
		}

		return $option;
	}
}

/**
 * Creates the admin page view for the theme options.
 *
 * @since 1.0.0
 * @deprecated 1.0.3
 * @return void
 */
if ( ! function_exists( 'benenson_theme_option_admin_page' ) ) {
	function benenson_theme_option_admin_page() {
		_deprecated_function( __FUNCTION__, '1.0.3' );

		if ( ! is_admin() ) {
			return;
		}

		$sidebar_post_list = [];

		$sidebar_posts = new \WP_Query( [
			'post_type' => 'sidebar',
			'orderby'   => 'post_title',
			'order'     => 'ASC',
		] );

		array_walk( $sidebar_posts->posts, function( &$item ) use ( &$sidebar_post_list ) {
			$sidebar_post_list[ $item->ID ] = $item->post_title;
		} );

		$sidebar_post_list = apply_filters( 'benenson_settings_sidebar_post_list', $sidebar_post_list );
		?>
<div class="wrap">
	<h1><?php esc_html_e( 'Theme Options', 'benenson' ); ?></h1>

		<?php
		/**
		 * Fires before the settings form opening tag.
		 */
		do_action( 'benenson_settings_before_form' );
		?>

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
			<?php
			/**
			 * Fires at the end of the table wrapper for social settings.
			 */
			do_action( 'benenson_settings_social' );
			?>
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
					<input type="text" name="_analytics_ga" value="<?php echo esc_attr( $value ); ?>" placeholder="UA-XXXXX-X">
				</td>
			</tr>
			<?php
			/**
			 * Fires at the end of the table wrapper for analytics settings.
			 */
			do_action( 'benenson_settings_analytics' );
			?>
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
						<option value="<?php echo esc_attr( strval( $post_id ) ); ?>" <?php selected( $value, strval( $post_id ), true ); ?>><?php echo esc_html( $post ); ?></option>
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
						<option value="<?php echo esc_attr( strval( $post_id ) ); ?>" <?php selected( $value, strval( $post_id ), true ); ?>><?php echo esc_html( $post ); ?></option>
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
						<option value="<?php echo esc_attr( $post_id ); ?>" <?php selected( $value, esc_html( $post_id ), true ); ?>><?php echo esc_html( $post ); ?></option>
						<?php endforeach; ?>
					</select>
				</td>
			</tr>
			<?php
			/**
			 * Fires at the end of the table wrapper for sidebar settings.
			 */
			do_action( 'benenson_settings_sidebar' );
			?>
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
			<?php
			/**
			 * Fires at the end of the table wrapper for search settings
			 */
			do_action( 'benenson_settings_search' );
			?>
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
						<input id="_logo_input" type="hidden" name="_logo" value="<?php echo esc_attr( $value ); ?>" />
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
			<?php
			/**
			 * Fires at the end of the table wrapper for logo settings.
			 */
			do_action( 'benenson_settings_logo' );
			?>
		</table>
		<?php submit_button(); ?>
	</form>
</div>
		<?php
	}
}
