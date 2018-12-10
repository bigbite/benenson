<?php

/**
 * Get asset/$folder dir URI.
 *
 * @since 1.0.0
 * @example echo asset_uri('images');
 * @param string $folder Folder.
 * @return string
 */
if ( ! function_exists( 'benenson_asset_uri' ) ) {
	function benenson_asset_uri( $folder ) {
		return get_template_directory_uri() . '/assets/' . $folder;
	}
}

/**
 * Load array.reverse polyfill for iOS 12 && OS X 10.14.
 *
 * @since 1.0.0
 * @return void
 */
function array_reverse_polyfill() {
	if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
		return;
	}

	/**
	 * Sets whether JavaScript polyfills should be included and applied.
	 *
	 * @since 1.0.0
	 * @param boolean $apply Whether polyfills should be applied.
	 * @return boolean
	 */
	if ( false === apply_filters( 'benenson_polyfill_js', true ) ) {
		return;
	}

	wp_enqueue_script( 'benenson-array-reverse', get_theme_file_uri( '/array-reverse-polyfill.js' ), [], '1.0.2', false );
}

add_action( 'admin_enqueue_scripts', 'array_reverse_polyfill' );

/**
 * Enqueue styles.
 *
 * @since 1.0.0
 * @example wp_enqueue_style($handle, $src, $deps, $ver, $media);
 * @return void
 */
if ( ! function_exists( 'benenson_styles' ) ) {
	function benenson_styles() {
		wp_enqueue_style( 'global-styles', get_theme_file_uri( '/style.css' ), [], '1.0.2', 'all' );
		wp_enqueue_style( 'google-fonts', 'https://fonts.googleapis.com/css?family=Lato:300,400,700|Playfair+Display:400,600,700,700i,900,900i', [], '1.0.2' );

		if ( is_singular( 'post' ) || ! is_page_template( 'templates/without-sidebar' ) ) {
			wp_enqueue_style( 'print-styles', get_theme_file_uri( '/print.css' ), [], '1.0.2', 'print' );
		}
	}
}

add_action( 'wp_enqueue_scripts', 'benenson_styles' );

if ( ! function_exists( 'benenson_editor_styles' ) ) {
	function benenson_editor_styles() {
		wp_enqueue_style( 'benenson-blocks-css', get_theme_file_uri( '/style-editor.css' ), [], '1.0.2', 'all' );
	}
}

add_action( 'admin_enqueue_scripts', 'benenson_editor_styles' );

/**
 * Enqueue scripts.
 *
 * @since 1.0.0
 * @example wp_enqueue_script($handle, $src, $deps, $ver, $in_footer);
 * @return void
 */
if ( ! function_exists( 'benenson_scripts' ) ) {
	function benenson_scripts() {
		if ( defined( 'ENABLE_LIVERELOAD' ) && ENABLE_LIVERELOAD ) {
			wp_enqueue_script( 'livereload', 'https://livereload.bigbite.site:35729/livereload.js', [], '1.0.2', true );
		}

		wp_enqueue_script( 'global-scripts', get_theme_file_uri( '/bundle.js' ), [], '1.0.2', true );

		if ( is_singular() && comments_open() && get_option( 'thread_comments' ) && true === apply_filters( 'benenson_comments_enabled', false ) ) {
			wp_enqueue_script( 'comment-reply' );
		}

		if ( ! is_home() && ! is_archive() && ! is_search() ) {
			return;
		}

		wp_localize_script( 'global-scripts', 'benenson_data', [
			'archive_base_url' => get_pagenum_link( 1, false ),
		] );
	}
}

add_action( 'wp_enqueue_scripts', 'benenson_scripts' );

/**
 * Load the Gutenberg assets on the WordPress backend.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_gutenberg_assets' ) ) {
	function benenson_gutenberg_assets() {
		wp_enqueue_script( 'benenson-blocks-js', get_theme_file_uri( '/blocks.js' ), [
			'wp-blocks',
			'wp-i18n',
			'wp-element',
			'wp-edit-post',
			'wp-data',
		], true, false );

		if ( function_exists( 'gutenberg_get_jed_locale_data' ) ) {
			// gutenberg plugin
			wp_add_inline_script(
				'benenson-blocks-js',
				sprintf( "wp.i18n.setLocaleData(%s, 'benenson')", wp_json_encode( gutenberg_get_jed_locale_data( 'benenson' ) ) ),
				'before'
			);
		} elseif ( function_exists( 'wp_set_script_translations' ) ) {
			// wp v5
			wp_set_script_translations( 'benenson-blocks-js', 'benenson' );
		}
	}
}

add_action( 'enqueue_block_editor_assets', 'benenson_gutenberg_assets' );

/**
 * Localise any JavaScript for block assets.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_localise_javascript' ) ) {
	function benenson_localise_javascript() {
		if ( ! get_translations_for_domain( 'benenson' ) ) {
			return;
		}

		$data = [
			'openDoubleQuote'  => _x( '“', 'open double quote', 'benenson' ),
			'closeDoubleQuote' => _x( '”', 'close double quote', 'benenson' ),
			'openSingleQuote'  => _x( '‘', 'open single quote', 'benenson' ),
			'closeSingleQuote' => _x( '’', 'close single quote', 'benenson' ),
		];

		wp_localize_script( 'benenson-global-scripts', 'benensonCoreI18n', $data );
		wp_localize_script( 'benenson-blocks-js', 'benensonCoreI18n', $data );
	}
}

add_action( 'enqueue_block_editor_assets', 'benenson_localise_javascript' );
add_action( 'wp_enqueue_scripts', 'benenson_localise_javascript' );
