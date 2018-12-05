import classNames from 'classnames';
import times from 'lodash-es/times';
import layouts from './layouts';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl } = wp.components;
const { InspectorControls, InnerBlocks } = wp.editor;

class DisplayComponent extends Component {
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  render() {
    const { attributes } = this.props;
    const options = Object
      .keys(layouts)
      .map(key => ({
        value: key,
        label: layouts[key].name,
      }));

    const layoutKey = attributes.layout || '1/2|1/2';

    const currentTemplate = times(layouts[layoutKey].columns, n => ['benenson/block-row-column']);

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <SelectControl
            label={ __('Layout Style', 'benenson') }
            options={ options }
            value={ attributes.layout }
            onChange={ this.createUpdateAttribute('layout') }
          />
        </PanelBody>
      </InspectorControls>
      <div className={ classNames({
        row: true,
        [`layout-${layoutKey}`]: true,
      }) }>
        <InnerBlocks
          template={ currentTemplate }
          templateLock="all"
          allowedBlocks={ ['benenson/block-row-column'] }
        />
      </div>
    </Fragment>);
  }
}

export default DisplayComponent;
