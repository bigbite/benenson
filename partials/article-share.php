<?php spaceless(); ?>
<div class="article-share" role="complementary" aria-label="<?php echo esc_attr( __( 'Social sharing options', 'benenson' ) ); ?>">
	<h3 class="article-shareTitle"><?php esc_attr_e( 'Share', 'benenson' ); ?></h3>
	<ul>
		<li>
			<a class="article-shareFacebook" target="_blank" rel="noopener" href="https://www.facebook.com/sharer.php?u=<?php the_permalink(); ?>" title="<?php esc_attr_e( 'Share on Facebook', 'benenson' ); ?>">
				<img src="<?php echo esc_url( benenson_asset_uri( 'images' ) ); ?>/icon-facebook.svg" alt="<?php esc_attr_e( 'Facebook Logo', 'benenson' ); ?>">
			</a>
		</li>
		<li>
			<a class="article-shareTwitter" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=<?php the_permalink(); ?>&text=<?php the_title(); ?>" title="<?php esc_attr_e( 'Share on Twitter', 'benenson' ); ?>">
				<img src="<?php echo esc_url( benenson_asset_uri( 'images' ) ); ?>/icon-twitter.svg" alt="<?php esc_attr_e( 'Twitter Logo', 'benenson' ); ?>">
			</a>
		</li>
	</ul>
</div>
<?php endspaceless(); ?>
