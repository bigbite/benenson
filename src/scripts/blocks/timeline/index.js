import assign from 'lodash-es/assign';
import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

registerBlockType('benenson/timeline', {
  title: __('Timeline', 'benenson'),
  icon: 'admin-post',
  category: 'benenson',
  keywords: [
    __('Timeline', 'benenson'),
  ],
  supports: {
    multiple: true,
  },
  attributes: {
    timelineId: {
      type: 'string',
    },
    blocks: {
      type: 'array',
      default: [],
    },
    hasArrows: {
      type: 'boolean',
      default: true,
    },
    showTabs: {
      type: 'boolean',
      default: true,
    },
    hasContent: {
      type: 'boolean',
      default: true,
    },
  },

  edit: DisplayComponent,

  // Returns null due to the component being rendered server side
  save: () => null,
});
