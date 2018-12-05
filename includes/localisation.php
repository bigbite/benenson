<?php

// Register translatable strings
_x( 'ltr', 'text direction', 'benenson' );
_x( 'January', 'month name', 'benenson' );
_x( 'February', 'month name', 'benenson' );
_x( 'March', 'month name', 'benenson' );
_x( 'April', 'month name', 'benenson' );
_x( 'May', 'month name', 'benenson' );
_x( 'June', 'month name', 'benenson' );
_x( 'July', 'month name', 'benenson' );
_x( 'August', 'month name', 'benenson' );
_x( 'September', 'month name', 'benenson' );
_x( 'October', 'month name', 'benenson' );
_x( 'November', 'month name', 'benenson' );
_x( 'December', 'month name', 'benenson' );

/**
 * Add text direction to body class.
 * Class list is a string in the admin panel,
 * but an array in the front-end.
 *
 * @since 1.0.0
 * @param string|array $classes Existing body classes.
 * @return string|array
 */
if ( ! function_exists( 'benenson_body_class_text_direction' ) ) {
	function benenson_body_class_text_direction( $classes = null ) {
		if ( is_rtl() ) {
			return $classes;
		}

		if ( is_admin() ) {
			$classes .= ' ltr';
		} else {
			$classes[] = 'ltr';
		}

		return $classes;
	}
}

add_filter( 'body_class', 'benenson_body_class_text_direction' );
add_filter( 'admin_body_class', 'benenson_body_class_text_direction' );

/**
 * Convert an epoch timestamp to a locale-aware datetime format.
 *
 * @since 1.0.0
 * @param string $epoch The epoch timestamp to convert.
 * @return string
 */
if ( ! function_exists( 'benenson_locale_datetime' ) ) {
	function benenson_locale_datetime( $epoch = '' ) {
		global $l10n;

		if ( ! isset( $l10n['benenson'] ) ) {
			return date( 'd F Y, H:i T', $epoch );
		}

		$month  = date( 'F', $epoch );
		$lmonth = $l10n['benenson']->translate( $month, 'month name' );

		$date = date( 'd ~ Y, H:i T', $epoch );
		if ( is_rtl() ) {
			$date = '&#8235;' . date( 'd ~ Y T H:i', $epoch );
		}

		$date = str_replace( '~', '%s', $date );
		$date = sprintf( $date, $lmonth );

		return $date;
	}
}

/**
 * Convert an epoch timestamp to a locale-aware date format.
 *
 * @since 1.0.0
 * @param string $epoch The epoch timestamp to convert.
 * @return string
 */
if ( ! function_exists( 'benenson_locale_date' ) ) {
	function benenson_locale_date( $epoch = '' ) {
		global $l10n;

		if ( ! isset( $l10n['benenson'] ) ) {
			return date( 'd F Y', $epoch );
		}

		$month  = date( 'F', $epoch );
		$lmonth = $l10n['benenson']->translate( $month, 'month name' );

		$date = date( 'd ~ Y', $epoch );
		if ( is_rtl() ) {
			$date = '&#8235;' . date( 'd ~ Y', $epoch );
		}

		$date = str_replace( '~', '%s', $date );
		$date = sprintf( $date, $lmonth );

		return $date;
	}
}
