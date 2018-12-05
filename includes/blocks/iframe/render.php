<?php

/**
 * Renders the iframe block.
 *
 * @since 1.0.0
 * @return string
 */
if ( ! function_exists( 'benenson_render_iframe_block' ) ) {
	function benenson_render_iframe_block( $atts = [] ) {
		$embed_url = ! empty( $atts['embedUrl'] ) ? $atts['embedUrl'] : false;

		if ( ! $embed_url ) {
			return;
		}

		$width      = ! empty( $atts['width'] ) ? $atts['width'] : false;
		$height     = ! empty( $atts['height'] ) ? $atts['height'] : false;
		$min_height = ! empty( $atts['minHeight'] ) ? $atts['minHeight'] : 400;

		$style = '';

		if ( $width && $height ) {
			$ratio  = $height / $width * 100;
			$ratio  = "{$ratio}%";
			$style .= sprintf( 'padding-top: %s;', $ratio );
		}

		if ( $min_height ) {
			$style .= sprintf( 'min-height: %dpx;', $min_height );
		}

		ob_start();
		?>
		<figure class="responsive-iframe wp-block-embed" <?php $width && printf( 'style="%s"', esc_attr( sprintf( 'max-width:%spx', $width ) ) ); ?>>
			<div class="fluid-iframe" <?php $style && printf( 'style="%s"', esc_attr( $style ) ); ?>>
				<iframe src="<?php echo esc_url( $embed_url ); ?>" frameborder="0"></iframe>
			</div>

			<?php if ( ! empty( $atts['caption'] ) ) : ?>
			<figcaption>
				<p><?php echo esc_html( $atts['caption'] ); ?></p>
			</figcaption>
		<?php endif; ?>
		</figure>
		<?php
		return ob_get_clean();
	}
}
