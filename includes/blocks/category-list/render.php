<?php

/**
 * Check whether the given category ID is the current category being
 * viewed.
 *
 * @since 1.0.0
 * @param integer $category_id ID of the category to check.
 * @return boolean
 */
if ( ! function_exists( 'benenson_is_current_category' ) ) {
	function benenson_is_current_category( $category_id = null ) {
		if ( ! $category_id ) {
			return false;
		}

		if ( ! is_category() ) {
			return false;
		}

		$current_category = get_queried_object();
		$sub_categories   = get_terms( [
			'taxonomy'   => 'category',
			'hide_empty' => true,
			'parent'     => get_term_top_most_parent( $current_category->term_id )->term_id,
		] );

		if ( $current_category->cat_ID !== $category_id ) {
			return false;
		}

		return true;
	}
}

/**
 * Renders the category list block.
 *
 * @since 1.0.0
 * @return string
 */
if ( ! function_exists( 'benenson_render_category_list' ) ) {
	function benenson_render_category_list( $atts = [] ) {
		$maximum = ! empty( $atts['maximum'] ) ? absint( $atts['maximum'] ) : 0;
		$title   = ! empty( $atts['title'] ) ? $atts['title'] : false;

		if ( is_category() ) {
			$current_category = get_queried_object();
			$sub_categories   = get_terms( [
				'taxonomy'   => 'category',
				'hide_empty' => true,
				'parent'     => get_term_top_most_parent( $current_category->term_id )->term_id,
			] );
		}

		$categories = get_categories( [
			'number' => $maximum,
			'parent' => 0,
		] );

		ob_start();
		?>
		<div class="wp-category-list category-list">
		<?php if ( $title ) : ?>
			<h3 class="category-expander"><?php echo wp_kses_post( $title ); ?>
				<svg class="icon icon-plus"><use xlink:href="#icon-plus-outline"></use></svg><span class="name u-hiddenVisually">icon-plus</span>
				<svg class="icon icon-minus"><use xlink:href="#icon-minus-outline"></use></svg><span class="name u-hiddenVisually">icon-minus</span>
			</h3>
		<?php endif; ?>
			<div class="category-list-expander">
				<ul>
				<?php foreach ( $categories as $category ) : ?>
					<?php
					$current_class       = '';
					$is_current_category = benenson_is_current_category( $category->cat_ID );

					if ( $is_current_category ) {
						$current_class = 'is-current';
					}
					?>
					<li class="<?php echo esc_attr( $current_class ); ?>">
						<a href="<?php echo esc_url( get_category_link( $category ) ); ?>"><?php echo esc_html( $category->name ); ?></a>
						<?php if ( $is_current_category && count( $sub_categories ) > 0 ) : ?>
						<ul>
							<?php foreach ( $sub_categories as $sub_cat ) : ?>
							<li>
								<a href="<?php echo esc_url( get_category_link( $sub_cat ) ); ?>"><?php echo esc_html( $sub_cat->name ); ?></a>
							</li>
							<?php endforeach; ?>
							</ul>
						<?php endif; ?>
					</li>
				<?php endforeach; ?>
				</ul>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
