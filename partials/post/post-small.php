<?php
$featured_image    = benenson_featured_image( get_the_ID(), 'post-half' );
$featured_image_2x = benenson_featured_image( get_the_ID(), 'post-half@2x' );

?>
<article id="post-<?php the_ID(); ?>" <?php post_class( [ 'postImage--small' ] ); ?> role="article" aria-label="Article: <?php echo esc_attr( format_for_aria_label( get_the_title() ) ); ?>">
	<figure class="post-figure">
		<div class="post-figure-ratio" style="background-image: url( <?php echo esc_url( $featured_image ); ?> )">
			<img src="<?php echo esc_url( $featured_image ); ?>" alt="">
		</div>
	</figure>
	<?php get_template_part( 'partials/post/post', 'content' ); ?>
</article>
