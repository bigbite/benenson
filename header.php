<?php

$page_id = get_the_ID();

if ( is_home() ) {
	$page_id = get_option( 'page_for_posts' );
}

if ( is_front_page() ) {
	$page_id = get_option( 'page_on_front' );
}

if ( is_archive() ) {
	$page_id = get_option( 'page_for_posts' );
}

$hero_identifier = substr( md5( uniqid( wp_rand(), true ) ), 0, 8 );

$header_style    = benenson_get_meta_field( '_nav_style', $page_id );
$hero_title      = benenson_get_meta_field( '_hero_title' );
$hero_content    = benenson_get_meta_field( '_hero_content' );
$hero_cta_text   = benenson_get_meta_field( '_hero_cta_text' );
$hero_cta_link   = benenson_get_meta_field( '_hero_cta_link' );
$hero_alignment  = benenson_get_meta_field( '_hero_alignment' ) ?: 'left';
$hero_background = benenson_get_meta_field( '_hero_background', $page_id );
$hero_size       = benenson_get_meta_field( '_hero_size', $page_id );
$hero_type       = benenson_get_meta_field( '_hero_type', $page_id );
$hero_video_id   = benenson_get_meta_field( '_hero_video_id', $page_id );
$hero_embed      = benenson_get_meta_field( '_hero_embed', $page_id );

$hero_show = false;
$media_lg  = false;

if ( get_post_thumbnail_id( $page_id ) || $hero_title ) {
	$hero_show = true;

	$media_lg = benenson_featured_image( $page_id, 'hero-lg' );
	$media_md = benenson_featured_image( $page_id, 'hero-md' );
	$media_sm = benenson_featured_image( $page_id, 'hero-sm' );
	$caption  = Benenson_Display_Image_Credit::description( get_post_thumbnail_id( $page_id ) );
}

$header_global = benenson_get_option( '_header_style' ) ?: 'light';

if ( ! $header_style || 'global' === $header_style || ! in_array( $header_style, [ 'transparent-light', 'transparent-dark' ], true ) ) {
	$header_style = $header_global;
}

if ( ! $hero_size && ! $hero_title && $media_lg ) {
	$hero_size = 'small';
}

$object = get_queried_object();

$body_class = [];
if ( $hero_show && ! is_singular( [ 'post' ] ) && ! is_search() && ! is_404() ) {
	$body_class[] = 'has-hero';
}

?>
<!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<script>(function(h){h.classList.remove('no-js');h.classList.add('js');})(document.documentElement);</script>
	<?php wp_head(); ?>
</head>
<body <?php body_class( $body_class ); ?>>

<?php do_action( 'benenson_after_body_open_tag' ); ?>

<?php require_once get_template_directory() . '/assets/images/symbol-defs.svg'; ?>

<a class="skipLink" href="#main"><?php echo esc_html( /* translators: Label for screen reader/keyboard users */ __( 'Skip to main content', 'benenson' ) ); ?></a>

<header class="page-header page-header--<?php echo esc_attr( $header_style ); ?>" role="banner" aria-label="Page Header" data-header-global="<?php echo esc_attr( $header_global ); ?>">
	<div class="container">
		<?php benenson_theme_logo(); ?>

		<nav class="page-nav">
			<ul role="navigation" aria-label="<?php echo esc_attr( __( 'Primary navigation', 'benenson' ) ); ?>">
				<?php benenson_nav( 'main-menu' ); ?>
			</ul>
			<?php if ( ! benenson_get_option( '_search_disabled', false ) && ! benenson_get_option( '_search_navigation_disabled', false ) ) : ?>
			<div class="page-headerSearchContainer" role="search" aria-label="<?php echo esc_attr( 'Search', 'benenson' ); ?>">
				<button data-toggle-search class="page-headerSearch" role="button" aria-label="<?php echo esc_attr( __( 'Show search form', 'benenson' ) ); ?>">
					<span class="u-hiddenVisually"><?php esc_attr_e( 'Search', 'benenson' ); ?></span>
				</button>
				<?php get_search_form(); ?>
			</div>
			<?php endif; ?>
			<button class="page-headerHamburger" data-toggle-menu role="button" aria-expanded="false" aria-label="<?php echo esc_attr( 'Open navigation', 'benenson' ); ?>"><span></span></button>
		</nav>
	</div>
</header>

<div class="page-mobileMenuOverlay" data-toggle-menu aria-hidden="true">
	<section class="page-mobileMenu">
		<header class="page-mobileMenuHeader">
			<h2><?php esc_attr_e( 'Main Menu', 'benenson' ); ?></h2>
			<button data-toggle-menu tabindex="-1" role="button" aria-expanded="true" aria-label="<?php echo esc_attr( __( 'Close navigation', 'benenson' ) ); ?>"></button>
		</header>
		<nav class="page-mobileMenuNav">
			<ul role="navigation" aria-label="<?php echo esc_attr( __( 'Primary', 'benenson' ) ); ?>">
				<?php benenson_nav( 'main-menu', new Mobile_Nav_Walker() ); ?>
			</ul>
		</nav>
	</section>
</div>

<?php if ( $hero_show && ! is_singular( [ 'post' ] ) && ! is_search() && ! is_404() ) : ?>
	<?php if ( $media_lg ) : ?>
	<style>
		#hero-<?php echo esc_html( $hero_identifier ); ?> {
			background-image: url(<?php echo esc_url( $media_sm ); ?>);
		}

		@media screen and (min-width: 770px) {
			#hero-<?php echo esc_html( $hero_identifier ); ?> {
				background-image: url(<?php echo esc_url( $media_md ); ?>);
			}
		}

		@media screen and (min-width: 1444px) {
			#hero-<?php echo esc_html( $hero_identifier ); ?> {
				background-image: url(<?php echo esc_url( $media_lg ); ?>);
			}
		}
	</style>
	<?php endif; ?>
<section id="hero-<?php echo esc_html( $hero_identifier ); ?>" class="page-hero <?php 'video' === $hero_type && print 'page-hero--video'; ?> page-heroSize--<?php echo esc_attr( $hero_size ); ?> page-heroBackground--<?php echo esc_attr( $hero_background ); ?> page-heroAlignment--<?php echo esc_attr( $hero_alignment ); ?>" role="region" <?php ( $hero_title || is_archive() ) && print 'aria-labelledby="herotitle"'; ?>>
	<?php
	if ( 'video' === $hero_type && $hero_video_id ) :
		$source = wp_get_attachment_url( $hero_video_id );
		?>
		<div class="page-heroVideoContainer">
			<video class="page-heroVideo" autoplay loop muted>
				<source src="<?php echo esc_url( $source ); ?>">
			</video>
		</div>
	<?php endif; ?>
	<div class="container">
		<div class="hero-content">
		<?php if ( $hero_title || is_archive() ) : ?>
			<h1 id="herotitle" class="page-heroTitle"><span><?php echo wp_kses_post( is_archive() ? $object->name : $hero_title ); ?></span></h1>
		<?php endif; ?>
		<?php if ( $hero_content && ! is_archive() ) : ?>
			<p class="page-heroContent"><?php echo wp_kses_post( $hero_content ); ?></p>
		<?php endif; ?>
		<?php if ( is_archive() && $object->description ) : ?>
			<p class="page-heroContent"><?php echo wp_kses_post( $object->description ); ?></p>
		<?php endif; ?>
		<?php if ( $hero_cta_text && ( $hero_cta_link || $hero_embed ) ) : ?>
			<div class="page-heroCta">
				<a <?php ( $hero_cta_link && ! $hero_embed ) && printf( 'href="%s"', esc_url( $hero_cta_link ) ); ?> class="btn" <?php $hero_embed && printf( 'data-modal-embed="%s"', esc_attr( $hero_embed ) ); // Using esc_attr as the embed could be an ID. ?>><?php $hero_embed && printf( '<i class="play-icon">%s</i>', esc_html__( 'Play Icon', 'benenson' ) ); ?><?php echo esc_html( wp_strip_all_tags( $hero_cta_text ) ); ?></a>
			</div>
		<?php endif; ?>
		</div>
	</div>

	<?php if ( $caption ) : ?>
		<span class="image-caption" aria-hidden="true"><?php echo esc_html( $caption ); ?></span>
	<?php endif; ?>
</section>
<?php elseif ( is_archive() ) : ?>
<section class="page-hero page-heroAlignment--<?php echo esc_attr( $hero_alignment ); ?> no-image" role="region" <?php ( $hero_title || is_archive() ) && print 'aria-labelledby="herotitle"'; ?>>
	<div class="container">
		<div class="hero-content">
		<?php if ( $hero_title || is_archive() ) : ?>
			<h1 id="herotitle" class="page-heroTitle"><span><?php echo wp_kses_post( is_archive() ? $object->name : $hero_title ); ?></span></h1>
		<?php endif; ?>
		<?php if ( $hero_content && ! is_archive() ) : ?>
			<p class="page-heroContent"><?php echo wp_kses_post( $hero_content ); ?></p>
		<?php endif; ?>
		<?php if ( is_archive() && $object->description ) : ?>
			<p class="page-heroContent"><?php echo wp_kses_post( $object->description ); ?></p>
		<?php endif; ?>
		<?php if ( $hero_cta_text && ( $hero_cta_link || $hero_embed ) ) : ?>
			<div class="page-heroCta">
				<a <?php ( $hero_cta_link && ! $hero_embed ) && printf( 'href="%s"', esc_url( $hero_cta_link ) ); ?> class="btn" <?php $hero_embed && printf( 'data-modal-embed="%s"', esc_attr( $hero_embed ) ); // Using esc_attr as the embed could be an ID. ?>><?php $hero_embed && printf( '<i class="play-icon">%s</i>', esc_html__( 'Play Icon', 'benenson' ) ); ?><?php echo esc_html( wp_strip_all_tags( $hero_cta_text ) ); ?></a>
			</div>
		<?php endif; ?>
		</div>
	</div>
</section>
<?php endif; ?>
