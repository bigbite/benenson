<?php
if ( is_page_template( 'templates/without-sidebar.php' ) ) {
	get_template_part( 'templates/without-sidebar' );
	return;
}

get_header();
the_post();

?>
<main id="main" role="main">
<?php

the_content();

wp_link_pages( [
	'before' => sprintf( '<div class="page-links">%s', __( 'Pages:', 'benenson' ) ),
	'after'  => '</div>',
] );

?>
</main>
<?php get_footer(); ?>
