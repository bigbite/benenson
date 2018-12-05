<?php

/**
 * Register sidebar post-type.
 */
if ( ! function_exists( 'benenson_create_sidebar_posttype' ) ) {
	function benenson_create_sidebar_posttype() {
		$labels = [
			'name'                  => _x( 'Sidebars', 'Post Type General Name', 'benenson' ),
			'singular_name'         => _x( 'Sidebar', 'Post Type Singular Name', 'benenson' ),
			'menu_name'             => __( 'Sidebars', 'benenson' ),
			'name_admin_bar'        => __( 'Sidebar', 'benenson' ),
			'archives'              => __( 'Sidebar Archives', 'benenson' ),
			'attributes'            => __( 'Sidebar Attributes', 'benenson' ),
			'parent_item_colon'     => __( 'Parent Sidebar:', 'benenson' ),
			'all_items'             => __( 'All Sidebars', 'benenson' ),
			'add_new_item'          => __( 'Add New Sidebar', 'benenson' ),
			'add_new'               => __( 'Add New', 'benenson' ),
			'new_item'              => __( 'New Sidebar', 'benenson' ),
			'edit_item'             => __( 'Edit Sidebar', 'benenson' ),
			'update_item'           => __( 'Update Sidebar', 'benenson' ),
			'view_item'             => __( 'View Sidebar', 'benenson' ),
			'view_items'            => __( 'View Sidebars', 'benenson' ),
			'search_items'          => __( 'Search Sidebar', 'benenson' ),
			'not_found'             => __( 'Not Found', 'benenson' ),
			'not_found_in_trash'    => __( 'Not Found in Trash', 'benenson' ),
			'featured_image'        => __( 'Featured Image', 'benenson' ),
			'set_featured_image'    => __( 'Set featured image', 'benenson' ),
			'remove_featured_image' => __( 'Remove featured image', 'benenson' ),
			'use_featured_image'    => __( 'Use as featured image', 'benenson' ),
			'insert_into_item'      => __( 'Insert into sidebar', 'benenson' ),
			'uploaded_to_this_item' => __( 'Uploaded to this item', 'benenson' ),
			'items_list'            => __( 'Sidebars list', 'benenson' ),
			'items_list_navigation' => __( 'Sidebars list navigation', 'benenson' ),
			'filter_items_list'     => __( 'Filter sidebar list', 'benenson' ),
		];

		$args = [
			'label'               => __( 'Sidebar', 'benenson' ),
			'description'         => __( 'Sidebar post type', 'benenson' ),
			'labels'              => $labels,
			'supports'            => [ 'title', 'editor', 'revisions' ],
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 5,
			'menu_icon'           => 'dashicons-welcome-widgets-menus',
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => false,
			'capability_type'     => 'page',
			'show_in_rest'        => true,
		];

		register_post_type( 'sidebar', $args );
	}
}

add_action( 'init', 'benenson_create_sidebar_posttype', 0 );
