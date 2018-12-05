import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;

registerBlockType('benenson/header', {
  title: __('Banner', 'benenson'),
  icon: 'format-image',
  category: 'benenson',
  keywords: [
    __('Banner', 'benenson'),
  ],
  supports: {
    className: false,
  },
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
    alignment: {
      type: 'string',
    },
    background: {
      type: 'string',
    },
    size: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    embed: {
      type: 'string',
    },
    imageID: {
      type: 'integer',
    },
    imageURL: {
      type: 'string',
    },
    featuredVideoId: {
      type: 'string',
    },
  },

  transforms: {
    from: [{
      type: 'block',
      isMultiBlock: false,
      blocks: ['benenson/block-hero'],
      transform: attributes => createBlock('benenson/header', attributes),
    }],
    to: [{
      type: 'block',
      isMultiBlock: false,
      blocks: ['benenson/block-hero'],
      transform: attributes => createBlock('benenson/block-hero', attributes),
    }],
  },

  edit: DisplayComponent,

  save: () => null,
});
