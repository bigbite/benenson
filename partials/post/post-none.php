<article id="post-<?php the_ID(); ?>" <?php post_class( [ 'postImage--none' ] ); ?> role="article" aria-label="Article: <?php echo esc_attr( format_for_aria_label( get_the_title() ) ); ?>">
	<?php get_template_part( 'partials/post/post', 'content' ); ?>
</article>
