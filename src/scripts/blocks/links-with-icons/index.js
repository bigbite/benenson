/**
 * Third-party
 */
import classnames from 'classnames';

/**
 * Module-specific
 */
import BlockEdit from './BlockEdit';
import './InnerBlock';

/**
 * WordPress
 */
const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.editor;

registerBlockType('benenson/repeatable-block', {
  title: __('Links with Icons Group', 'benenson'),
  description: __('Add a repeatable links-with-icons block', 'benenson'),
  icon: 'images-alt',
  category: 'benenson',
  supports: {
    className: false,
  },
  attributes: {
    backgroundColor: {
      type: 'string',
    },
    orientation: {
      type: 'string',
      default: 'horizontal',
    },
    quantity: {
      type: 'number',
      default: 2,
    },
    hideLines: {
      type: 'boolean',
      default: false,
    },
  },

  edit: BlockEdit,

  save({ attributes, className }) {
    const {
      quantity, orientation = 'horizontal', backgroundColor, hideLines,
    } = attributes;
    const classes = classnames('linksWithIcons-group', `is-${orientation}`, `has-${quantity}-items`, {
      'has-background': !!backgroundColor,
      [`has-${backgroundColor}-background-color`]: !!backgroundColor,
      'has-no-lines': !!hideLines,
      className: !!className,
    });

    return (<div className={ classes }>
      <InnerBlocks.Content/>
    </div>);
  },
});
