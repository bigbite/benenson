<?php

/**
 * Renders the header block.
 *
 * @since 1.0.0
 * @return string
 */
if ( ! function_exists( 'benenson_render_header_block' ) ) {
	function benenson_render_header_block( array $attributes = [] ) {
		$required = [ 'embed', 'background', 'type', 'imageURL', 'title', 'content', 'ctaText', 'ctaLink' ];
		foreach ( $required as $req ) {
			if ( ! isset( $attributes[ $req ] ) ) {
				$attributes[ $req ] = '';
			}
		}

		if ( ! isset( $attributes['alignment'] ) ) {
			$attributes['alignment'] = 'left';
		}

		$size      = ! empty( $attributes['size'] ) ? $attributes['size'] : '';
		$alignment = ! empty( $attributes['alignment'] ) ? $attributes['alignment'] : '';

		$classlist = [
			'page-hero',
			'headerBlock',
			sprintf( 'page-heroSize--%s', $size ),
			sprintf( 'page-heroAlignment--%s', $alignment ),
		];

		if ( 'video' === $attributes['type'] ) {
			$classlist[] = 'page-hero--video';
		}

		if ( $attributes['background'] ) {
			$classlist[] = sprintf( 'page-heroBackground--%s', $attributes['background'] );
		}

		$banner_identifier = substr( md5( uniqid( wp_rand(), true ) ), 0, 8 );

		spaceless();

		$image_id = ! empty( $attributes['imageID'] ) ? $attributes['imageID'] : false;
		if ( $image_id ) {
			$media_lg = wp_get_attachment_image_url( $image_id, 'hero-lg' );
			$media_md = wp_get_attachment_image_url( $image_id, 'hero-md' );
			$media_sm = wp_get_attachment_image_url( $image_id, 'hero-sm' );

			printf(
				'<style>' .
				' #banner-%s { background-image: url(%s) } ' .
				' @media screen and (min-width: 770px) { ' .
				' #banner-%s { background-image: url(%s) } ' .
				' } ' .
				' @media screen and (min-width: 1444px) { ' .
				' #banner-%s { background-image: url(%s) } ' .
				' } ' .
				' </style>',
				esc_html( $banner_identifier ),
				esc_html( $media_sm ),
				esc_html( $banner_identifier ),
				esc_html( $media_md ),
				esc_html( $banner_identifier ),
				esc_html( $media_lg )
			);
		}

		printf(
			'<section id="banner-%s" class="page-hero %s" role="figure" aria-label="%s">',
			esc_attr( $banner_identifier ),
			esc_attr( implode( ' ', $classlist ) ),
			esc_attr( $attributes['title'] )
		);

		if ( 'video' === $attributes['type'] ) {
			printf(
				'<div class="page-heroVideoContainer"><video class="page-heroVideo" autoplay loop muted><source src="%s"></video></div>',
				esc_url( wp_get_attachment_url( $attributes['featuredVideoId'] ) )
			);
		}

		print '<div class="container"><div class="hero-content">';

		if ( $attributes['title'] ) {
			printf( '<h1 class="page-heroTitle"><span>%s</span></h1>', wp_kses_post( $attributes['title'] ) );
		}

		if ( $attributes['content'] ) {
			printf( '<p class="page-heroContent">%s</p>', wp_kses_post( $attributes['content'] ) );
		}

		if ( $attributes['ctaText'] ) {
			if ( $attributes['ctaLink'] && ! $attributes['embed'] ) {
				printf(
					'<div class="page-heroCta"><a class="btn" href="%s">%s</a></div>',
					esc_url( $attributes['ctaLink'] ),
					esc_html( wp_strip_all_tags( $attributes['ctaText'] ) )
				);
			} elseif ( $attributes['embed'] ) {
				printf(
					'<div class="page-heroCta"><a class="btn" href="%s" data-modal-embed="%s"><i class="play-icon">%s</i>%s</a></div>',
					esc_url( $attributes['ctaLink'] ),
					esc_url( $attributes['embed'] ),
					esc_html__( 'Play video', 'benenson' ),
					esc_html( $attributes['ctaText'] )
				);
			}
		}

		print '</div></div></section>';

		return endspaceless( false );
	}
}
