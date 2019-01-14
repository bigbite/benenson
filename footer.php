<?php

$twitter   = benenson_get_option( '_social_twitter' );
$facebook  = benenson_get_option( '_social_facebook' );
$instagram = benenson_get_option( '_social_instagram' );
$youtube   = benenson_get_option( '_social_youtube' );

$has_social = ( $twitter || $facebook || $instagram || $youtube );

$footer_section = [
	'title'   => benenson_get_option( '_footer_title' ),
	'content' => benenson_get_option( '_footer_content' ),
];

?>
	<footer class="page-footer" role="contentinfo" aria-label="<?php echo esc_attr( __( 'Footer', 'benenson' ) ); ?>">
		<div class="container">
		<?php spaceless(); ?>
			<ul class="page-footerSections" aria-label="<?php echo esc_attr( __( 'Footer Menus', 'benenson' ) ); ?>">

			<?php benenson_nav( 'footer-navigation' ); ?>

			<?php if ( $footer_section['title'] || $footer_section['content'] ) : ?>
				<li class="page-footerSection page-footerSection--large">
				<?php if ( $footer_section['title'] ) : ?>
					<a><?php echo esc_attr( $footer_section['title'] ); ?></a>
				<?php endif; ?>

				<?php if ( $footer_section['content'] ) : ?>
					<?php echo wp_kses_post( apply_filters( 'the_content', $footer_section['content'] ) ); ?>
				<?php endif; ?>
				</li>
			<?php endif; ?>
			</ul>
		<?php endspaceless(); ?>

			<div class="page-footerBottom">
				<section class="page-footerBottomHalf">
				<?php if ( benenson_nav_should_display( 'footer-legal' ) ) : ?>
					<nav class="page-footerBottomNav">
						<ul><?php benenson_nav( 'footer-legal' ); ?></ul>
					</nav>
				<?php endif; ?>
					<span class="page-footerCopyright">&copy; <?php echo esc_html( date( 'Y' ) ); ?> <?php bloginfo( 'title' ); ?></span>
				</section>
			<?php if ( $has_social ) : ?>
				<section class="page-footerBottomHalf page-footerSocialContainer">
					<h3 class="page-footerBottomTitle" aria-label="<?php echo esc_attr( /* translators: Social Media sharing options */ __( 'Follow us on:', 'benenson' ) ); ?>"><?php esc_html_e( 'Follow us on:', 'benenson' ); ?> </h3>
					<ul class="page-footerSocial">
					<?php if ( $facebook ) : ?>
						<li><a target="_blank" rel="noopener" href="<?php echo esc_url( $facebook ); ?>" aria-label="<?php echo esc_attr( __( 'Follow us on Facebook', 'benenson' ) ); ?>"><span class="social-facebook">Facebook</span></a></li>
					<?php endif; ?>
					<?php if ( $twitter ) : ?>
						<li><a target="_blank" rel="noopener" href="<?php echo esc_url( $twitter ); ?>" aria-label="<?php echo esc_attr( __( 'Follow us on Twitter', 'benenson' ) ); ?>"><span class="social-twitter">Twitter</span></a></li>
					<?php endif; ?>
					<?php if ( $youtube ) : ?>
						<li><a target="_blank" rel="noopener" href="<?php echo esc_url( $youtube ); ?>" aria-label="<?php echo esc_attr( __( 'Subscribe to our YouTube channel', 'benenson' ) ); ?>"><span class="social-youtube">YouTube</span></a></li>
					<?php endif; ?>
					<?php if ( $instagram ) : ?>
						<li><a target="_blank" rel="noopener" href="<?php echo esc_url( $instagram ); ?>" aria-label="<?php echo esc_attr( __( 'Follow us on Instagram', 'benenson' ) ); ?>"><span class="social-instagram">Instagram</span></a></li>
					<?php endif; ?>
					</ul>
				</section>
			<?php endif; ?>
			</div>
		</div>
	</footer>
	<?php wp_footer(); ?>
	<script>App.default();</script>
	</body>
</html>
