<?php

$featured_categories = get_terms( [
	'taxonomy'   => 'category',
	'hide_empty' => true,
	'parent'     => 0,
] );

$featured_categories = array_values( $featured_categories );

$sub_categories   = [];
$current_category = false;

if ( is_category() ) {
	$current_category = get_queried_object();
	$sub_categories   = get_terms( [
		'taxonomy'   => 'category',
		'hide_empty' => true,
		'parent'     => get_term_top_most_parent( $current_category->term_id )->term_id,
	] );
}

$has_subcategories = count( $sub_categories ) > 0;

?>

<?php if ( $featured_categories ) : ?>
<section class="section section--small postlist-categoriesContainer" style="display: flex;" data-slider>
	<ul class="postlist-categories<?php count( $featured_categories ) > 4 && print ' use-flickity'; ?>" style="flex: 1 1 100%" aria-label="<?php echo esc_attr( __( 'Filter results by category', 'benenson' ) ); ?>">
	<?php
	foreach ( $featured_categories as $key => $featured_category ) :
		$active = false;
		if ( isset( $current_category->term_id ) ) {
			$active = determine_if_term_is_parent( $current_category->term_id, $featured_category->term_id );
		}

		$termlink = get_term_link( $featured_category );

		if ( is_wp_error( $termlink ) ) {
			$termlink = home_url();
		}
		?>
		<li <?php $active && printf( 'class="is-current" data-categories-selected="%d"', esc_attr( $key ) ); ?>>
			<div>
				<a class="btn btn--white" href="<?php echo esc_url( $termlink ); ?>"><?php echo esc_attr( $featured_category->name ); ?></a>
			</div>
		</li>
	<?php endforeach; ?>
	</ul>
	<button data-slider-prev disabled><?php echo esc_html( __( 'Previous', 'benenson' ) ); ?></button>
	<button data-slider-next><?php echo esc_html( __( 'Next', 'benenson' ) ); ?></button>
</section>
<?php endif; ?>

<?php
if ( ! $has_subcategories ) {
	return;
}
?>

<aside class="news-sidebar section section--small" role="complementary" aria-label="<?php esc_html_e( 'List of subcategories', 'benenson' ); ?>">
	<span class="element-select <?php has_term_parent( get_queried_object() ) && print 'is-active'; ?>">
		<select aria-label="<?php echo esc_attr( __( 'List of second-level categories', 'benenson' ) ); ?>">
		<?php

		printf( '<option value="%s">%s</option>', esc_attr( get_term_link( get_term_parent( get_queried_object() ) ) ), esc_html( __( 'Select a sub filter', 'benenson' ) ) );
		array_map( 'print_category_option', $sub_categories );

		?>
		</select>
	</span>


<?php

foreach ( $sub_categories as $sub_cat ) :
	if ( ! is_current_category( $sub_cat ) ) {
		continue;
	}

	$sub_sub_cats = get_terms( [
		'taxonomy'   => 'category',
		'hide_empty' => true,
		'child_of'   => $sub_cat->term_id,
	] );

	if ( ! $sub_sub_cats ) {
		continue;
	}

	?>

	<span class="element-select">
		<select aria-label="<?php echo esc_attr( __( 'List of third-level categories', 'benenson' ) ); ?>">
		<?php

		printf( '<option value="%s">%s</option>', esc_attr( get_term_link( get_term_parent( get_queried_object() ) ) ), esc_html( __( 'Select a sub filter', 'benenson' ) ) );
		array_map( 'print_category_option', $sub_sub_cats );

		?>
		</select>
	</span>

<?php endforeach; ?>
</aside>
