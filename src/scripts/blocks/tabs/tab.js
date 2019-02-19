import TabEdit from './tabEdit';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;

registerBlockType('benenson/block-tabs-tab', {
  title: __('Tab', 'benenson'),
  description: '',
  icon: 'plus',
  category: 'layout',
  parent: ['benenson/block-tabs'],
  attributes: {
    title: {
      type: 'string',
      default: '',
    },
  },
  edit: TabEdit,

  save() {
    return <div className="tab"><InnerBlocks.Content /></div>;
  },
});
