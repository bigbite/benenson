import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

registerBlockType('benenson/block-responsive-iframe', {
  title: __('Responsive Iframe', 'benenson'),
  icon: 'welcome-widgets-menus',
  category: 'benenson',
  keywords: [
    __('Iframe', 'benenson'),
    __('Responsive', 'benenson'),
    __('Fluid', 'benenson'),
  ],
  attributes: {
    embedUrl: {
      type: 'string',
    },
    height: {
      type: 'string',
      default: 300,
    },
    minHeight: {
      type: 'string',
    },
    width: {
      type: 'string',
      default: 600,
    },
    caption: {
      type: 'string',
    },
  },

  edit: DisplayComponent,

  // Returns null due to the component being rendered server side
  save: () => null,
});
