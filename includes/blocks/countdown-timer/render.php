<?php

/**
 * Renders the countdown timer block.
 *
 * @since 1.0.0
 * @return string
 */
if ( ! function_exists( 'benenson_render_countdown_timer_block' ) ) {
	function benenson_render_countdown_timer_block( array $attributes = [] ) {
		$required = [ 'countdownId', 'title', 'date' ];
		foreach ( $required as $req ) {
			if ( ! isset( $attributes[ $req ] ) ) {
				$attributes[ $req ] = '';
			}
		}

		$days    = 00;
		$hours   = 00;
		$minutes = 00;
		$seconds = 00;

		if ( ! empty ( $attributes['date'] ) ) {
			$start_date     = time();
			$end_date       = strtotime( $attributes['date'] );
			$time_remaining = $end_date - $start_date;

			$days            = intval( $time_remaining / 86400 );
			$time_remaining %= 86400;

			$hours           = str_pad( intval( $time_remaining / 3600 ), 2, '0', STR_PAD_LEFT );
			$time_remaining %= 3600;

			$minutes         = str_pad( intval( $time_remaining / 60 ), 2, '0', STR_PAD_LEFT );
			$time_remaining %= 60;

			$seconds = str_pad( $time_remaining, 2, '0', STR_PAD_LEFT );
		}

		spaceless();
		?>

		<div class="countdownTimer" data-date="<?php echo esc_attr( $attributes['date'] ); ?>">
			<?php
			if ( ! empty ( $attributes['title'] ) ) {
				printf( '<h2 class="countdownTimer-title">%s</h2>', wp_kses_post( $attributes['title'] ) );
			}
			?>
			<div class="countdownTimer-items">
				<div class="countdownTimer-item countdownTimer-days">
				<?php
				printf(
					'<p><span>%s</span>%s</p>',
					esc_attr( $days ),
					esc_html__( 'Days', 'benenson' )
				);
				?>
				</div>
				<div class="countdownTimer-item countdownTimer-hours">
				<?php
				printf(
					'<p><span>%s</span>%s</p>',
					esc_attr( $hours ),
					esc_html__( 'Hours', 'benenson' )
				);
				?>
				</div>
				<div class="countdownTimer-item countdownTimer-mins">
				<?php
				printf(
					'<p><span>%s</span>%s</p>',
					esc_attr( $minutes ),
					esc_html__( 'Minutes', 'benenson' )
				);
				?>
				</div>
				<div class="countdownTimer-item countdownTimer-secs">
				<?php
				printf(
					'<p><span>%s</span>%s</p>',
					esc_attr( $seconds ),
					esc_html__( 'Seconds', 'benenson' )
				);
				?>
				</div>
			</div>
		</div>

		<?php
		return endspaceless( false );
	}
}
