<?php

/* translators: Previous post navigation label */
$previous_link = get_previous_posts_link( '<span class="icon"></span><span>' . __( 'Previous', 'benenson' ) . '</span>' );
/* translators: Next post navigation label */
$next_link    = get_next_posts_link( '<span class="icon"></span><span>' . __( 'Next', 'benenson' ) . '</span>' );
$page_numbers = benenson_paginate_links( [
	'mid_size'  => 1,
	'prev_next' => false,
	'type'      => 'array',
] );

if ( empty( $page_numbers ) ) {
	return;
}

?>

<section class="section section--small post-pagination">
	<nav class="post-paginationContainer" role="navigation" aria-label="<?php echo esc_attr( __( 'Pagination', 'benenson' ) ); ?>">
		<div class="post-paginationLink post-paginationPrevious">
		<?php if ( $previous_link ) : ?>
			<?php echo wp_kses_post( $previous_link ); ?>
		<?php else : ?>
			<button disabled>
				<span class="icon"></span>
				<span><?php esc_attr_e( 'Previous', 'benenson' ); ?></span>
			</button>
		<?php endif; ?>
		</div>
		<ul class="page-numbers" aria-label="<?php echo esc_attr( __( 'Page numbers', 'benenson' ) ); ?>">
		<?php foreach ( $page_numbers as $number ) : ?>
			<li><?php echo wp_kses_post( $number ); ?></li>
		<?php endforeach; ?>
		</ul>
		<div class="post-paginationLink post-paginationNext">
		<?php if ( $next_link ) : ?>
			<?php echo wp_kses_post( $next_link ); ?>
		<?php else : ?>
			<button disabled>
				<span class="icon"></span>
				<span><?php esc_attr_e( 'Next', 'benenson' ); ?></span>
			</button>
		<?php endif; ?>
		</div>
	</nav>
</section>
