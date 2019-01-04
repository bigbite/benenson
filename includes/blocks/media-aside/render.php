<?php

/**
 * Renders the media aside block.
 *
 * @since 1.0.0
 * @param array $attributes array of attributes from saved block.
 * @return string
 */
if ( ! function_exists( 'benenson_render_media_aside_block' ) ) {
	function benenson_render_media_aside_block( array $attributes = [] ) {

		$required = [ 'title', 'mediaId' ];
		foreach ( $required as $req ) {
			if ( ! isset( $attributes[ $req ] ) ) {
				$attributes[ $req ] = '';
			}
		}

		spaceless();
		?>

		<div class="mediaAside">
			<div class="mediaAside-col">
				<div class="mediaAside-content">

		<?php

		if ( $attributes['title'] ) {
			printf( '<h1 class="mediaAside-title"><span>%s</span></h1>', wp_kses_post( $attributes['title'] ) );
		}

		if ( $attributes['content'] ) {
			printf( '<p class="mediaAside-text">%s </p>', wp_kses_post( $attributes['content'] ) );
		}

		if ( $attributes['ctaLink'] && $attributes['ctaText'] ) {
			printf( '<div><a class="mediaAside-link btn" href="%s">%s</a></div>', esc_url( $attributes['ctaLink'] ), wp_kses_post( $attributes['ctaText'] ) );
		}

		?>

			</div>
		</div>

		<div class="mediaAside-col">

		<?php

		if ( $attributes['mediaId'] && ! empty ( $attributes['embed'] ) ) {
			printf(
				'<div class="mediaAside-image">%s <a class="btn" href="%s" data-modal-embed="%s"><i class="play-icon">%s</i></a></div>',
				wp_get_attachment_image( $attributes['mediaId'], 'full' ),
				esc_url( $attributes['ctaLink'] ),
				esc_url( $attributes['embed'] ),
				esc_html__( 'Play video', 'benenson' )
			);
		} elseif ( $attributes['mediaId'] ) {
			printf(
				'<div class="mediaAside-image">%s</div>',
				wp_get_attachment_image( $attributes['mediaId'], 'full' )
			);
		}

		?>

			</div>
		</div>

		<?php

		return endspaceless( false );
	}
}
