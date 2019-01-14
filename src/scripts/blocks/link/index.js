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

registerBlockType('benenson/block-link', {
  title: __('Link', 'benenson'),
  description: __('Add a link to section within page, another page or an external URL.', 'benenson'),
  icon: 'download',
  category: 'benenson',
  supports: {
    className: false,
  },

  attributes: {
    linkText: {
      type: 'string',
    },
    linkUrl: {
      type: 'string',
    },
    linkStyle: {
      type: 'string',
    },
    linkIcon: {
      type: 'string',
    },
    linkAlignment: {
      type: 'string',
    },
  },

  edit: DisplayComponent,

  save({ attributes }) {
    return (
      <div className={ attributes.linkAlignment }>
        <a href={ attributes.linkUrl } className={ ['btn', attributes.linkStyle, attributes.linkIcon].join(' ') }>{ attributes.linkText }</a>
      </div>
    );
  },
});
