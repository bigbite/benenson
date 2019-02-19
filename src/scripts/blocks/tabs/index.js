import classnames from 'classnames';
import DisplayComponent from './DisplayComponent';
import './tab';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, InnerBlocks } = wp.editor;
const { withSelect } = wp.data;

const blockAttributes = {
  tabId: {
    type: 'string',
  },
  tabTitle: {
    type: 'string',
    default: '',
  },
  tabs: {
    type: 'array',
    default: [],
  },
  tabStyle: {
    type: 'string',
    default: '',
  },
  mobileAccordion: {
    type: 'boolean',
    default: true,
  },
};

registerBlockType('benenson/block-tabs', {
  title: __('Tabs', 'benenson'),
  icon: 'welcome-widgets-menus',
  category: 'benenson',
  attributes: blockAttributes,

  edit: withSelect((select, ownProps) => {
    return {
      innerBlocks: select('core/editor').getBlocks(ownProps.clientId),
    };
  })(DisplayComponent),

  save: ({ attributes, className }) => {
    const test = <h1>bob</h1>;
    return (
      <div className="tabs">
        <InnerBlocks.Content />
      </div>
    );
  },
});
