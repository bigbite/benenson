<?php

/**
 * Processes each post/page to return the the correct data format for our render function.
 *
 * @param WP_Query $query Current WP_Query.
 * @return array|bool
 */
if ( ! function_exists( 'benenson_list_process_query' ) ) {
	function benenson_list_process_query( $query, $tag_override = false ) {
		$posts = false;

		if ( $query->have_posts() ) {
			$posts = [];

			while ( $query->have_posts() ) {
				$query->the_post();
				if ( ! $tag_override ) {
					$tag  = false;
					$tags = benenson_get_post_terms( get_the_ID() );

					if ( count( $tags ) > 0 ) {
						$tag = array_shift( $tags );
					}
				} else {
					$tag = $tag_override;
				}

				$posts[] = [
					'title'          => get_the_title(),
					'link'           => get_the_permalink(),
					'tag'            => $tag ? $tag->name : false,
					'tag_link'       => $tag ? get_term_link( $tag, $tag->taxonomy ) : false,
					'featured_image' => benenson_featured_image( get_the_ID(), 'grid-item' ),
					'excerpt'        => get_the_excerpt(),
				];
			}

			wp_reset_postdata();
		}

		return $posts;
	}
}

/**
 * Process the attributes for the current block for the category type.
 *
 * @param array $attributes Current Block attributes.
 * @return array|bool
 */
if ( ! function_exists( 'benenson_list_process_category' ) ) {
	function benenson_list_process_category( $attributes ) {
		if ( empty( $attributes ) || ! isset( $attributes['category'] ) || ! $attributes['category'] ) {
			return false;
		}

		if ( empty( $attributes ) || ! isset( $attributes['amount'] ) || ! $attributes['amount'] ) {
			$amount = 3;
		}

		$category = json_decode( $attributes['category'] );

		$category__in = [];
		if ( is_object( $category ) ) {
			// deprecated variant
			$category__in = [ $category->value ];
		} elseif ( is_array( $category ) ) {
			$category__in = array_map( function( $category ) {
				return $category->value;
			}, $category );
		}

		if ( empty( $category__in ) ) {
			return [];
		}

		$post_categories = false;

		if ( ! empty( $attributes['categoryRelated'] ) && is_singular( 'post' ) ) {
			$post_categories = array_map( function( $term ) {
				return $term->term_id;
			}, wp_get_post_terms( get_queried_object_id(), 'category' ) );
		}

		$category_override = false;

		if ( $post_categories ) {
			$category__in = $post_categories;
		} else {
			$category_override = get_term( $category__in[0] );
		}

		$amount = isset( $amount ) ? $amount : $attributes['amount'];

		$query = new WP_Query( [
			'category__in'   => $category__in,
			'post__not_in'   => [ get_the_ID() ],
			'posts_per_page' => $amount,
			'no_found_rows'  => true,
		] );

		return benenson_list_process_query( $query, $category_override );
	}
}

/**
 * Process the attributes for the current block for the custom type.
 *
 * @param array $attributes Current Block attributes.
 * @return array|bool
 */
if ( ! function_exists( 'benenson_list_process_custom' ) ) {
	function benenson_list_process_custom( $attributes ) {
		if ( empty( $attributes ) || ! isset( $attributes['custom'] ) || ! $attributes['custom'] ) {
			return false;
		}

		return array_map( function( $array ) {
			$featured_image = '';

			if ( isset( $array['featured_image_id'] ) && $array['featured_image_id'] ) {
				$featured_image = wp_get_attachment_image_url( $array['featured_image_id'], 'grid-item' );
			}

			return [
				'title'          => isset( $array['title'] ) ? $array['title'] : false,
				'link'           => isset( $array['titleLink'] ) ? $array['titleLink'] : false,
				'tag'            => isset( $array['tagText'] ) ? $array['tagText'] : false,
				'tag_link'       => isset( $array['tagLink'] ) ? $array['tagLink'] : false,
				'featured_image' => $featured_image,
				'excerpt'        => isset( $array['excerpt'] ) ? $array['excerpt'] : false,
			];

		}, $attributes['custom'] );
	}
}

/**
 * Process the attributes for the current block for the object selection type.
 *
 * @param array $attributes Current Block attributes.
 * @return array|bool
 */
if ( ! function_exists( 'benenson_list_process_select' ) ) {
	function benenson_list_process_select( $attributes ) {
		if ( empty( $attributes ) || ! isset( $attributes['selectedPosts'] ) || ! $attributes['selectedPosts'] ) {
			return false;
		}

		$post_types = get_post_types( [
			'public' => true,
		] );

		$query = new WP_Query( [
			'post__in'      => $attributes['selectedPosts'],
			'post_type'     => $post_types,
			'no_found_rows' => true,
		] );

		return benenson_list_process_query( $query );
	}
}

/**
 * Process the current attributes by calling the specific function dependant on block type.
 *
 * @param array $attributes Current block attributes.
 * @return array|bool
 */
if ( ! function_exists( 'benenson_list_process_content' ) ) {
	function benenson_list_process_content( $attributes ) {
		if ( empty( $attributes['type'] ) ) {
			return benenson_list_process_category( $attributes );
		}

		switch ( $attributes['type'] ) {
			case 'custom':
				return benenson_list_process_custom( $attributes );
			case 'category':
				return benenson_list_process_category( $attributes );
			case 'select':
				return benenson_list_process_select( $attributes );
			default:
				return benenson_list_process_category( $attributes );
		}
	}
}

/**
 * Render the current block item as a list item.
 *
 * @param array $data Item data.
 */
if ( ! function_exists( 'benenson_render_list_item' ) ) {
	function benenson_render_list_item( $data ) {
		$title = isset( $data['title'] ) ? $data['title'] : '';
		?>
		<li>
			<article class="linkList-item" role="article" aria-label="Article: <?php echo esc_attr( format_for_aria_label( $title ) ); ?>">
			<?php if ( ! empty( $data['link'] ) ) : ?>
				<a class="floating-anchor" href="<?php echo esc_url( $data['link'] ); ?>" aria-hidden="true"></a>
			<?php endif; ?>

			<?php if ( ! empty( $data['tag'] ) ) : ?>
				<span class="linkList-itemMeta">
				<?php
				if ( ! empty( $data['tag_link'] ) ) {
					printf( '<a href="%s" tabindex="0">%s</a>', esc_url( $data['tag_link'] ), esc_html( $data['tag'] ) );
				} else {
					echo esc_html( $data['tag'] );
				}
				?>
				</span>
			<?php endif; ?>

			<?php if ( $title ) : ?>
				<h3 class="linkList-itemTitle">
				<?php
				if ( ! empty( $data['link'] ) ) {
					printf( '<a href="%s" tabindex="0">%s</a>', esc_url( $data['link'] ), esc_html( $title ) );
				} else {
					echo esc_html( $title );
				}
				?>
				</h3>
			<?php endif; ?>
			</article>
		</li>
		<?php
	}
}

/**
 * Render the current block item as a grid item.
 *
 * @param array $data Item data.
 * @return string
 */
if ( ! function_exists( 'benenson_render_grid_item' ) ) {
	function benenson_render_grid_item( $data ) {
		spaceless();
		$title         = isset( $data['title'] ) ? $data['title'] : '';
		$feature_image = $data['featured_image'];
		?>
		<article class="grid-item" role="article" aria-label="Article: <?php echo esc_attr( format_for_aria_label( $title ) ); ?>" style="background-image: url(<?php echo esc_url( $feature_image ); ?>)" tabindex="0">
		<?php if ( ! empty( $data['link'] ) ) : ?>
			<a class="floating-anchor" href="<?php echo esc_url( $data['link'] ); ?>" aria-hidden="true"></a>
		<?php endif; ?>

			<div class="grid-content">
			<?php if ( ! empty( $data['tag'] ) ) : ?>
				<span class="grid-itemMeta">
				<?php
				if ( ! empty( $data['tag_link'] ) ) {
					printf( '<a href="%s" tabindex="0">%s</a>', esc_url( $data['tag_link'] ), esc_html( $data['tag'] ) );
				} else {
					echo esc_attr( $data['tag'] );
				}
				?>
				</span>
			<?php endif; ?>

			<?php if ( $title ) : ?>
				<h3 class="grid-itemTitle">
				<?php
				if ( ! empty( $data['link'] ) ) {
					printf( '<a href="%s" tabindex="0">%s</a>', esc_url( $data['link'] ), esc_html( $title ) );
				} else {
					printf( '<span>%s</span>', esc_html( $title ) );
				}
				?>
				</h3>
			<?php endif; ?>
			</div>
		</article>
		<?php
		endspaceless();
	}
}

/**
 * Render the current block item as a grid item.
 *
 * @param array $data Item data.
 * @return string
 */
if ( ! function_exists( 'benenson_render_post_item' ) ) {
	function benenson_render_post_item( $data ) {
		$title   = isset( $data['title'] ) ? $data['title'] : '';
		$excerpt = isset( $data['excerpt'] ) ? $data['excerpt'] : '';

		?>
		<article class="postGrid-item" role="article" aria-label="Article: <?php echo esc_attr( format_for_aria_label( $title ) ); ?>" tabindex="0">

		<?php if ( ! empty( $data['link'] ) ) : ?>
			<a class="floating-anchor" href="<?php echo esc_url( $data['link'] ); ?>" aria-hidden="true"></a>
		<?php endif; ?>

			<div class="postGrid-content">
			<?php if ( $title ) : ?>
				<h3 class="postGrid-itemTitle">
				<?php
				if ( ! empty( $data['link'] ) ) {
					printf( '<a href="%s" tabindex="0">%s</a>', esc_url( $data['link'] ), esc_html( $title ) );
				} else {
					printf( '<span>%s</span>', esc_html( $title ) );
				}
				?>
				</h3>
			<?php endif; ?>

			<?php
			if ( $excerpt ) {
				if ( ! empty( $data['link'] ) ) {
					printf( '<a href="%s" tabindex="0">%s</a>', esc_url( $data['link'] ), esc_html( $excerpt ) );
				} else {
					printf( '<span>%s</span>', esc_html( $excerpt ) );
				}
			}
			?>
				<div class="postGrid-item-meta">
					<?php if ( ! empty( $data['tag'] ) ) : ?>
						<span class="postGrid-item-tag ">
						<?php
						if ( ! empty( $data['tag_link'] ) ) {
							printf( '<a href="%s" tabindex="0">%s</a>', esc_url( $data['tag_link'] ), esc_html( $data['tag'] ) );
						} else {
							echo esc_attr( $data['tag'] );
						}
						?>
						</span>
					<?php endif; ?>
				</div>
			</div>
		</article>
		<?php
	}
}

/**
 * Render the list item block.
 *
 * @param array $attributes Current block attributes.
 * @return string
 */
if ( ! function_exists( 'benenson_render_list_block' ) ) {
	function benenson_render_list_block( $attributes ) {
		// Prevent a bug in the admin panel where the editor
		// shows a different post if the list item is selected
		// using one of the selection methods.
		if ( is_admin() ) {
			return '';
		}

		if ( doing_filter( 'get_the_excerpt' ) ) {
			return false;
		}

		$data = benenson_list_process_content( $attributes );

		if ( ! $data ) {
			return '';
		}

		ob_start();

		if ( isset( $attributes['style'] ) && 'grid' === $attributes['style'] ) {
			printf( '<div class="grid grid-%s">', esc_attr( count( $data ) ) );
			array_map( 'benenson_render_grid_item', $data );
			print '</div>';

			return ob_get_clean();
		}

		if ( isset( $attributes['style'] ) && 'post' === $attributes['style'] ) {
			printf( '<div class="grid grid-%s">', esc_attr( count( $data ) ) );
			array_map( 'benenson_render_post_item', $data );
			print '</div>';

			return ob_get_clean();
		}

		print '<ul class="linkList">';
		array_map( 'benenson_render_list_item', $data );
		print '</ul>';

		return ob_get_clean();
	}
}
