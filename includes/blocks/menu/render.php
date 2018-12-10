<?php

/**
 * Renders the menu block.
 *
 * @since 1.0.0
 * @return string
 */
if ( ! function_exists( 'benenson_render_menu_block' ) ) {
	function benenson_render_menu_block( $atts = [] ) {
		$menu_id = ! empty( $atts['menuId'] ) ? $atts['menuId'] : false;

		if ( ! $menu_id ) {
			return '';
		}

		$menu       = wp_get_nav_menu_object( absint( $menu_id ) );
		$menu_count = $menu->count;

		ob_start();
		?>
		<section class="postlist-categoriesContainer <?php empty( $atts['color'] ) || printf( 'section--%s', esc_attr( $atts['color'] ) ); ?>" data-slider>
			<ul class="postlist-categories<?php $menu_count > 4 && print ' use-flickity'; ?>" role="navigation" aria-label="<?php echo esc_attr( __( 'Category List', 'benenson' ) ); ?>">
			<?php

			wp_nav_menu( [
				'menu'            => absint( $menu_id ),
				'container'       => false,
				'container_class' => 'menu-{menu slug}-container',
				'container_id'    => '',
				'menu_class'      => 'menu',
				'menu_id'         => 'category_style_menu',
				'echo'            => true,
				'before'          => '',
				'after'           => '',
				'link_before'     => '',
				'link_after'      => '',
				'items_wrap'      => '%3$s',
				'depth'           => 1,
			] );

			?>
			</ul>
			<button data-slider-prev disabled>Previous</button>
			<button data-slider-next>Next</button>
		</section>
		<?php
		return ob_get_clean();
	}
}
