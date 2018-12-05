<form class="page-search" action="<?php echo esc_url( home_url( '/' ) ); ?>" data-page-search>
	<label for="search" class="u-hiddenVisually"><?php echo esc_html( /* translators: screen reader text for search field */ __( 'Search input', 'benenson' ) ); ?></label>
	<input id="search" type="text" name="s" required role="searchbox" placeholder="<?php esc_attr_e( 'What are you looking for?', 'benenson' ); ?>" value="<?php echo esc_attr( get_query_var( 's' ) ); ?>">
	<button class="btn btn--dark" type="submit"><?php esc_attr_e( 'Search', 'benenson' ); ?></button>
</form>
