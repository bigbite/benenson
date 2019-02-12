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
		$stock_exchange = ! empty( $attributes['stockExchange'] ) ? $attributes['stockExchange'] : '';
		$api_key        = get_option( '_stock_api_key' );

		if ( ! empty( $stock_exchange ) ) {
			$symbol = $stock_exchange . ':' . $symbol;
		}

		$url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' . $symbol . '&apikey=' . $api_key;

		var_dump($url);

		//die();

		$request = wp_remote_get( $url );

		if ( is_wp_error( $request ) ) {
			return false; // Bail early
		}

		$body = wp_remote_retrieve_body( $request );

		$obj = json_decode( $body, true );

		var_dump( 'stock exchange', $stock_exchange );

		var_dump( $obj );

		$previous_close = $obj['Global Quote']['08. previous close'];
		$low           = $obj['Global Quote']['04. low'];
		$high          = $obj['Global Quote']['03. high'];
		$change        = $obj['Global Quote']['10. change percent'];
		$is_negative   = false;

		if ( substr ( $change, 0, 1 ) === '-' ) {
			$is_negative = true;
		}

		$status_label = ( true === $is_negative ) ? 'is-negative' : 'is-positive';

		spaceless();
		?>
		<div class="sharePriceTicker">
			<div class="sharePriceTicker-meta">
				<span><?php echo esc_html( $stock_exchange ); ?></span>
			</div>
			<div class="sharePriceTicker-data">
				<div class="sharePriceTicker-data-high"><?php echo esc_html( $high ); ?></div>
				<div class="sharePriceTicker-data-change <?php echo esc_html( $status_label ); ?>"><?php echo esc_html( $change ); ?></div>
			</div>
		</div>
		<?php
		return endspaceless( false );
	}
}
