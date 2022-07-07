/**
 * Third-party
 */
import classnames from 'classnames';
import pick from 'lodash-es/pick';

/**
 * WordPress
 */
const { __ } = wp.i18n;
const { Component, createRef, Fragment } = wp.element;
const { applyFilters } = wp.hooks;
const {
  Button,
  CheckboxControl,
  PanelBody,
  SelectControl,
} = wp.components;
const {
  InspectorControls,
  MediaUpload,
} = wp.editor;

export default class DisplayComponent extends Component {
  constructor(...params) {
    super(...params);

    this.bigTextRef = createRef();
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
    const { imageID } = attributes;

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
    const { attributes, setAttributes } = this.props;
    const {
      style = 'icon',
      iconSize = 'small',
      uncredited = false,
    } = attributes;

    const sizeOptions = applyFilters('benenson.block.logoGroup.sizeOptions', [{
      label: __('Small', 'benenson'),
      value: 'small',
    }, {
      label: __('Medium', 'benenson'),
      value: 'medium',
    }, {
      label: __('Large', 'benenson'),
      value: 'large',
    }]);

    if (style !== 'icon') {
      return (<div className="logoList">{ this.getOptionalField() }</div>);
    }

    return (<Fragment>
      <InspectorControls>
        <PanelBody>
          <SelectControl
            label={ __('Icon Size', 'benenson') }
            value={ iconSize }
            onChange={ newSize => setAttributes({ iconSize: newSize }) }
            options={ sizeOptions }
          />
          <CheckboxControl
            label={ __('Hide Image Credit Display', 'benenson') }
            checked={ uncredited }
            onChange={ newCredit => setAttributes({ uncredited: newCredit }) }
          />
        </PanelBody>
      </InspectorControls>
      <div className="logoList">
        { this.getOptionalField() }
      </div>
    </Fragment>);
  }
}
