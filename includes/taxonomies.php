<?php

/**
 * A more performant version of wp_get_object_terms.
 *
 * @since 1.0.0
 * @param int $post_id The post whose terms are to be retrieved
 * @return array
 */
if ( ! function_exists( 'benenson_get_post_terms' ) ) {
	function benenson_get_post_terms( $post_id = 0 ) {
		$cached = wp_cache_get( sprintf( 'benenson_get_post_terms_%s', $post_id ) );

		if ( $cached ) {
			return $cached;
		}

		global $wpdb;

		// phpcs:ignore
		$terms = $wpdb->get_results( $wpdb->prepare(
			"SELECT term.*, tax.* FROM {$wpdb->terms} AS term
			INNER JOIN {$wpdb->term_taxonomy} AS tax ON term.term_id = tax.term_id
			INNER JOIN {$wpdb->term_relationships} AS rel ON tax.term_taxonomy_id = rel.term_taxonomy_id
			WHERE rel.object_id = %d
			AND tax.taxonomy IN (%s, %s)
			AND tax.count > 0",
			$post_id,
			'category', 'post_tag'
		) );

		$terms = array_map( function( $t ) {
			return new WP_Term( $t );
		}, $terms );

		wp_cache_set( sprintf( 'benenson_get_post_terms_%s', $post_id ), $terms );

		return $terms;
	}
}

/**
 * Determine the topmost parent of a term.
 *
 * @since 1.0.0
 * @param int    $term_id  The term to find the elder for.
 * @param string $taxonomy The taxonomy to which the term belongs.
 * @return WP_Term
 */
if ( ! function_exists( 'get_term_top_most_parent' ) ) {
	function get_term_top_most_parent( $term_id, $taxonomy = 'category' ) {
		// start from the current term
		$parent = get_term_by( 'id', $term_id, $taxonomy );

		// climb up the hierarchy until we reach a term with parent = 0
		while ( 0 !== $parent->parent ) {
			$term_id = $parent->parent;
			$parent  = get_term_by( 'id', $term_id, $taxonomy );
		}

		return $parent;
	}
}

/**
 * Check if a specified term is a parent of a specified term.
 *
 * @since 1.0.0
 * @param int    $current_id The prospective child term.
 * @param int    $parent_id  The prospective parent term.
 * @param string $taxonomy   The term taxonomy.
 * @return boolean
 */
if ( ! function_exists( 'determine_if_term_is_parent' ) ) {
	function determine_if_term_is_parent( $current_id, $parent_id, $taxonomy = 'category' ) {
		if ( ! $current_id ) {
			return false;
		}

		if ( $current_id === $parent_id ) {
			return true;
		}

		$current = get_term_by( 'id', $current_id, $taxonomy );

		if ( 0 === $current->parent ) {
			return false;
		}

		$parent = get_term_by( 'id', $current->parent, $taxonomy );

		if ( $parent->term_id === $parent_id ) {
			return true;
		}

		while ( 0 !== $parent->parent ) {
			if ( $parent->term_id === $parent_id ) {
				return true;
			}

			$parent = get_term_by( 'id', $parent->parent, $taxonomy );
		}

		if ( $parent->term_id === $parent_id ) {
			return true;
		}

		return false;
	}
}

/**
 * Check whether the queried object is a category.
 *
 * @since 1.0.0
 * @param WP_Term $cat The category to check.
 * @return bool
*/
if ( ! function_exists( 'is_current_category' ) ) {
	function is_current_category( WP_Term $cat ) {
		return is_category( $cat->term_id ) || determine_if_term_is_parent( get_queried_object_id(), $cat->term_id );
	}
}

/**
 * Print an <option/> for a category item.
 *
 * @since 1.0.0
 * @param WP_Term $cat The category to print.
 * @return void
 */
if ( ! function_exists( 'print_category_option' ) ) {
	function print_category_option( WP_Term $cat ) {
		printf(
			'<option value="%s" %s>%s</option>',
			esc_attr( get_term_link( $cat ) ),
			esc_attr( is_current_category( $cat ) ? 'selected' : '' ),
			esc_html( $cat->name )
		);
	}
}

/**
 * Retrieve a term's parent term.
 *
 * @since 1.0.0
 * @param WP_Term $term the child term
 * @return WP_Term
 */
if ( ! function_exists( 'get_term_parent' ) ) {
	function get_term_parent( WP_Term $term ) {
		if ( ! has_term_parent( $term ) ) {
			return $term;
		}

		return get_term( $term->parent, $term->taxonomy );
	}
}

/**
 * Checks whether a term has a parent.
 *
 * @since 1.0.0
 * @param WP_Term $term the term to check
 * @return bool
 */
if ( ! function_exists( 'has_term_parent' ) ) {
	function has_term_parent( WP_Term $term ) {
		return 0 !== $term->parent;
	}
}
