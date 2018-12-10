<?php
$featured_image = benenson_featured_image( get_the_ID(), 'post-full' );

$caption = Benenson_Display_Image_Credit::description( get_post_thumbnail_id( get_the_ID() ) );
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( [ 'postImage--full' ] ); ?> role="article" aria-label="Article: <?php echo esc_attr( format_for_aria_label( get_the_title() ) ); ?>" style="background-image: url(<?php echo esc_attr( esc_url( $featured_image ) ); ?>)">
	<?php get_template_part( 'partials/post/post', 'content' ); ?>
<?php if ( $caption ) : ?>
	<span class="image-caption" aria-hidden="true"><?php echo esc_html( $caption ); ?></span>
<?php endif; ?>
</article>
