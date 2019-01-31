import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Component, Fragment } = wp.element;

registerBlockType('benenson/google-map', {
  title: __('Google Map', 'benenson'),
  description: __('Add a Google Map', 'benenson'),
  icon: 'location',
  category: 'benenson',
  supports: {
    className: false,
  },

  attributes: {
    showMarker: {
      type: 'boolean',
      default: true,
    },
    useCoords: {
      type: 'boolean',
      default: false,
    },
    zoomLevel: {
      type: 'number',
      default: 8,
    },
    inputType: {
      type: 'boolean',
      default: 'latlng',
    },
    latitude: {
      type: 'number',
      default: 54.579915,
    },
    longitude: {
      type: 'number',
      default: -1.2364232,
    },
    address: {
      type: 'string',
      default: '',
    },
  },

  edit: DisplayComponent,

  save: () => null,
});
