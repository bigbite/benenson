import classnames from 'classnames';

const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;
const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl, TextControl } = wp.components;
const { InspectorControls, RichText, URLInputButton } = wp.editor;

class DisplayComponent extends Component {
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  render() {
    const { attributes } = this.props;
    const linkClasses = classnames('link', {
      [attributes.linkAlignment]: !!attributes.linkAlignment,
    });

    const styleOptions = applyFilters('benenson.block.link.styleOptions', [{
      label: __('Primary', 'benenson'),
      value: '',
    }, {
      label: __('Primary Outline', 'benenson'),
      value: 'btn--primaryOutline',
    }, {
      label: __('Primary Solid', 'benenson'),
      value: 'btn--primarySolid',
    }]);

    const iconOptions = applyFilters('benenson.block.link.iconOptions', [{
      label: __('None', 'benenson'),
      value: '',
    }, {
      label: __('Up arrow', 'benenson'),
      value: 'icon--upArrow',
    }, {
      label: __('Down arrow', 'benenson'),
      value: 'icon--downArrow',
    }]);

    const alignmentOptions = applyFilters('benenson.block.link.alignmentOptions', [{
      label: __('Left', 'benenson'),
      value: 'u-textLeft',
    }, {
      label: __('Center', 'benenson'),
      value: 'u-textCenter',
    }, {
      label: __('Right', 'benenson'),
      value: 'u-textRight',
    }]);

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <TextControl
            label={ __('Link text', 'benenson') }
            onChange={ this.createUpdateAttribute('linkText') }
            value={ attributes.linkText }
          />
          <TextControl
            label={ __('Link url', 'benenson') }
            onChange={ this.createUpdateAttribute('linkUrl') }
            value={ attributes.linkUrl }
          />
          <SelectControl
            label={ __('Link style', 'benenson') }
            options={ styleOptions }
            value={ attributes.linkStyle }
            onChange={ this.createUpdateAttribute('linkStyle') }
          />
          <SelectControl
            label={ __('Link icon', 'benenson') }
            options={ iconOptions }
            value={ attributes.linkIcon }
            onChange={ this.createUpdateAttribute('linkIcon') }
          />
          <SelectControl
            label={ __('Link alignment', 'benenson') }
            options={ alignmentOptions }
            value={ attributes.linkAlignment }
            onChange={ this.createUpdateAttribute('linkAlignment') }
          />
        </PanelBody>
      </InspectorControls>
      <div className={ linkClasses }>
        <a className={ classnames('btn', attributes.linkStyle, attributes.linkIcon) }>
          <RichText
            tagName="span"
            onChange={ this.createUpdateAttribute('linkText') }
            value={ attributes.linkText }
            placeholder={ __('(Link Text)', 'benenson') }
            keepPlaceholderOnFocus={ true }
            formattingControls={ [] }
            format="string"
          />
          <URLInputButton
            url={ attributes.linkUrl }
            onChange={ this.createUpdateAttribute('linkUrl') }
          />
        </a>
      </div>
    </Fragment>);
  }
}

export default DisplayComponent;
