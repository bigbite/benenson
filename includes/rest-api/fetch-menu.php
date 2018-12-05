<?php

if ( class_exists( 'Benenson_Core_Fetch_Menus' ) ) {
	return new Benenson_Core_Fetch_Menus();
}

/**
 * Class Benenson_Core_Fetch_Menus registers and handles the menu route api.
 */
class Benenson_Core_Fetch_Menus {
	/**
	 * @var string - Api route namespace.
	 */
	private $namespace = 'benenson/v1';

	/**
	 * Benenson_Core_Fetch_Menus constructor.
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
		register_rest_route( $this->namespace, '/menu', [
			'callback' => [ $this, 'get_items' ],
			'methods'  => 'GET',
		] );

		register_rest_route( $this->namespace, '/menu/(?P<id>\d+)', [
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
	 * Return all nav menus in WordPress.
	 *
	 * @param WP_REST_Request $request - Current rest request.
	 * @return array
	 */
	public function get_items( WP_REST_Request $request ) {
		return wp_get_nav_menus();
	}

	/**
	 * Return an array containing the menu object and its rendered html.
	 *
	 * @param WP_REST_Request $request - Current Request.
	 * @return array|mixed|WP_REST_Response
	 */
	public function get_item( WP_REST_Request $request ) {
		$object = wp_get_nav_menu_object( $request->get_param( 'id' ) );

		if ( ! $object ) {
			return rest_ensure_response(
				new WP_Error( 'rest_invalid_param', 'Menu item not found', [ 'status' => 404 ] )
			);
		}

		$rendered = wp_nav_menu( [
			'menu'            => $request->get_param( 'id' ),
			'container'       => false,
			'container_class' => 'menu-{menu slug}-container',
			'container_id'    => '',
			'menu_class'      => 'menu',
			'menu_id'         => 'category_style_menu',
			'echo'            => false,
			'before'          => '',
			'after'           => '',
			'link_before'     => '',
			'link_after'      => '',
			'items_wrap'      => '%3$s',
			'depth'           => 0,
		] );

		return [
			'object'   => $object,
			'rendered' => $rendered,
		];
	}
}
