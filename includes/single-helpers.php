<?php

/**
 * Retrieves recipient list for the letter block.
 *
 * @since 1.0.0
 * @return array
 */
if ( ! function_exists( 'get_letter_recipients' ) ) {
	function get_letter_recipients() {
		$is_refreshed = '1' === benenson_get_meta_field( 'recipients_refreshed' );

		if ( $is_refreshed ) {
			$recipients = benenson_get_meta_field( 'recipients_refresh' );
			$recipients = str_replace( '<-->', '', $recipients );
			$recipients = json_decode( $recipients, true );
		} else {
			$recipients = benenson_get_meta_field( 'recipients' );

			if ( is_string( $recipients ) ) {
				$recipients = str_replace( '"""', '', $recipients );
				$recipients = json_decode( $recipients );
			}

			if ( is_array( $recipients ) ) {
				$recipients = array_map( function( $item ) {
					if ( empty( $item ) ) {
						return [];
					}

					return [
						'name'     => '',
						'jobTitle' => $item,
					];
				}, $recipients );
			}
		}

		if ( ! is_array( $recipients ) ) {
			return [];
		}

		$recipients = array_filter( $recipients, function( $item ) {
			return ! empty( $item['jobTitle'] ) && '&nbsp;' !== $item['jobTitle'];
		} );

		return array_values( $recipients );
	}
}

/**
 * Displays a recipient for the letter block.
 *
 * @since 1.0.0
 * @param array $recipient the recipient to display.
 * @return void
 */
if ( ! function_exists( 'display_letter_recipient' ) ) {
	function display_letter_recipient( array $recipient = [] ) {
		if ( $recipient['name'] && $recipient['jobTitle'] ) {
			printf( '<p><strong>%s</strong>%s %s</p>', esc_html( $recipient['name'] ), ',', esc_html( $recipient['jobTitle'] ) );
			return;
		}

		if ( $recipient['name'] ) {
			printf( '<p><strong>%s</strong></p>', esc_html( $recipient['name'] ) );
			return;
		}

		if ( $recipient['jobTitle'] ) {
			printf( '<p>%s</p>', esc_html( $recipient['jobTitle'] ) );
			return;
		}
	}
}
