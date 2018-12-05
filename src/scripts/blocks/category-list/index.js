import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

registerBlockType('benenson/block-category-list', {
  title: __('Category List', 'benenson'),
  icon: 'list-view',
  category: 'benenson',
  keywords: [
    __('Categories', 'benenson'),
    __('Term', 'benenson'),
    __('Taxonomy', 'benenson'),
  ],
  attributes: {
    title: {
      type: 'string',
    },
    maximum: {
      type: 'string',
    },
  },

  edit: DisplayComponent,

  // Returns null due to the component being rendered server side
  save: () => null,
});
