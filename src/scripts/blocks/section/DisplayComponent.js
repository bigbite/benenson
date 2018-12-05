import classNames from 'classnames';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl } = wp.components;
const { InspectorControls, InnerBlocks } = wp.editor;

class DisplayComponent extends Component {
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  render() {
    const { attributes } = this.props;

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <SelectControl
            label={ __('Background Colour', 'benenson') }
            options={ [{
              label: __('White', 'benenson'),
              value: '',
            }, {
              label: __('Grey', 'benenson'),
              value: 'grey',
            }] }
            value={ attributes.background }
            onChange={ this.createUpdateAttribute('background') }
          />
          <SelectControl
            label={ __('Padding', 'benenson') }
            options={ [{
              label: __('Normal', 'benenson'),
              value: '',
            }, {
              label: __('Small', 'benenson'),
              value: 'small',
            }, {
              label: __('None', 'benenson'),
              value: 'no-padding',
            }] }
            value={ attributes.padding }
            onChange={ this.createUpdateAttribute('padding') }
          />
          <SelectControl
            label={ __('Width', 'benenson') }
            options={ [{
              label: __('Normal', 'benenson'),
              value: '',
            }, {
              label: __('Narrow', 'benenson'),
              value: 'narrow',
            }, {
              label: __('Wide', 'benenson'),
              value: 'wide',
            }] }
            value={ attributes.width }
            onChange={ this.createUpdateAttribute('width') }
          />
        </PanelBody>
      </InspectorControls>
      <section className={ classNames({
        section: true,
        'section--tinted': attributes.background === 'grey',
        [`section--${attributes.padding}`]: !!attributes.padding,
      }) }>
        <div className="container">
          <InnerBlocks />
        </div>
      </section>
    </Fragment>);
  }
}

export default DisplayComponent;
