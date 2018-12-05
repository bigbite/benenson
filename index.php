<?php

get_header();
the_post();

?>
<main id="main" role="main">
	<?php
	if ( have_posts() ) {
		// Load posts loop.
		while ( have_posts() ) {
			the_post();
			get_template_part( 'template-parts/content/content' );
		}
	} else {
		// If no content, include the "No posts found" template.
		get_template_part( 'template-parts/content/content', 'none' );
	}
	?>

	<?php the_content(); ?>
</main>
<?php get_footer(); ?>
