<?php

/**
 * Allow a11y-related attributes in kses.
 *
 * @since 1.0.0
 * @param array $allowed - Array of allowed html and attributes.
 * @return array - Updated array of allowed html.
 */
if ( ! function_exists( 'benenson_kses_accessibility_attrs' ) ) {
	function benenson_kses_accessibility_attrs( $allowed = [] ) {
		$allowed['aside']['aria-labelledby'] = true;
		$allowed['aside']['aria-label']      = true;
		$allowed['aside']['role']            = true;
		$allowed['div']['aria-labelledby']   = true;
		$allowed['div']['aria-label']        = true;
		$allowed['div']['role']              = true;
		$allowed['div']['style']             = true;
		$allowed['span']['aria-label']       = true;
		$allowed['a']['aria-label']          = true;
		$allowed['a']['role']                = true;

		/**
		 * Sets which elements and attributes are allowed by `wp_kses_post()`.
		 *
		 * @since 1.0.0
		 *
		 * @param array $allowed Array of allowed html and attributes.
		 */
		$allowed = apply_filters( 'benenson_kses_allowed_html', $allowed );

		return $allowed;
	}
}

add_filter( 'wp_kses_allowed_html', 'benenson_kses_accessibility_attrs' );

/**
 * Parse post content and add any required a11y attributes to
 * `<table>` html and it's sub-tags.
 *
 * @since 1.0.0
 * @param  string $content The post content.
 * @return string Post content after update.
 */
if ( ! function_exists( 'benenson_add_table_accessibility' ) ) {
	function benenson_add_table_accessibility( $content = '' ) {
		/**
		 * Sets whether accessibility `role` attributes should be
		 * added to tables within post content.
		 *
		 * @since 1.0.0
		 *
		 * @param boolean $apply Whether to attributes should be added.
		 */
		if ( false === apply_filters( 'benenson_add_a11y_to_tables', true ) ) {
			return $content;
		}

		if ( false === strpos( $content, '<table' ) ) {
			return $content;
		}

		/**
		 * Convert any `<td></td>`s in a single-row thead into `<th></th>`s.
		 */
		$content = preg_replace_callback(
			'/(<thead[^>]*?>[^<]*?<tr[^>]*?>)(([^<]*?<td[^>]*?>(?!<\/td>).*?<\/td>[^<]*?)+?)([^<]*?<\/tr>[^<]*?<\/thead>)/',
			function( $matches ) {
				$table_open  = $matches[1];
				$table_tds   = $matches[2];
				$table_close = $matches[4];

				$table_ths = str_replace( 'td', 'th', $table_tds );

				return $table_open . $table_ths . $table_close;
			},
			$content
		);

		$content = preg_replace( '/<table([^>]*?)>/', '<table $1 role="table">', $content );
		$content = preg_replace( '/<tr([^>]*?scope="row"[^>]*?)>/', '<tr $1 role="rowheader">', $content );

		$content = str_replace( '<thead>', '<thead role="rowgroup">', $content );
		$content = str_replace( '<tbody>', '<tbody role="rowgroup">', $content );
		$content = str_replace( '<tfoot>', '<tfoot role="rowgroup">', $content );
		$content = str_replace( '<tr>', '<tr role="row">', $content );
		$content = str_replace( '<th>', '<th role="columnheader">', $content );
		$content = str_replace( '<td>', '<td role="cell">', $content );

		return $content;
	}
}

add_filter( 'the_content', 'benenson_add_table_accessibility' );
