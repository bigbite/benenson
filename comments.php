<?php

if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="comments-area">
<?php if ( have_comments() ) : ?>
	<h2 class="comments-title">
	<?php

	echo esc_html( sprintf(
		/* translators: 1: number of comments, 2: post title */
		_nx( '%1$s Reply to &ldquo;%2$s&rdquo;', '%1$s Replies to &ldquo;%2$s&rdquo;', get_comments_number(), 'comments title', 'benenson' ),
		number_format_i18n( get_comments_number() ),
		get_the_title()
	) );

	?>
	</h2>

	<ol class="comment-list">
	<?php

	wp_list_comments( [
		'avatar_size' => 100,
		'style'       => 'ol',
		'short_ping'  => true,
		'reply_text'  => __( 'Reply', 'benenson' ),
	] );

	?>
	</ol>

	<?php

	the_comments_pagination( [
		'prev_text' => __( 'Previous', 'benenson' ),
		'next_text' => __( 'Next', 'benenson' ),
	] );

	?>

<?php endif; ?>


<?php if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) : ?>
	<p class="no-comments"><?php echo esc_html( __( 'Comments are closed.', 'benenson' ) ); ?></p>
<?php endif; ?>

<?php

comment_form( [
	'class_submit'  => 'btn',
	'comment_field' => implode( '', [
		'<p class="comment-form-comment">',
		'<label for="comment">',
		_x( 'Comment', 'noun', 'benenson' ),
		'</label><br>',
		'<textarea id="comment" name="comment" cols="45" rows="8" maxlength="65525" required="required"></textarea>',
		'</p>',
	] ),
] );

?>
</div>
