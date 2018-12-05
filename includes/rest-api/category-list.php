<?php

if ( class_exists( 'Benenson_Core_Category_List' ) ) {
	return new Benenson_Core_Category_List();
}

class Benenson_Core_Category_List {

	protected $results = [];

	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'register' ] );
	}

	public function register() {
		register_rest_route( 'benenson/v1', 'categories', [
			'methods'  => [ 'GET' ],
			'callback' => [ $this, 'get' ],
		] );
	}

	public function get( WP_REST_Request $request = null ) {
		$this->results = get_terms( [
			'taxonomy'   => 'category',
			'hide_empty' => false,
			'number'     => 0,
		] );

		return $this->sort();
	}

	protected function sort( $parent = 0 ) {
		$kids = array_values( array_filter( $this->results, function( $item ) use ( $parent ) {
			return $item->parent === $parent;
		} ) );

		$sorted = [];

		foreach ( $kids as $kid ) {
			$sorted[] = $kid;
			$sorted   = array_merge( $sorted, $this->sort( $kid->term_id ) );
		}

		return $sorted;
	}

}
