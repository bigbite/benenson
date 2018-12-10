<?php /* Template Name: Component Template */

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

<?php if ( ! get_post_meta( get_the_ID(), '_disable_share_icons', true ) ) : ?>
	<aside class="article-shareContainer article-shareContainer--absolute" aria-label="<?php echo esc_attr( __( 'Social sharing options', 'benenson' ) ); ?>">
		<?php get_template_part( 'partials/article-share' ); ?>
	</aside>
<?php endif; ?>
</main>
<?php get_footer(); ?>
