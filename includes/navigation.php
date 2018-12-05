<?php

/**
 * Outputs a theme logo based on whether, and which
 * site settings have been applied.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_theme_logo' ) ) {
	function benenson_theme_logo() {
		$logo_link = benenson_get_option( '_logo_url' ) ?: home_url();
		$logo_id   = benenson_get_option( '_logo' );
		$blog_name = get_bloginfo( 'name' );

		$logo_srcset = '';

		$logo_alt_text = get_bloginfo( 'name' );

		if ( $logo_id ) {
			list( $logo_standard ) = wp_get_attachment_image_src( $logo_id, 'logotype' );
			list( $logo_retina )   = wp_get_attachment_image_src( $logo_id, 'logotype@2x' );

			if ( $logo_standard !== $logo_retina ) {
				$logo_srcset = sprintf(
					'%s 1x, %s 2x',
					esc_url( $logo_standard ),
					esc_url( $logo_retina )
				);
			}
		} else {
			$logo_standard = get_template_directory_uri() . '/assets/images/os-logo.svg';
		}
		?>
		<a class="logo" href="<?php echo esc_url( $logo_link ); ?>" aria-label="<?php echo esc_attr( __( 'Visit the Benenson home page', 'benenson' ) ); ?>">
			<?php
			printf(
				'<img class="logo-logoType" src="%1$s" srcset="%2$s" alt="%3$s">',
				esc_url( $logo_standard ),
				esc_attr( $logo_srcset ),
				esc_attr( $logo_alt_text )
			);
			?>
		</a>
		<?php
	}
}

/**
 * Check if a nav menu should output.
 *
 * @param string $name The nav to check.
 * @return bool
 */
if ( ! function_exists( 'benenson_nav_should_display' ) ) {
	function benenson_nav_should_display( $name = '' ) {
		$locations = get_nav_menu_locations();
		if ( ! isset( $locations[ $name ] ) ) {
			return false;
		}

		$nav = wp_get_nav_menu_object( $locations[ $name ] );
		if ( false === $nav || ! is_a( $nav, 'WP_Term' ) || 0 === $nav->count ) {
			return false;
		}

		return true;
	}
}

/**
 * Wrapper for wp_nav_mnu with our desired options
 *
 * @param string $name   Desired menu name to show.
 * @param string $walker Custom walker to use.
 * @return void
 */
if ( ! function_exists( 'benenson_nav' ) ) {
	function benenson_nav( $name = 'main-menu', $walker = '' ) {
		if ( ! benenson_nav_should_display( $name ) ) {
			return;
		}

		wp_nav_menu( [
			'theme_location'  => $name,
			'menu'            => '',
			'container'       => false,
			'container_class' => 'menu-{menu slug}-container',
			'container_id'    => '',
			'menu_class'      => 'menu',
			'menu_id'         => '',
			'echo'            => true,
			'fallback_cb'     => 'wp_page_menu',
			'before'          => '',
			'after'           => '',
			'link_before'     => '<span>',
			'link_after'      => '</span>',
			'items_wrap'      => '%3$s',
			'depth'           => 0,
			'walker'          => $walker,
		] );
	}
}

/**
 * Register the theme menus.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_register_menu' ) ) {
	function benenson_register_menu() {
		register_nav_menus( [
			'main-menu'         => __( 'Main Menu', 'benenson' ),
			'footer-navigation' => __( 'Footer Main', 'benenson' ),
			'footer-legal'      => __( 'Footer Legal', 'benenson' ),
		] );
	}
}

add_action( 'init', 'benenson_register_menu' );

/**
 * Adds class attributes to the specified menu.
 *
 * @since 1.0.0
 * @param array  $atts List of element attributes.
 * @param mixed  $item Object containing item details.
 * @param object $menu Object containing config with desired markup of nav item.
 */
if ( ! function_exists( 'benenson_menu_link_attributes' ) ) {
	function benenson_menu_link_attributes( $atts, $item, $menu ) {
		/**
		 * Provides a list of menu IDs have classes applied to within
		 * menu item links.
		 *
		 * @since 1.0.0
		 * @param array $menu_ids List of menu_ids that should have class applied to.
		 */
		$accepted_menu_ids = apply_filters( 'benenson_menu_link_attributes_ids', [
			'category_style_menu',
		] );

		if ( ! isset( $menu->menu_id ) || ! in_array( $menu->menu_id, $accepted_menu_ids, true ) ) {
			return $atts;
		}

		$atts['class'] = 'btn btn--white';

		return $atts;
	}
}

add_filter( 'nav_menu_link_attributes', 'benenson_menu_link_attributes', 100, 3 );

/**
 * Adds class attributes to the specified mobile menu.
 *
 * @since 1.0.0
 * @param array  $atts List of element attributes.
 * @param mixed  $item Object containing item details.
 * @param object $menu Object containing config with desired markup of nav item.
 */
function benenson_mobile_menu_link_attributes( $atts, $item, $menu ) {
	if ( ! isset( $menu->menu->slug ) || ! in_array( $menu->menu->slug, [ 'main-menu', 'site-selector' ], true ) ) {
		return $atts;
	}

	// prevent tabbing on mobile nav - it's enabled via JS on toggle
	$atts['tabindex'] = '-1';

	return $atts;
}

add_filter( 'benenson_mobile_nav_attrs', 'benenson_mobile_menu_link_attributes', 100, 3 );
