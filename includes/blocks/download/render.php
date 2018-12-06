<?php

/**
 * Renders the download block.
 *
 * @since 1.0.0
 * @return string
 */
if ( ! function_exists( 'benenson_render_download_block' ) ) {
	function benenson_render_download_block() {
		$file_id = benenson_get_meta_field( 'download_id' ) ?: false;

		if ( ! $file_id ) {
			return;
		}

		$button_text = benenson_get_meta_field( 'download_text' ) ?: __( 'Download Resource', 'benenson' );
		$button_text = trim( preg_replace( '/(?:(?:(?:<|&lt;)br[^>]*?>)+)/', ' ', $button_text ) );
		$file_url    = wp_get_attachment_url( $file_id );
		$file_name   = explode( '/', $file_url );
		$file_name   = array_pop( $file_name );

		ob_start();
		?>
		<div>
			<a class="btn btn--dark btn--download" href="<?php echo esc_url( $file_url ); ?>" target="_blank" download="<?php echo esc_attr( $file_name ); ?>" role="button"><?php echo esc_html( $button_text ); ?></a>
		</div>
		<?php
		return ob_get_clean();
	}
}
