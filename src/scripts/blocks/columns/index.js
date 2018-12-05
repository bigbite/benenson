import classNames from 'classnames';
import assign from 'lodash-es/assign';

import './row-column';
import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;

registerBlockType('benenson/block-row', {
  title: __('Columns', 'benenson'),
  icon: 'editor-insertmore',
  category: 'benenson',
  parent: ['benenson/block-section'],
  keywords: [
    __('Content', 'benenson'),
    __('Row', 'benenson'),
    __('Columns', 'benenson'),
  ],
  attributes: {
    layout: {
      type: 'string',
    },
  },

  edit: DisplayComponent,

  save: ({ attributes }) => {
    const { layout = '1/2|1/2' } = attributes;

    return (<div className={ classNames('row', { [`layout-${layout}`]: true }) }>
      <InnerBlocks.Content />
    </div>);
  },
});
