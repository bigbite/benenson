<?php

if ( function_exists( 'benenson_render_google_map_block' ) ) {
	return;
}

function benenson_render_google_map_block( array $attributes = [] ) {
	if ( ! isset( $attributes['zoomLevel'] ) ) {
		$attributes['zoomLevel'] = 8;
	}

	if ( ! isset( $attributes['disableUserZoom'] ) ) {
		$attributes['disableUserZoom'] = false;
	}

	$map_hash = sprintf( 'map%s', bin2hex( openssl_random_pseudo_bytes( 5 ) ) );

	$open_iife  = '(function(){';
	$close_iife = '}());';

	$lat_lng = vsprintf( '{lat:%s,lng:%s}', [
		esc_attr( $attributes['latitude'] ),
		esc_attr( $attributes['longitude'] ),
	] );

	$map_options = vsprintf( '{zoom:%s,scrollwheel:%s,center:%s}', [
		esc_attr( $attributes['zoomLevel'] ),
		esc_attr( $attributes['disableUserZoom'] ? 'false' : 'true' ),
		$lat_lng,
	] );

	$map_object = vsprintf( 'var %1$s = new google.maps.Map(document.getElementById("%1$s"),%2$s);', [
		esc_attr( $map_hash ),
		$map_options,
	] );

	$map_marker = '';
	if ( ! isset( $attributes['showMarker'] ) || true === $attributes['showMarker'] ) {
		$map_marker = vsprintf( 'new google.maps.Marker({map:%s,position:%s})', [
			esc_attr( $map_hash ),
			$lat_lng,
		] );
	}

	$javascript = $open_iife . $map_object . $map_marker . $close_iife;

	wp_enqueue_script( 'google-maps-api' );
	wp_add_inline_script( 'google-maps-api', $javascript );

	return sprintf( '<div id="%s" class="googleMaps-container"></div>', esc_attr( $map_hash ) );
}
