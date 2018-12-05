<?php
$postcount              = 1;
$default_posts_per_page = get_option( 'posts_per_page' );

get_header();
?>
<main id="main" role="main">
	<section class="news-section section--grey section section--small" aria-label="<?php echo esc_attr( /* translators: List of posts */ __( 'Results', 'benenson' ) ); ?>">
		<div class="container">
			<?php get_template_part( 'partials/archive-header' ); ?>

			<div class="postlist-wrapper">
				<aside class="postlist-filters">
					<?php get_sidebar(); ?>
				</aside>

				<div class="postlist postlist--hasSidebar">
					<?php
					while ( have_posts() ) :
						the_post();

						$has_featured = benenson_featured_image();

						if ( 1 === $postcount ) :
							$style = 'small';
							?>
							<div class="postrow postrow--compact">
							<?php
						elseif ( 3 === $postcount ) :
							$style = 'horizontal';
							?>
							<div class="postrow postrow--tall">
								<div class="post-wrapper">
							<?php
						endif;

						get_template_part( 'partials/post/post', $style );

						$postcount++;

						if ( $postcount >= $default_posts_per_page ) :
							?>
								</div>
							</div>
							<?php
						elseif ( 3 === $postcount ) :
							?>
							</div>
							<?php
						endif;
					endwhile;
					?>
				</div>
			</div>
		</div>
	</section>
	<?php get_template_part( 'partials/pagination' ); ?>
</main>
<?php get_footer(); ?>
