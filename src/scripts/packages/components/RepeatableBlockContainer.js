/**
 * Third-party
 */
import classnames from 'classnames';
import times from 'lodash-es/times';
import memoize from 'memize';

/**
 * WordPress
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { applyFilters } = wp.hooks;
const {
  PanelBody, RangeControl, SelectControl, ToggleControl,
} = wp.components;
const { InnerBlocks, InspectorControls } = wp.editor;

export default class RepeatableBlockContainer extends Component {
  BLOCKNAME = '';
  CLASSNAME = '';
  ALLOWED_BLOCKS = [];

  getLayoutTemplate = memoize(blocks => times(blocks, () => this.ALLOWED_BLOCKS))

  render = () => {
    const {
      attributes,
      setAttributes,
    } = this.props;

    const {
      quantity,
      backgroundColor,
      orientation = 'horizontal',
    } = attributes;

    const classes = classnames(this.CLASSNAME, `is-${orientation}`, `has-${quantity}-items`, {
      'has-background': !!backgroundColor,
      [`has-${backgroundColor}-background-color`]: !!backgroundColor,
    });

    const quantityOptions = applyFilters(`benenson.block.${this.BLOCKNAME}.quantityOptions`, {
      min: 1,
      max: 10,
    });

    const backgroundOptions = applyFilters(`benenson.block.${this.BLOCKNAME}.backgroundOptions`, [{
      label: __('None', 'benenson'),
      value: '',
    }, {
      label: __('Grey', 'benenson'),
      value: 'very-light-gray',
    }]);

    return (<Fragment>
      <InspectorControls>
        <PanelBody>
          <RangeControl
            label={ __('Quantity', 'benenson') }
            value={ quantity }
            onChange={ newQuantity => setAttributes({ quantity: newQuantity }) }
            min={ quantityOptions.min }
            max={ quantityOptions.max }
          />
          <SelectControl
            label={ __('Background Colour', 'benenson') }
            value={ backgroundColor }
            onChange={ newBgColor => setAttributes({ backgroundColor: newBgColor }) }
            options={ backgroundOptions }
          />
        </PanelBody>
      </InspectorControls>
      <div className={ classes }>
        <InnerBlocks
          template={ this.getLayoutTemplate(quantity) }
          templateLock="all"
          allowedBlocks={ this.ALLOWED_BLOCKS }
        />
      </div>
    </Fragment>);
  }
}
