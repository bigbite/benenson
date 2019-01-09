/**
 * BLOCK: media-aside
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('benenson/media-aside', {
  title: __('Media aside', 'benenson'),
  icon: 'welcome-widgets-menus',
  category: 'benenson',
  supports: {
    className: false,
  },
  keywords: [
    __('Media', 'benenson'),
  ],
  attributes: {
    title: {
      type: 'string',
    },
    content: {
      type: 'string',
    },
    ctaLink: {
      type: 'string',
    },
    ctaText: {
      type: 'string',
    },
    mediaUrl: {
      type: 'string',
    },
    mediaId: {
      type: 'integer',
    },
    embed: {
      type: 'string',
    },
    videoId: {
      type: 'integer',
    },
    modal: {
      type: 'boolean',
    },
  },

  edit: DisplayComponent,

  // Returns null due to the component being rendered server side
  save: () => null,
});
