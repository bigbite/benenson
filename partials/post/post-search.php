<?php

$post_terms = wp_get_post_terms( get_the_ID(), 'category' );
$post_term  = false;

if ( count( $post_terms ) > 0 ) {
	$post_term = array_shift( $post_terms );
}

$epoch = get_post_time( 'U', true );
$date  = benenson_locale_date( $epoch );

?>
<article id="post-<?php the_ID(); ?>" <?php post_class( [ 'post--result' ] ); ?> role="article" aria-label="Article: <?php echo esc_attr( format_for_aria_label( get_the_title() ) ); ?>">
	<a class="floating-anchor" href="<?php the_permalink(); ?>" aria-hidden="true"></a>
<?php if ( $post_term ) : ?>
	<?php $post_term_link = get_term_link( $post_term, $post_term->taxonomy ); ?>
	<a class="post-category" href="<?php echo esc_url( is_wp_error( $post_term_link ) ? home_url() : $post_term_link ); ?>" tabindex="0"><?php echo esc_attr( $post_term->name ); ?></a>
<?php endif; ?>
	<h1 class="post-title"><a href="<?php the_permalink(); ?>" tabindex="0"><?php the_title(); ?></a></h1>
	<div class="post-excerpt"><?php echo esc_attr( trim_text( get_the_excerpt(), 300, true, true ) ); ?></div>
	<span class="post-byline" aria-label="<?php echo esc_attr( __( 'Post published date', 'benenson' ) ); ?>"><?php echo esc_attr( $date ); ?></span>
</article>
