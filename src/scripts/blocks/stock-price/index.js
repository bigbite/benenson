import classnames from 'classnames';
import assign from 'lodash-es/assign';
import isEmpty from 'lodash-es/isEmpty';
import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;
const { RichText } = wp.editor;
const {
  join,
  split,
  create,
  toHTMLString,
} = wp.richText;

const blockAttributes = {
  preheading: {
    type: 'array',
  },
  title: {
    type: 'string',
  },
  content: {
    type: 'array',
  },
  ctaLink: {
    type: 'string',
  },
  ctaText: {
    type: 'array',
  },
  background: {
    type: 'string',
  },
  style: {
    type: 'string',
  },
  stocksymbol: {
    type: 'string',
  },
};

registerBlockType('benenson/block-stock-price', {
  title: __('Stock Price', 'benenson'),
  icon: 'megaphone',
  category: 'benenson',
  keywords: [
    __('Stock', 'benenson'),
  ],
  supports: {
    className: false,
    multiple: true,
  },
  attributes: blockAttributes,

  edit: DisplayComponent,

  save: ({ attributes }) => {
    const {
      background = false,
      style = false,
      stocksymbol,
      preheading,
      title,
      content,
      ctaLink,
      ctaText,
    } = attributes;


    return (<div className="stock-price">
      <h3>{ attributes.stocktitle }</h3>
      <h3>{ attributes.stocksymbol }</h3>
    </div>
    );
  },
});
