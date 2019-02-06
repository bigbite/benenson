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
	 * Validate that a parameter is numeric.
	 *
	 * @param mixed $param - Paramater to check,
	 * @return bool
	 */
	public function validate_numeric( $param ) {
		return is_numeric( $param );
	}

	/**
	 * Register api routes
	 */
	public function register_routes() {
		register_rest_route( $this->namespace, '/reveal-content/(?P<id>\d+)', [
			'callback' => [ $this, 'get_item' ],
			'methods'  => 'GET',
			'args'     => [
				'id' => [
					'validate_callback' => [ $this, 'validate_numeric' ],
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
		$object = get_post_field('post_content', $request->get_param( 'id' ));

		if ( ! $object ) {
			return rest_ensure_response(
				new WP_Error( 'rest_invalid_param', 'Content not found', [ 'status' => 404 ] )
			);
		}

		return [
			'test'  => 'test',
		];
	}
}
