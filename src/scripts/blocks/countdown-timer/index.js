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
  title: __('Countdown timer', 'benenson'),
  description: __('Set a future date to countdown to.', 'benenson'),
  icon: 'download',
  category: 'benenson',
  supports: {
  },

  attributes: {
    title: {
      type: 'string',
    },
    date: {
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
  },
  edit: DisplayComponent,

  save({ attributes }) {
    const {
      date = new Date(),
      title = '',
      backgroundColor = '',
      backgroundUrl = '',
      textColor = '',
    } = attributes;

    const styles = {
      backgroundImage: `url('${backgroundUrl}')`,
      backgroundColor,
    };

    const classes = classnames('countdownTimer', {
      [`is-${textColor}`]: !!textColor,
    });

    return (
      <div className={ classes } style={ styles} data-date={ date }>
        <h2 className="countdownTimer-title">{ title }</h2>
        <div className="countdownTimer-items">
          <div className="countdownTimer-item countdownTimer-days">
            <p><span>00</span>{ __('Days', 'benenson') }</p>
          </div>
          <div className="countdownTimer-item countdownTimer-hours">
            <p><span>00</span>{ __('Hours', 'benenson') }</p>
          </div>
          <div className="countdownTimer-item countdownTimer-mins">
            <p><span>00</span>{ __('Minutes', 'benenson') }</p>
          </div>
          <div className="countdownTimer-item countdownTimer-secs">
            <p><span>00</span>{ __('Seconds', 'benenson') }</p>
          </div>
        </div>
      </div>
    );
  },
});
