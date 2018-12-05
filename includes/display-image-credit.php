<?php


if ( class_exists( 'Benenson_Display_Image_Credit' ) ) {
	return new Benenson_Display_Image_Credit();
}


class Benenson_Display_Image_Credit {

	public function __construct() {
		add_filter( 'the_content', [ $this, 'filter_tags' ], 99 );
		add_filter( 'the_content', [ $this, 'filter_styles' ], 99 );
	}

	public function filter_tags( $content = '' ) {
		preg_match_all( '/<img\s([^>]+)>/i', $content, $matches );

		if ( empty( $matches[0] ) ) {
			return $content;
		}

		foreach ( $matches[0] as $match ) {
			$content = str_replace( $match, $this->add_tag_description( $match ), $content );
		}

		return $content;
	}

	public function filter_styles( $content = '' ) {
		// 0: full tag, 2: the url
		preg_match_all( '/(<[a-z]+?\s+?.*?background-image:\s*?url\([\'"]?([^\'"]+?)[\'"]?\)[^>]*?>)/i', $content, $matches );

		if ( empty( $matches[0] ) ) {
			return $content;
		}

		foreach ( $matches[0] as $index => $match ) {
			$content = str_replace( $match, $match . $this->add_style_description( $matches[2][ $index ] ), $content );
		}

		return $content;
	}

	protected function add_tag_description( $image = '' ) {
		$attrs = $this->parse( $image );

		if ( empty( $attrs['_image_id'] ) ) {
			return $image;
		}

		$caption = $this::description( $attrs['_image_id'] );

		if ( ! $caption ) {
			return $image;
		}

		$caption = sprintf( '<span class="image-caption" aria-hidden="true">%s</span>', $caption );

		// remove important attributes from image
		$attrs_to_strip = [
			'id',
			'class',
			// anything beyond...
		];

		$stripped_image = $image;

		foreach ( $attrs_to_strip as $attr ) {
			if ( empty( $attrs[ $attr ] ) ) {
				continue;
			}

			$find = [
				// account for both single and double quotes
				sprintf( '%s="%s"', $attr, $attrs[ $attr ] ),
				sprintf( "%s='%s'", $attr, $attrs[ $attr ] ),
			];

			$stripped_image = str_replace( $find, '', $stripped_image );
		}

		// cleanup whitespace
		$stripped_image = preg_replace( '/\s+/', ' ', $stripped_image );

		// create div with extracted attrs + additional classname
		$wrapper_open  = sprintf(
			'<div id="%s" class="%s has-caption">',
			isset( $attrs['id'] ) ? $attrs['id'] : '',
			isset( $attrs['class'] ) ? $attrs['class'] : ''
		);
		$wrapper_close = '</div>';

		// insert stripped image + span with caption
		return $wrapper_open . $stripped_image . $caption . $wrapper_close;
	}

	protected function add_style_description( $image = '' ) {
		$image_id = $this::get_id( basename( $image ) );

		if ( ! $image_id ) {
			return '';
		}

		$caption = $this::description( $image_id );

		if ( ! $caption ) {
			return '';
		}

		return sprintf( '<span class="image-caption" aria-hidden="true">%s</span>', $caption );
	}

	protected function parse( $image = '' ) {
		$valid_attrs = [
			'src',
			'id',
			'class',
			'alt',
			'srcset',
			'sizes',
			'crossorigin',
			'decoding',
			'usemap',
			'ismap',
			'width',
			'height',
			'referrerpolicy',
			'longdesc',
			'data-[a-z]+?',
		];

		$parsed_attrs = [];

		foreach ( $valid_attrs as $attr ) {
			// indices:- 1: attr, 3: value
			preg_match( sprintf( '/\b(%s)=([\'"])([^\2]*?)\2/i', $attr ), $image, $matched );

			if ( empty( $matched[1] ) ) {
				continue;
			}

			$parsed_attrs[ $matched[1] ] = $matched[3];
		}

		if ( empty( $parsed_attrs ) ) {
			return [];
		}

		if ( ! empty( $parsed_attrs['src'] ) ) {
			$parsed_attrs['_image_id'] = $this::get_id( basename( $parsed_attrs['src'] ) );
		}

		return $parsed_attrs;
	}

	public static function get_id( $basename = '' ) {
		global $wpdb;

		$cache_key = sprintf( 'image_id_%s', esc_attr( $basename ) );
		$cached    = wp_cache_get( $cache_key );

		if ( $cached ) {
			return $cached;
		}

		// phpcs:ignore
		$image_id = absint( $wpdb->get_var( $wpdb->prepare(
			"SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value LIKE %s LIMIT 1",
			'_wp_attachment_metadata', "%{$basename}%"
		) ) );

		wp_cache_set( $cache_key, $image_id );

		return $image_id;
	}

	public static function description( $image_id = 0 ) {
		global $wpdb;

		$cache_key = sprintf( 'image_description_%s', $image_id );
		$cached    = wp_cache_get( $cache_key );

		if ( $cached ) {
			return $cached;
		}

		$attachment = get_post( $image_id );

		if ( ! $attachment || 'attachment' !== $attachment->post_type ) {
			return false;
		}

		$description = $attachment->post_content;

		wp_cache_set( $cache_key, $description );

		return $description;
	}

}
