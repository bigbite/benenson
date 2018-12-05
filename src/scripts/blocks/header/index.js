import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;

registerBlockType('benenson/block-hero', {
  title: __('Header', 'benenson'),
  icon: 'format-image',
  category: 'benenson',
  keywords: [
    __('Header', 'benenson'),
  ],
  supports: {
    multiple: false,
  },
  attributes: {
    title: {
      type: 'string',
      source: 'meta',
      meta: '_hero_title',
    },
    content: {
      type: 'string',
      source: 'meta',
      meta: '_hero_content',
    },
    ctaLink: {
      type: 'string',
      source: 'meta',
      meta: '_hero_cta_link',
    },
    ctaText: {
      type: 'string',
      source: 'meta',
      meta: '_hero_cta_text',
    },
    alignment: {
      type: 'string',
      source: 'meta',
      meta: '_hero_alignment',
    },
    background: {
      type: 'string',
      source: 'meta',
      meta: '_hero_background',
    },
    size: {
      type: 'string',
      source: 'meta',
      meta: '_hero_size',
    },
    type: {
      type: 'string',
      source: 'meta',
      meta: '_hero_type',
    },
    embed: {
      type: 'string',
      source: 'meta',
      meta: '_hero_embed',
    },
    featuredVideoId: {
      type: 'string',
      source: 'meta',
      meta: '_hero_video_id',
    },
  },
  edit: DisplayComponent,

  // Returns null due to the component being rendered server side
  save: () => null,
});
