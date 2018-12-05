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

  componentDidUpdate(props) {
    if (this.props.attributes.style !== 'text') {
      return;
    }

    if (!props.attributes || !props.attributes.bigTextCss) {
      return;
    }

    if (!props.attributes.bigTextCss.fontSize) {
      return;
    }

    if (props.attributes.bigTextCss.fontSize === this.getBigTextStyle().fontSize) {
      return;
    }

    this.props.setAttributes({ bigTextCss: this.getBigTextStyle() });
  }

  getImageButton = (openEvent) => {
    const { attributes } = this.props;
    const { imageID, imageData, iconSize = 'medium' } = attributes;

    if (imageID && imageData) {
      const imgClasses = classnames('linksWithIcons-imageWrapper', {
        [`is-${iconSize}`]: iconSize !== 'medium',
      });

      let src = imageData.full.url;
      if (Object.prototype.hasOwnProperty.call(imageData, 'lwi-block-sm')) {
        src = imageData['lwi-block-sm'].url;
      }

      return (<div className={ imgClasses }>
        <img
          className="linksWithIcons-image"
          src={ src }
          onClick={ openEvent }
        />
      </div>);
    }

    return (<div className="linksWithIcons-uploadContainer">
      <Button className="button button-large" onClick={ openEvent }>{ __('Pick an image', 'benenson') }</Button>
    </div>);
  }

  getBigTextStyle = () => {
    if (!this.bigTextRef.current) {
      return {};
    }

    const { setAttributes } = this.props;
    const node = ReactDOM.findDOMNode(this.bigTextRef.current);
    const { length } = node.innerText;

    const styles = {
      fontSize: '120px',
    };

    // max
    if (length <= 5) {
      return styles;
    }

    if (length > 12) {
      styles.wordBreak = 'break-word';
    }

    // min
    if (length >= 19) {
      styles.fontSize = '60px';

      return styles;
    }

    styles.fontSize = `${sizeMap[length]}px`;

    return styles;
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

    if (style === 'icon') {
      return (<MediaUpload
        className="linksWithIcons-upload"
        allowedTypes={ ['image'] }
        value={ imageID }
        render={ ({ open }) => this.getImageButton(open) }
        onSelect={ media => setAttributes({
          imageID: media.id,
          imageAlt: media.alt,
          imageData: pick(media.sizes, [
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

    if (style === 'text') {
      const txtClasses = classnames('linksWithIcons-bigtext', {
        'has-underline': underlined,
      });

      return (<RichText
        className={ txtClasses }
        placeholder={ __('(Insert Fact)', 'benenson') }
        value={ bigtext }
        formattingControls={ [] }
        keepPlaceholderOnFocus={ true }
        onChange={ newBigtext => setAttributes({ bigtext: newBigtext }) }
        style={ bigTextCss }
        ref={ this.bigTextRef }
      />);
    }

    return '';
  }

  render() {
    const { attributes, setAttributes, className } = this.props;
    const {
      style = 'icon',
      hasButton = true,
      iconSize = 'medium',
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
          <SelectControl
            label={ __('Style', 'benenson') }
            value={ style }
            onChange={ newStyle => setAttributes({ style: newStyle }) }
            options={ [
              { value: 'icon', label: __('Use Image', 'benenson') },
              { value: 'text', label: __('Use Text', 'benenson') },
              { value: 'none', label: __('Plain', 'benenson') },
            ] }
          />
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
          { style === 'text' && <CheckboxControl
            label={ __('Has Underline', 'benenson') }
            checked={ underlined }
            onChange={ newUnderline => setAttributes({ underlined: newUnderline }) }
          /> }
          <CheckboxControl
            label={ __('Display Button', 'benenson') }
            checked={ hasButton }
            onChange={ newHasButton => setAttributes({ hasButton: newHasButton }) }
          />
        </PanelBody>
      </InspectorControls>
      <div className="linksWithIcons">
        <RichText
          className="linksWithIcons-title"
          placeholder={ __('(Insert Title)', 'benenson') }
          value={ title }
          format="string"
          formattingControls={ [] }
          keepPlaceholderOnFocus={ true }
          onChange={ newTitle => setAttributes({ title: newTitle }) }
        />
        { this.getOptionalField() }
        <RichText
          className="linksWithIcons-body"
          placeholder={ __('(Insert Body Text)', 'benenson') }
          value={ body }
          format="string"
          formattingControls={ [] }
          keepPlaceholderOnFocus={ true }
          onChange={ newBody => setAttributes({ body: newBody }) }
        />
        { hasButton && <div className="linksWithIcons-buttonWrapper">
          <RichText
            className="btn btn--white"
            tagName="span"
            placeholder={ __('(Insert Link Text)', 'benenson') }
            value={ buttonText }
            format="string"
            formattingControls={ [] }
            keepPlaceholderOnFocus={ true }
            onChange={ newText => setAttributes({ buttonText: newText }) }
          />
          <URLInputButton
            url={ buttonLink }
            onChange={ newLink => setAttributes({ buttonLink: newLink }) }
          />
        </div> }
      </div>
    </Fragment>);
  }
}
