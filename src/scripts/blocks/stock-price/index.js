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
  stockExchange: {
    type: 'string',
  },
  stockHigh: {
    type: 'integer',
  },
  stockLow: {
    type: 'integer',
  },
  stockPrice: {
    type: 'integer',
  },
  stockChange: {
    type: 'string',
  },
  lastUpdateTime: {
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

  // Returns null due to the component being rendered server side
  save: () => null,
});
