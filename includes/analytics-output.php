<?php

/**
 * Adds an async attribute to specified scripts provided by
 * `wp_enqueue`.
 * Additions for scripts with async can be added using
 * the `benenson_add_async_handlers` filter hook.
 *
 * @since 1.0.0
 * @param string $tag    `<script src=...` tag from wp_enqueue.
 * @param string $handle Handle of the current enqueued script being used.
 * @return string
 */
if ( ! function_exists( 'benenson_add_script_async' ) ) {
	function benenson_add_script_async( $tag, $handle ) {
		/**
		 * Only adds async to scripts with one of the following script
		 * handle names as defined by their wp_enqueue/register_script
		 * handler.
		 *
		 * @since 1.0.0
		 *
		 * @param array $handlers List of handlers to add `async`.
		 */
		$allowed_handles = apply_filters( 'benenson_add_async_handlers', [
			'analytics-ga-script',
		] );

		if ( ! in_array( $handle, $allowed_handles, true ) ) {
			return $tag;
		}

		return str_replace( ' src', ' async src', $tag );
	}
}

add_filter( 'script_loader_tag', 'benenson_add_script_async', 10, 2 );

/**
 * Enqueues Google Analytics script.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_enqueue_ga' ) ) {
	function benenson_enqueue_ga() {
		$google_analytics = benenson_get_option( '_analytics_ga', 'test' );

		if ( ! empty( $google_analytics ) ) {
			wp_enqueue_script( 'analytics-ga-script', "https://www.googletagmanager.com/gtag/js?id={$google_analytics}", [], '1.0.0', false );
		}
	}
}

add_action( 'wp_enqueue_scripts', 'benenson_enqueue_ga' );

/**
 * Adds scripts to `<head>` via `wp_head()` for
 * Google Analytics and Google Tag Manager.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_add_wp_head_scripts' ) ) {
	function benenson_add_wp_head_scripts() {
		$google_tag_manager = benenson_get_option( '_analytics_gtm' );
		$google_analytics   = benenson_get_option( '_analytics_ga' );

		if ( ! empty( $google_tag_manager ) ) :
			?>
			<!-- Google Tag Manager -->
			<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
			new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
			j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
			'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
			})(window,document,'script','dataLayer','<?php echo esc_html( $google_tag_manager ); ?>');</script>
			<!-- End Google Tag Manager -->
			<?php
		endif;

		if ( ! empty( $google_analytics ) ) :
			?>
			<script>
				window.dataLayer = window.dataLayer || [];
				function gtag() {
					dataLayer.push(arguments);
				};

				gtag('js', new Date());
				gtag('config', '<?php echo esc_attr( $google_analytics ); ?>');
			</script>
			<?php
		endif;
	}
}

add_action( 'wp_head', 'benenson_add_wp_head_scripts' );

/**
 * Adds fallback for Google Analytics to the `<body>`.
 *
 * @since 1.0.0
 * @return void
 */
if ( ! function_exists( 'benenson_analytics_fallback' ) ) {
	function benenson_analytics_fallback() {
		$google_tag_manager = benenson_get_option( '_analytics_gtm' );

		if ( ! empty( $google_tag_manager ) ) :
			?>
			<!-- Google Tag Manager (noscript) -->
			<noscript>
				<iframe src="https://www.googletagmanager.com/ns.html?id=<?php echo esc_html( $google_tag_manager ); ?>" height="0" width="0" style="display:none;visibility:hidden"></iframe>
			</noscript>
			<!-- End Google Tag Manager (noscript) -->
			<?php
		endif;
	}
}

add_action( 'benenson_after_body_open_tag', 'benenson_analytics_fallback' );
