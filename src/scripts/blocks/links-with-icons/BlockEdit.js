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
const {
  PanelBody, RangeControl, SelectControl, ToggleControl,
} = wp.components;
const { InnerBlocks, InspectorControls } = wp.editor;

/**
 * Module-specific
 */
// blocks allowed to be contained within the repeatable block
const ALLOWED_BLOCKS = ['benenson/links-with-icons'];
// Returns the layouts configuration for a given number of repeats.
const getLayoutTemplate = memoize(blocks => times(blocks, () => ALLOWED_BLOCKS));

export default class BlockEdit extends Component {
  render = () => {
    const {
      attributes,
      setAttributes,
    } = this.props;

    const {
      quantity, orientation = 'horizontal', backgroundColor, hideLines,
    } = attributes;

    const classes = classnames('linksWithIcons-group', `is-${orientation}`, `has-${quantity}-items`, {
      'has-background': !!backgroundColor,
      [`has-${backgroundColor}-background-color`]: !!backgroundColor,
    });

    return (<Fragment>
      <InspectorControls>
        <PanelBody>
          <RangeControl
            label={ __('Quantity', 'benenson') }
            value={ quantity }
            onChange={ newQuantity => setAttributes({ quantity: newQuantity }) }
            min={ 1 }
            max={ 4 }
          />
          <SelectControl
            label={ __('Orientation', 'benenson') }
            value={ orientation }
            onChange={ newOrientation => setAttributes({ orientation: newOrientation }) }
            options={ [
              { value: 'horizontal', label: __('Horizontal', 'benenson') },
              { value: 'vertical', label: __('Vertical', 'benenson') },
            ] }
          />
          <SelectControl
            label={ __('Background Colour', 'benenson') }
            value={ backgroundColor }
            onChange={ newBgColor => setAttributes({ backgroundColor: newBgColor }) }
            options={ [
              { value: '', label: __('None', 'benenson') },
              { value: 'very-light-gray', label: __('Grey', 'benenson') },
            ] }
          />
          <ToggleControl
            label={ __('Hide Lines', 'benenson') }
            checked={ hideLines }
            onChange={ newHideLines => setAttributes({ hideLines: newHideLines }) }
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
