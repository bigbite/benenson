<?php

/**
 * On theme setup, check whether sidebars exists.
 * Create and apply them if they do not.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_setup_default_sidebars' ) ) {
	function benenson_setup_default_sidebars() {
		if ( ! is_admin() ) {
			return;
		}

		$sidebar_posts = new \WP_Query( [
			'post_type' => 'sidebar',
			'orderby'   => 'post_title',
			'order'     => 'ASC',
		] );

		if ( $sidebar_posts->post_count >= 1 ) {
			return;
		}

		$default_blocks = '<!-- wp:benenson/block-category-list /-->';

		$sidebar_id = wp_insert_post( [
			'post_title'   => 'Default Sidebar',
			'post_content' => $default_blocks,
			'post_status'  => 'publish',
			'post_type'    => 'sidebar',
		], true );

		if ( ! is_wp_error( $sidebar_id ) ) {
			update_option( '_default_sidebar', $sidebar_id );
			update_option( '_default_sidebar_archive', $sidebar_id );
			update_option( '_default_sidebar_page', $sidebar_id );
		}
	}
}

add_action( 'after_switch_theme', 'benenson_setup_default_sidebars' );

/**
 * On theme setup, check whether menu exists.
 * Assign menu to location if it exsists.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_create_navs' ) ) {
	function benenson_create_navs() {
		if ( ! is_admin() ) {
			return;
		}

		// Check if the menu exists
		$menu_name   = 'Main Menu';
		$menu_exists = wp_get_nav_menu_object( $menu_name );

		// If it doesn't exist, let's create it.
		if ( ! $menu_exists ) {
			$menu_id   = wp_create_nav_menu( $menu_name );
			$locations = get_theme_mod( 'nav_menu_locations' );

			$locations['main-menu'] = $menu_id;
			set_theme_mod ( 'nav_menu_locations', $locations );
		}

		// Check if the menu exists
		$menu_name   = 'Footer Menu';
		$menu_exists = wp_get_nav_menu_object( $menu_name );

		// If it doesn't exist, let's create it.
		if ( ! $menu_exists ) {
			$menu_id   = wp_create_nav_menu( $menu_name );
			$locations = get_theme_mod( 'nav_menu_locations' );

			$locations['footer-navigation'] = $menu_id;

			set_theme_mod ( 'nav_menu_locations', $locations );
		}
	}
}

add_action( 'after_switch_theme', 'benenson_create_navs' );
