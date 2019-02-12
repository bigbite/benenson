<?php

if ( class_exists( 'Benenson_Core_Reveal_Content' ) ) {
	return new Benenson_Core_Reveal_Content();
}

class Benenson_Core_Reveal_Content {
	/**
	 * @var string - Api route namespace.
	 */
	private $namespace = 'benenson/v1';

	/**
	 * Benenson_Core_Reveal_Content constructor.
	 */
	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	/**
	 * Register api routes
	 */
	public function register_routes() {
		register_rest_route( $this->namespace, '/reveal-content/(?P<id>\d+)/(?P<ref>\w+)', [
			'callback' => [ $this, 'get_item' ],
			'methods'  => 'GET',
			'args'     => [
				'id' => [
					'validate_callback' => is_numeric( $this ),
				],
			],
		] );
	}

	/**
	 * Return an array containing the menu object and its rendered html.
	 *
	 * @param WP_REST_Request $request - Current Request.
	 * @return array|mixed|WP_REST_Response
	 */
	public function get_item( WP_REST_Request $request ) {
		$object = get_post_field( 'post_content', $request->get_param( 'id' ) );

		if ( ! $object ) {
			return rest_ensure_response(
				new WP_Error( 'rest_invalid_param', 'Content not found', [ 'status' => 404 ] )
			);
		}

		$blocks      = parse_blocks( $object );
		$block_attrs = $this->get_block( $blocks, $request->get_param( 'ref' ) );

		return [
			'attrs' => $block_attrs,
		];
	}

	public function get_block( array $blocks, string $ref ) {
		$value = false;

		foreach ( $blocks as $block ) {
			if ( isset( $block['attrs']['countdownId'] ) && $block['attrs']['countdownId'] === $ref ) {
				$value = $block['attrs'];
			}

			if ( ! empty ( $block['innerBlocks'] ) ) {
				$value = $this->get_block( $block['innerBlocks'], $ref );
			}
		}

		return $value;
	}
}
