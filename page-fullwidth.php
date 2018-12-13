<?php
/*
Template Name: Full-width layout
Template Post Type: post, page, event
*/

get_header();
the_post();

$hero_title = benenson_get_meta_field( '_hero_title' );

?>

<main id="main" role="main">
	<section class="section section--small">
		<div class="container article-container">
			<article class="article is-wide">
			<?php if ( ! $hero_title ) : ?>
				<header class="article-header">
					<h1 class="article-title"><?php the_title(); ?></h1>
				</header>
			<?php endif; ?>
				<section class="article-content">
				<?php

				the_content();

				wp_link_pages( [
					'before' => sprintf( '<div class="page-links">%s', __( 'Pages:', 'benenson' ) ),
					'after'  => '</div>',
				] );

				?>
				</section>
			</article>
		</div>
	</section>
</main>

<?php get_footer(); ?>
