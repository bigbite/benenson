import classnames from 'classnames';

const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl } = wp.components;
const { RichText, URLInputButton, InspectorControls } = wp.editor;
const { __ } = wp.i18n;

/**
 * This is the component that renders the edit screen in the panel.
 */
class DisplayComponent extends Component {
  /**
    * Higher order component that takes the attribute key,
    * this then returns a function which takes a value,
    * when called it updates the attribute with the key.
    * @param key
    * @returns {function(*): *}
    */
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  render() {
    const { attributes } = this.props;

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <SelectControl
            label={__('Background Style', 'benenson')}
            options={ [{
              label: __('Light', 'benenson'),
              value: '',
            }, {
              label: __('Grey', 'benenson'),
              value: 'shade',
            }] }
            value={ attributes.background }
            onChange={ this.createUpdateAttribute('background') }
          />
          <SelectControl
            label={ __('Button Style', 'benenson') }
            options={ [{
              label: __('Primary (Yellow)', 'benenson'),
              value: '',
            }, {
              label: __('Dark', 'benenson'),
              value: 'dark',
            }, {
              label: __('Light', 'benenson'),
              value: 'white',
            }] }
            value={ attributes.style }
            onChange={ this.createUpdateAttribute('style') }
          />
        </PanelBody>
      </InspectorControls>
      <div className={ classnames('callToAction', { [`callToAction--${attributes.background}`]: attributes.background }) }>
        <RichText
          tagName="h2"
          className="callToAction-preHeading"
          placeholder={ __('(Pre-heading)', 'benenson') }
          formattingControls={ [] }
          value={ attributes.preheading }
          keepPlaceholderOnFocus={ true }
          onChange={ this.createUpdateAttribute('preheading') }
        />
        <RichText
          tagName="h1"
          className="callToAction-heading"
          placeholder={ __('(Heading)', 'benenson') }
          formattingControls={ [] }
          value={ attributes.title }
          keepPlaceholderOnFocus={ true }
          onChange={ this.createUpdateAttribute('title') }
        />
        <RichText
          tagName="p"
          className="callToAction-content"
          placeholder={ __('(Content)', 'benenson') }
          value={ attributes.content }
          keepPlaceholderOnFocus={ true }
          onChange={ this.createUpdateAttribute('content') }
        />
        <div className="callToAction-buttonContainer">
          <div className={ classnames('btn', { [`btn--${attributes.style}`]: attributes.style }) }>
            <RichText
              tagName="span"
              placeholder={ __('(Button Text)', 'benenson') }
              formattingControls={ [] }
              value={ attributes.ctaText }
              keepPlaceholderOnFocus={ true }
              onChange={ this.createUpdateAttribute('ctaText') }
            />
          </div>
          <URLInputButton
            url={ attributes.ctaLink }
            onChange={ this.createUpdateAttribute('ctaLink') }
          />
        </div>
      </div>
    </Fragment>);
  }
}

export default DisplayComponent;
