import assign from 'lodash-es/assign';
import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const blockAttributes = {
  type: {
    type: 'string',
    default: 'category',
  },
  style: {
    type: 'string',
    default: 'list',
  },
  category: {
    type: 'string',
  },
  categoryRelated: {
    type: 'boolean',
  },
  displayExcerpt: {
    type: 'boolean',
  },
  displayFeatureImage: {
    type: 'boolean',
  },
  amount: {
    type: 'integer',
  },
  ctaText: {
    type: 'string',
  },
  custom: {
    type: 'array',
  },
  selectedPosts: {
    type: 'array',
  },
};

registerBlockType('benenson/block-list', {
  title: __('Post List', 'benenson'),
  icon: 'admin-post',
  category: 'benenson',
  keywords: [
    __('List', 'benenson'),
    __('post-list', 'benenson'),
    __('Posts', 'benenson'),
  ],
  supports: {
    multiple: true,
  },
  attributes: blockAttributes,

  deprecated: [{
    attributes: blockAttributes,
    save: () => null,
  },
  ],

  edit: DisplayComponent,

  // Returns null due to the component being rendered server side
  save: () => null,
});
