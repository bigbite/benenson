<?php

/**
 * Renders the stock price block.
 *
 * @since 1.0.0
 * @return string
 */
if ( ! function_exists( 'benenson_render_stock_price_block' ) ) {
	function benenson_render_stock_price_block( array $attributes = [] ) {

		$high_price  = ! empty( $attributes['stockHigh'] ) ? $attributes['stockHigh'] : 0;
		$low_price   = ! empty( $attributes['stockLow'] ) ? $attributes['stockLow'] : 0;
		$price       = ! empty( $attributes['stockPrice'] ) ? $attributes['stockPrice'] : 0;
		$symbol      = ! empty( $attributes['stocksymbol'] ) ? $attributes['stocksymbol'] : '';

		$url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' . $symbol . '&apikey=A4HQO5VEF6YLX066';
		$obj = json_decode(file_get_contents($url), true);
		var_dump($obj);
		$low = $obj['Global Quote']['04. low'];
		$high = $obj['Global Quote']['03. high'];


		spaceless();
		?>
		<div><?php echo esc_html( $high_price ); ?></div>
		<div><?php echo esc_html( $high_price ); ?></div>
		<div><?php echo esc_html( $price ); ?></div>
		<div>High: <?php echo esc_html( $high ); ?></div>
		<div>High: <?php echo esc_html( $low ); ?></div>

		<?php
		return endspaceless( false );
	}
}
