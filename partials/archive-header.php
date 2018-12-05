<?php

global $wp_query;

$found_posts     = absint( $wp_query->found_posts );
$current_sort    = get_query_var( 'sort' );
$available_sorts = benenson_valid_sort_parameters();

/* translators: Singular/Plural number of posts. */
$results = sprintf( _n( '%d result', '%d results', $found_posts, 'benenson' ), $found_posts );

if ( is_search() ) {
	/* translators: 1: number of results for search query, 2: don't translate (dynamic search term) */
	$results = sprintf( _n( "%1\$d result for '%2\$s'", "%1\$d results for '%2\$s'", $found_posts, 'benenson' ), $found_posts, get_search_query() );
}

?>

<header class="postlist-header" aria-label="<?php echo esc_attr( /* translators: Label for post results count & sort options */ __( 'Results information', 'benenson' ) ); ?>">
	<h2 class="postlist-headerTitle">
		<?php echo esc_attr( $results ); ?>
	</h2>
	<div class="postlist-sort">
		<label id="sort-description" for="sort-by"><?php echo esc_html( /* translators: Label for post sorting options */ __( 'Sort by', 'benenson' ) ); ?></label>
		<div class="element-select">
			<select id="sort-by" name="sort" aria-labelledby="sort-description">
			<?php foreach ( $available_sorts as $value => $label ) : ?>
				<option value="<?php echo esc_attr( $value ); ?>" <?php echo wp_kses_post( $value === $current_sort ? 'selected' : '' ); ?>><?php echo esc_attr( $label ); ?></option>
			<?php endforeach; ?>
			</select>
		</div>
	</div>
</header>
