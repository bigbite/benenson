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

		$modal     = ! empty( $attributes['modal'] ) ? $attributes['modal'] : false;
		$embed_url = ! empty( $attributes['embed'] ) ? $attributes['embed'] : '';
		$video_url = ! empty( $attributes['videoId'] ) ? wp_get_attachment_url( $attributes['videoId'] ) : $embed_url;

		spaceless();
		?>

		<div class="mediaAside">
			<div class="mediaAside-col">
				<div class="mediaAside-content">

				<?php

				if ( ! empty( $attributes['title'] ) ) {
					printf( '<h2 class="mediaAside-title"><span>%s</span></h2>', wp_kses_post( $attributes['title'] ) );
				}

				if ( ! empty( $attributes['content'] ) ) {
					printf( '<p class="mediaAside-text">%s </p>', wp_kses_post( $attributes['content'] ) );
				}

				if ( ! empty( $attributes['ctaLink'] ) && ! empty( $attributes['ctaText'] ) ) {
					printf( '<div><a class="mediaAside-link btn" href="%s">%s</a></div>', esc_url( $attributes['ctaLink'] ), wp_kses_post( $attributes['ctaText'] ) );
				}

				?>

			</div>
		</div>

		<div class="mediaAside-col">

		<?php
		if ( ! empty( $attributes['mediaId'] ) && ! empty( $video_url ) ) {
			if ( $modal ) {
				printf(
					'<div class="mediaAside-image">%s <a class="btn" data-modal-embed="%s"><i class="play-icon">%s</i></a></div>',
					wp_get_attachment_image( $attributes['mediaId'], 'full' ),
					esc_url( $video_url ),
					esc_html__( 'Play video', 'benenson' )
				);
			} else {
				printf(
					'<div><div class="inlineVideo mediaAside-videoContainer"><div class="inlineVideo-poster" style="background-image:url(%s);"></div><a class="btn" data-inline-embed="%s"><i class="play-icon">%s</i></a></div></div>',
					esc_url( wp_get_attachment_url( $attributes['mediaId'] ) ),
					esc_url( $video_url ),
					esc_html__( 'Play video', 'benenson' )
				);
			}
		} elseif ( ! empty( $attributes['mediaId'] ) ) {
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
