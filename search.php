<?php get_header(); ?>
<main id="main" role="main">
	<div class="container container--small">
		<section class="section section--tinted searchbox" role="search" aria-label="<?php echo esc_attr( __( 'Search form', 'benenson' ) ); ?>">
			<?php get_search_form(); ?>
		</section>
		<section class="section section--tinted" aria-label="<?php echo esc_attr( __( 'Search results', 'benenson' ) ); ?>">
			<?php
			get_template_part( 'partials/archive-header' );
			while ( have_posts() ) :
				the_post();
				get_template_part( 'partials/post/post', 'search' );
			endwhile;
			?>
		</section>
		<?php get_template_part( 'partials/pagination' ); ?>
	</div>
</main>
<?php get_footer(); ?>
