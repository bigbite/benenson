<?php

get_header();
the_post();

$epoch_time = get_post_time( 'U', true );
$the_time   = benenson_locale_datetime( $epoch_time );

$featured_image        = false;
$featured_image_retina = false;

if ( ! get_post_meta( get_the_ID(), '_hide_featured_image', true ) && get_post_thumbnail_id( get_the_ID() ) ) {
	$featured_image        = benenson_featured_image( get_the_ID(), 'post-featured' );
	$featured_image_retina = benenson_featured_image( get_the_ID(), 'post-featured@2x' );

	$caption = get_post_field( 'post_content', get_post_thumbnail_id( get_the_ID() ) );
}

$categories    = wp_get_post_terms( get_the_ID(), 'category' );
$main_category = array_shift( $categories );

$document_reference = get_post_meta( get_the_ID(), 'document_ref', true );

$recipients = get_letter_recipients();

$reduced_width = get_post_meta( get_the_ID(), '_reduce_content_width', true );
$stretch_thumb = get_post_meta( get_the_ID(), '_stretch_thumbnail', true );

if ( benenson_post_has_header() ) {
	sprintf( '%', benenson_render_header_block( benenson_get_header_data() ) );
}
?>

<main id="main" role="main">
	<div class="section section--small container article-container">
		<section class="article has-sidebar">
			<nav class="article-meta">
			<?php if ( $main_category ) : ?>
				<?php $term_link = get_term_link( $main_category, 'category' ); ?>
				<a class="btn btn--white has-icon" aria-label="<?php echo esc_attr( sprintf( /* translators: Link to return to all posts of category %s */ __( 'Back to %s', 'benenson' ), $main_category->name ) ); ?>" href="<?php echo esc_url( is_wp_error( $term_link ) ? home_url() : $term_link ); ?>">
					<span class="icon-arrow-left"></span>
					<span><?php echo esc_attr( $main_category->name ); ?></span>
				</a>
			<?php endif; ?>
				<div class="article-meta-data">
					<div class="article-meta-item" aria-label="<?php echo esc_attr( __( 'Post published timestamp', 'benenson' ) ); ?>"><?php echo esc_attr( $the_time ); ?></div>
				<?php if ( true === apply_filters( 'benenson_display_author', false ) ) : ?>
					<div class="bypostauthor"><?php echo esc_attr( sprintf( '%s %s', __( 'Authored by', 'benenson' ), get_the_author() ) ); ?></div>
				<?php endif; ?>
				</div>
			</nav>

		<?php if ( $featured_image ) : ?>
			<figure class="article-figure <?php $stretch_thumb && print 'is-stretched'; ?>">
			<?php

			if ( $featured_image === $featured_image_retina ) {
				printf( '<img src="%s" alt="">', esc_url( $featured_image ) );
			} else {
				printf( '<img src="%1$s" srcset="%1$s 1x, %2$s 2x" alt="">', esc_url( $featured_image ), esc_url( $featured_image_retina ) );
			}

			?>

			<?php if ( $caption ) : ?>
				<span class="article-figureCopyright"><?php echo esc_attr( $caption ); ?></span>
			<?php endif; ?>
			</figure>
		<?php endif; ?>

			<header class="article-header <?php $reduced_width && print 'is-narrow'; ?>">
				<h1 id="article-title" class="article-title"><?php the_title(); ?></h1>
			</header>

			<article id="post-<?php the_ID(); ?>" <?php post_class( [ 'article-content', $reduced_width ? 'is-narrow' : '' ] ); ?> role="article" aria-labelledby="article-title">
			<?php if ( $recipients ) : ?>
				<details class="article-recipients">
					<summary><?php esc_html_e( 'View Recipients', 'benenson' ); ?></summary>
					<div><?php array_map( 'display_letter_recipient', $recipients ); ?></div>
				</details>
			<?php endif; ?>

			<?php

			the_content();

			wp_link_pages( [
				'before' => sprintf( '<div class="page-links">%s', __( 'Pages:', 'benenson' ) ),
				'after'  => '</div>',
			] );

			if ( true === apply_filters( 'benenson_comments_enabled', false ) ) {
				comments_template();
			}

			?>
			</article>

			<div class="article-tags">
			<?php

			$tags_list = get_the_tag_list( '', '' );
			if ( $tags_list ) {
				/* translators: 1: posted in label, only visible to screen readers. 2: list of tags. */
				printf(
					'<span class="screen-reader-text">%1$s </span>%2$s',
					__( 'Tags:', 'benenson' ),
					$tags_list
				); // WPCS: XSS OK.
			}

			?>
			</div>
		</section>

		<aside class="article-shareContainer" aria-label="<?php echo esc_attr( __( 'Social sharing options', 'benenson' ) ); ?>">
			<?php get_template_part( 'partials/article-share' ); ?>
		</aside>

		<aside class="article-sidebar" aria-label="<?php echo esc_attr( __( 'Sidebar', 'benenson' ) ); ?>">
			<?php get_sidebar(); ?>
		</aside>
	</div>
</main>

<?php get_footer(); ?>
