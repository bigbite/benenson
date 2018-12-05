<?php
$post_tag  = false;
$post_tags = benenson_get_post_terms( get_the_ID() );

if ( count( $post_tags ) > 0 ) {
	$post_tag = array_shift( $post_tags );
}

$epoch = get_post_time( 'U', true );
$date  = benenson_locale_date( $epoch );
?>
<a class="floating-anchor" href="<?php the_permalink(); ?>"></a>
<div class="post-content">
	<div class="post-meta">
		<?php if ( $post_tag ) : ?>
			<?php $term_link = get_term_link( $post_tag, $post_tag->taxonomy ); ?>
			<a class="post-category" aria-label="<?php /* translators: placeholder is category name */ sprintf( __( 'Article category %s', 'benenson' ), esc_attr( $post_tag->name ) ); ?>" href="<?php echo esc_url( is_wp_error( $term_link ) ? home_url() : $term_link ); ?>"><?php echo esc_attr( $post_tag->name ); ?></a>
		<?php endif; ?>
		<span class="post-date" aria-label="<?php echo esc_attr( __( 'Post published date', 'benenson' ) ); ?>"><?php echo esc_attr( $date ); ?></span>
	</div>
	<header class="post-header">
		<h1 class="post-title"><span><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></span></h1>
	</header>
</div>
