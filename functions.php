<?php

require_once realpath( get_template_directory() . '/includes/bugsnag.php' );
require_once realpath( get_template_directory() . '/includes/theme-setup.php' );
require_once realpath( get_template_directory() . '/includes/theme-supports.php' );
require_once realpath( get_template_directory() . '/includes/compatibility.php' );
require_once realpath( get_template_directory() . '/includes/accessibility.php' );
require_once realpath( get_template_directory() . '/includes/analytics-output.php' );
require_once realpath( get_template_directory() . '/includes/disable-emoji-support.php' );
require_once realpath( get_template_directory() . '/includes/disable-rest-api.php' );
require_once realpath( get_template_directory() . '/includes/display-image-credit.php' );
require_once realpath( get_template_directory() . '/includes/localisation.php' );
require_once realpath( get_template_directory() . '/includes/media.php' );
require_once realpath( get_template_directory() . '/includes/meta.php' );
require_once realpath( get_template_directory() . '/includes/mobile-nav-walker.php' );
require_once realpath( get_template_directory() . '/includes/navigation.php' );
require_once realpath( get_template_directory() . '/includes/pagination.php' );
require_once realpath( get_template_directory() . '/includes/post-filters.php' );
require_once realpath( get_template_directory() . '/includes/remove-hero-meta-on-removal.php' );
require_once realpath( get_template_directory() . '/includes/render-header-on-single.php' );
require_once realpath( get_template_directory() . '/includes/scripts-and-styles.php' );
require_once realpath( get_template_directory() . '/includes/search-actions.php' );
require_once realpath( get_template_directory() . '/includes/single-helpers.php' );
require_once realpath( get_template_directory() . '/includes/string-manipulation-helpers.php' );
require_once realpath( get_template_directory() . '/includes/taxonomies.php' );
require_once realpath( get_template_directory() . '/includes/text-domain.php' );
require_once realpath( get_template_directory() . '/includes/theme-options.php' );
require_once realpath( get_template_directory() . '/includes/theme-supports.php' );
require_once realpath( get_template_directory() . '/includes/post-types/sidebar.php' );
require_once realpath( get_template_directory() . '/includes/post-content.php' );
require_once realpath( get_template_directory() . '/includes/blocks/block-category.php' );
require_once realpath( get_template_directory() . '/includes/blocks/meta.php' );
require_once realpath( get_template_directory() . '/includes/blocks/register.php' );
require_once realpath( get_template_directory() . '/includes/blocks/templates.php' );
require_once realpath( get_template_directory() . '/includes/rest-api/category-list.php' );
require_once realpath( get_template_directory() . '/includes/rest-api/fetch-menu.php' );

add_action( 'init', function () {
	remove_filter( 'content_save_pre', 'wp_filter_post_kses' );
	remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
} );
