<?php
/**
 * The template for displaying author pages.
 */

$postcount              = 1;
$default_posts_per_page = get_option( 'posts_per_page' );

$author       = get_user_by( 'slug', get_query_var( 'author_name' ) );
$author_name  = get_the_author_meta( 'display_name', $author->ID );
$author_image = get_avatar_url( get_the_author_meta( 'ID' ) );

get_header();
?>
<main id="main" role="main">
	<section class="news-section section--grey section section--small" aria-label="<?php echo esc_attr( /* translators: List of posts */ __( 'Results', 'benenson' ) ); ?>">
		<div class="container">
			<?php get_template_part( 'partials/archive-header' ); ?>

			<div class="authorMeta">
				<h1><?php echo esc_html( $author_name ); ?></h1>
				<?php if ( isset( $author_image ) && ! empty( $author_image ) ) : ?>
					<img class="authorMeta-image" src="<?php echo esc_html( $author_image ); ?>" alt="Photo of <?php echo esc_html( $author_name ); ?>">
				<?php endif; ?>
			</div>

			<div class="postlist-wrapper">

				<div class="postlist postlist--noSidebar">
					<div class="postrow postrow--tall">
						<div class="post-wrapper">
							<?php
							while ( have_posts() ) :
								the_post();
								get_template_part( 'partials/post/post', 'horizontal' );
							endwhile;
							?>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<?php get_template_part( 'partials/pagination' ); ?>
</main>
<?php get_footer(); ?>
