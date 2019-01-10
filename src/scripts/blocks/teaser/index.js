import classNames from 'classnames';
import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;
const { Component, Fragment } = wp.element;
const {
  MediaPlaceholder, MediaUpload, BlockControls, RichText,
} = wp.editor;
const {
  Button, Toolbar, IconButton,
} = wp.components;

registerBlockType('benenson/block-teaser', {
  title: __('Teaser', 'benenson'),
  description: __('Teaser block, usually links through to a page with more information.', 'benenson'),
  icon: 'download',
  category: 'benenson',
  supports: {
    className: false,
  },

  attributes: {
    imageTitle: {
      type: 'string',
    },
    imageUrl: {
      type: 'string',
    },
    imageId: {
      type: 'integer',
    },
    title: {
      type: 'string',
    },
    content: {
      type: 'string',
    },
    linkText: {
      type: 'string',
    },
    linkUrl: {
      type: 'string',
    },
  },

  edit: DisplayComponent,

  // Returns null due to the component being rendered server side
  save: () => null,
});
