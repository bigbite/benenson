/**
 * Third-party
 */
import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import pick from 'lodash-es/pick';

/**
 * WordPress
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
  Button,
  CheckboxControl,
  PanelBody,
  RangeControl,
  SelectControl,
} = wp.components;
const {
  InspectorControls,
  InnerBlocks,
  MediaUpload,
  MediaUploadCheck,
  RichText,
  URLInputButton,
} = wp.editor;

/**
 * Module-specific
 */
// because I can't do maths :(
const sizeMap = {
  // <6: 120
  6: 116,
  7: 112,
  8: 108,
  9: 104,
  10: 100,
  11: 96,
  12: 92,
  13: 88,
  14: 84,
  15: 80,
  16: 76,
  17: 72,
  18: 68,
  19: 64,
  // >19: 60
};

export default class BlockEdit extends Component {
  constructor(...params) {
    super(...params);

    this.bigTextRef = React.createRef();
  }

  getImageButton = (openEvent) => {
    const { attributes } = this.props;
    const { imageID, imageData, iconSize = 'small' } = attributes;

    if (imageID && imageData) {
      const imgClasses = classnames('logoList-imageWrapper', {
        [`is-${iconSize}`]: iconSize !== 'small',
      });

      let src = imageData.full.url;
      if (Object.prototype.hasOwnProperty.call(imageData, 'logo-block')) {
        src = imageData['logo-block'].url;
      }

      return (<div className={ imgClasses }>
        <img
          className="logoList--image"
          src={ src }
          onClick={ openEvent }
        />
      </div>);
    }

    return (<div className="logoList-uploadContainer">
      <Button className="button button-large" onClick={ openEvent }>{ __('Pick an image', 'benenson') }</Button>
    </div>);
  }

  getOptionalField = () => {
    const { attributes, setAttributes } = this.props;
    const {
      style = 'icon',
      underlined = false,
      imageID,
      imageAlt,
      imageURL,
      bigtext,
      bigTextCss,
    } = attributes;


    return (<MediaUpload
      className="logoList-upload"
      allowedTypes={ ['image'] }
      value={ imageID }
      render={ ({ open }) => this.getImageButton(open) }
      onSelect={ media => setAttributes({
        imageID: media.id,
        imageAlt: media.alt,
        imageData: pick(media.sizes, [
          'logo-block',
          'full',
          'lwi-block-sm',
          'lwi-block-md',
          'lwi-block-lg',
          'lwi-block-sm@2x',
          'lwi-block-md@2x',
          'lwi-block-lg@2x',
        ]),
      }) }
    />);
  }

  render() {
    const { attributes, setAttributes, className } = this.props;
    const {
      style = 'icon',
      hasButton = true,
      iconSize = 'small',
      underlined = false,
      uncredited = false,
      title,
      body,
      buttonText,
      buttonLink,
    } = attributes;

    return (<Fragment>
      <InspectorControls>
        <PanelBody>
          { style === 'icon' && <SelectControl
            label={ __('Icon Size', 'benenson') }
            value={ iconSize }
            onChange={ newSize => setAttributes({ iconSize: newSize }) }
            options={ [
              { value: 'small', label: __('Small', 'benenson') },
              { value: 'medium', label: __('Medium', 'benenson') },
              { value: 'large', label: __('Large', 'benenson') },
            ] }
          /> }
          { style === 'icon' && <CheckboxControl
            label={ __('Hide Image Credit Display', 'benenson') }
            checked={ uncredited }
            onChange={ newCredit => setAttributes({ uncredited: newCredit }) }
          /> }
        </PanelBody>
      </InspectorControls>
      <div className="logoList">
        { this.getOptionalField() }
      </div>
    </Fragment>);
  }
}
