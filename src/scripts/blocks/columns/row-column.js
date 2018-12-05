/**
 * WordPress
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;

registerBlockType('benenson/block-row-column', {
  title: __('Row Column', 'benenson'),
  description: '',
  icon: 'plus',
  category: 'layout',
  parent: ['benenson/block-row'],
  supports: {
    className: false,
  },
  attributes: {
    size: {
      type: 'string',
    },
  },
  edit() {
    return <div className="rowColumn"><InnerBlocks templateLock={ false } /></div>;
  },

  save() {
    return <div className="rowColumn"><InnerBlocks.Content /></div>;
  },
});
