<?php

/**
 * Renders the stock price block.
 *
 * @since 1.0.0
 * @return string
 */
if ( ! function_exists( 'benenson_render_stock_price_block' ) ) {
	function benenson_render_stock_price_block( array $attributes = [] ) {

		$high_price     = ! empty( $attributes['stockHigh'] ) ? $attributes['stockHigh'] : 0;
		$low_price      = ! empty( $attributes['stockLow'] ) ? $attributes['stockLow'] : 0;
		$previous_close = ! empty( $attributes['previousLow'] ) ? $attributes['previousLow'] : 0;
		$price          = ! empty( $attributes['stockPrice'] ) ? $attributes['stockPrice'] : 0;
		$symbol         = ! empty( $attributes['stocksymbol'] ) ? $attributes['stocksymbol'] : '';
		$api_key        = get_option( '_stock_api_key' );

		$url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' . $symbol . '&apikey=' . $api_key;
		$request = wp_remote_get( $url );

		if ( is_wp_error( $request ) ) {
			return false; // Bail early
		}

		$body = wp_remote_retrieve_body( $request );

		$obj = json_decode( $body, true );

		var_dump( $obj);

		$low = $obj['Global Quote']['04. low'];
		$high = $obj['Global Quote']['03. high'];
		$prev = $obj['Global Quote']['08. previous close'];

		spaceless();
		?>
		<div><?php echo esc_html( $price ); ?></div>
		<div>High: <?php echo esc_html( $high ); ?></div>
		<div>Low: <?php echo esc_html( $low ); ?></div>
		<div>Previous Low: <?php echo esc_html( $prev ); ?></div>

		<?php
		return endspaceless( false );
	}
}
