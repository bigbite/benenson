<?php get_header(); ?>
<main id="main" role="main">
	<section class="section">
		<div class="container u-textCenter">
			<h1 aria-label="<?php echo esc_attr( __( 'Page Not Found', 'benenson' ) ); ?>"><?php echo esc_html( strtoupper( __( 'Page Not Found', 'benenson' ) ) ); ?></h1>
			<p><?php esc_html_e( 'The page you are looking for does not exist.', 'benenson' ); ?></p>
			<a class="btn" href="<?php echo esc_url( get_home_url() ); ?>"><?php esc_html_e( 'Go to the Homepage', 'benenson' ); ?></a>
		</div>
	</section>
</main>
<?php get_footer(); ?>
