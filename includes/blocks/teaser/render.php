<?php

/**
 * Renders the teaser block.
 *
 * @since 1.0.0
 * @param array $attributes array of attributes from saved block.
 * @return string
 */
if ( ! function_exists( 'benenson_render_teaser_block' ) ) {
	function benenson_render_teaser_block( array $attributes = [] ) {

		$required = [];
		foreach ( $required as $req ) {
			if ( ! isset( $attributes[ $req ] ) ) {
				$attributes[ $req ] = '';
			}
		}

		spaceless();
		?>

		<div class="teaser">
			<div class="teaser-media teaser-col">
			<?php
				if ( $attributes['imageTitle'] ) {
					printf( '<p class="teaser-mediaTitle">%s</p>', wp_kses_post( $attributes['imageTitle'] ) );
				}

				if ( $attributes['imageTitle'] ) {
					printf( '<div class="teaser-image">%s</div>', wp_get_attachment_image( $attributes['imageId'], 'full' ) );
				}
			?>
			</div>
			<div class="teaser-media teaser-col">
				<div class="teaser-content">
					<?php
						if ( $attributes['title'] ) {
							printf( '<h2 class="teaser-title">%s</h2>', wp_kses_post( $attributes['title'] ) );
						}

						if ( $attributes['content'] ) {
							printf( '<div class="teaser-contentBody">%s</div>', wp_kses_post( $attributes['content'] ) );
						}

						if ( $attributes['linkUrl'] && $attributes['linkText'] ) {
							printf( '<a href="%s" class="teaser-link">%s</a>',
							esc_url( $attributes['linkUrl'] ),
							wp_kses_post( $attributes['linkText'] )
							);
						}
					?>
				</div>
			</div>
		</div>

		<?php

		return endspaceless( false );
	}
}
