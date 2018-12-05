<?php

get_header();
the_post();

$featured_image        = benenson_featured_image( get_the_ID(), 'post-featured' );
$featured_image_retina = benenson_featured_image( get_the_ID(), 'post-featured@2x' );
$hero_title            = benenson_get_meta_field( '_hero_title' );
$sidebar_is_enabled    = benenson_get_meta_field( '_disable_sidebar' ) !== '1';

?>

<main id="main" role="main">
	<section class="section section--small">
		<div class="container article-container">
			<article class="article no-sidebar">
			<?php if ( ! $hero_title ) : ?>
				<header class="article-header">
					<h1 class="article-title"><?php the_title(); ?></h1>
				</header>
			<?php endif; ?>
				<section class="article-content">
					<?php the_content(); ?>
				</section>
			</article>
			<aside class="article-shareContainer">
				<?php get_template_part( 'partials/article-share' ); ?>
			</aside>
		</div>
	</section>
</main>

<?php get_footer(); ?>
