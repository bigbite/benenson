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

/**
 * Module-specific
 */
// blocks allowed to be contained within the repeatable block
const ALLOWED_BLOCKS = ['benenson/logo'];
// Returns the layouts configuration for a given number of repeats.
const getLayoutTemplate = memoize(blocks => times(blocks, () => ALLOWED_BLOCKS));

export default class BlockEdit extends Component {
  render = () => {
    const {
      attributes,
      setAttributes,
    } = this.props;

    const {
      quantity, orientation = 'horizontal', backgroundColor,
    } = attributes;

    const classes = classnames('logoList', `is-${orientation}`, `has-${quantity}-items`, {
      'has-background': !!backgroundColor,
      [`has-${backgroundColor}-background-color`]: !!backgroundColor,
    });

    const quantityOptions = applyFilters('benenson.block.logoGroup.quantityOptions', {
      min: 1,
      max: 10,
    });

    const backgroundOptions = applyFilters('benenson.block.logoGroup.backgroundOptions', [{
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
          template={ getLayoutTemplate(quantity) }
          templateLock="all"
          allowedBlocks={ ALLOWED_BLOCKS }
        />
      </div>
    </Fragment>);
  }
}
