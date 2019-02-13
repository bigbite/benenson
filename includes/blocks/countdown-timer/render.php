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

		$days           = '0';
		$hours          = '00';
		$minutes        = '00';
		$seconds        = '00';
		$time_remaining = 0;

		if ( ! empty( $attributes['date'] ) ) {
			$start_date     = time();
			$end_date       = strtotime( $attributes['date'] );
			$time_remaining = $end_date - $start_date;

			if ( $time_remaining > 0 ) {
				$days            = intval( $time_remaining / 86400 );
				$time_remaining %= 86400;

				$hours           = str_pad( intval( $time_remaining / 3600 ), 2, '0', STR_PAD_LEFT );
				$time_remaining %= 3600;

				$minutes         = str_pad( intval( $time_remaining / 60 ), 2, '0', STR_PAD_LEFT );
				$time_remaining %= 60;

				$seconds = str_pad( $time_remaining, 2, '0', STR_PAD_LEFT );
			}
		}

		$finished         = $time_remaining > 0 ? '' : 'is-finished';
		$hide_timer       = ! empty( $attributes['hideTimer'] ) && $attributes['hideTimer'] ? sprintf( 'data-hide-show="%s"', esc_attr( $attributes['hideTimer'] ) ) : '';
		$background_color = ! empty( $attributes['backgroundColor'] ) ? sprintf( 'background-color:%s', esc_attr( $attributes['backgroundColor'] ) ) : '';
		$background_image = ! empty( $attributes['backgroundUrl'] ) ? sprintf( 'background-image: url(\'%s\');', esc_attr( $attributes['backgroundUrl'] ) ) : '';

		spaceless();
		?>

		<div class="countdownTimer <?php echo esc_attr( $finished ); ?>" style="<?php echo esc_attr( $background_color ) . esc_attr ( $background_image ); ?>" <?php echo esc_attr( $hide_timer ); ?> data-ref="<?php echo esc_attr( $attributes['countdownId'] ); ?>" data-date="<?php echo esc_attr( $attributes['date'] ); ?>">
		<?php if ( $time_remaining > 0 ) : ?>
			<div class="countdownTimer-container">
				<?php
				if ( ! empty( $attributes['title'] ) ) {
					printf( '<h2 class="countdownTimer-title">%s</h2>', wp_kses_post( $attributes['title'] ) );
				}
				?>
				<div class="countdownTimer-items">
					<div class="countdownTimer-item countdownTimer-days">
						<?php printf( '<p><span>%s</span>%s</p>', esc_attr( $days ), esc_html__( 'Days', 'benenson' ) ); ?>
					</div>
					<div class="countdownTimer-item countdownTimer-hours">
						<?php printf( '<p><span>%s</span>%s</p>', esc_attr( $hours ), esc_html__( 'Hours', 'benenson' ) ); ?>
					</div>
					<div class="countdownTimer-item countdownTimer-mins">
						<?php printf( '<p><span>%s</span>%s</p>', esc_attr( $minutes ), esc_html__( 'Minutes', 'benenson' ) ); ?>
					</div>
					<div class="countdownTimer-item countdownTimer-secs">
						<?php printf( '<p><span>%s</span>%s</p>', esc_attr( $seconds ), esc_html__( 'Seconds', 'benenson' ) ); ?>
					</div>
				</div>
			</div>
		<?php else : ?>
			<div class="coutdownTimer-revealContainer">
				<?php
				if ( ! empty( $attributes['revealTitle'] ) ) {
					printf( '<h2 class="countdownTimer-title">%s</h2>', esc_attr( $attributes['revealTitle'] ) );
				}

				if ( ! empty( $attributes['revealContent'] ) ) {
					printf( '<p class="countdownTimer-content">%s</p>', esc_attr( $attributes['revealContent'] ) );
				}

				if ( ! empty( $attributes['revealBtnUrl'] ) && ! empty( $attributes['revealBtnText'] ) ) {
					printf( '<a href="%s" class="btn countdownTimer-btn">%s</a>', esc_url( $attributes['revealBtnUrl'] ), esc_attr( $attributes['revealBtnText'] ) );
				}
				?>
			</div>
		<?php endif; ?>
		</div>

		<?php
		return endspaceless( false );
	}
}
