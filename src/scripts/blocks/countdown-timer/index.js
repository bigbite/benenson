import classnames from 'classnames';
import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Component, Fragment } = wp.element;
const {
  InspectorControls, RichText,
} = wp.editor;
const {
  PanelBody, Button, DateTimePicker, ColorPicker,
} = wp.components;

const { PostMediaSelector } = benenson.components;

registerBlockType('benenson/block-countdown', {
  title: __('Countdown Timer', 'benenson'),
  description: __('Set a future date to countdown to.', 'benenson'),
  icon: 'download',
  category: 'benenson',
  supports: {
  },

  attributes: {
    countdownId: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    date: {
      type: 'string',
    },
    revealTitle: {
      type: 'string',
    },
    revealContent: {
      type: 'string',
    },
    revealBtnText: {
      type: 'string',
    },
    revealBtnUrl: {
      type: 'string',
    },
    backgroundColor: {
      type: 'string',
    },
    backgroundId: {
      type: 'interger',
    },
    backgroundUrl: {
      type: 'string',
    },
    textColor: {
      type: 'string',
    },
    hideTimer: {
      type: 'boolean',
    },
  },
  edit: DisplayComponent,

  // Returns null due to the component being rendered server side
  save: () => null,
});
