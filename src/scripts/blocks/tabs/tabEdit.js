import classnames from 'classnames';

const randId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { applyFilters } = wp.hooks;
const {
  PanelBody, Button, TextControl, ToggleControl, SelectControl,
} = wp.components;

const {
  InspectorControls, RichText, BlockIcon, URLInputButton, InnerBlocks,
} = wp.editor;

const { PostMediaSelector } = benenson.components;

class TabEdit extends Component {
  render() {
    const { attributes, setAttributes } = this.props;

    const controls = (
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <TextControl
            label={ __('Tab title', 'benenson') }
            value={ attributes.title }
            onChange={ title => setAttributes({ title }) }
          />
        </PanelBody>
      </InspectorControls>
    );

    return (
      <Fragment>
        { controls }
        <div className="tab"><InnerBlocks/></div>
      </Fragment>
    );
  }
}

export default TabEdit;
