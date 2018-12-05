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

registerBlockType('benenson/logos-block', {
  title: __('Logo Group', 'benenson'),
  description: __('Add a repeatable logo block', 'benenson'),
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
      default: 4,
    },
  },

  edit: BlockEdit,

  save({ attributes, className }) {
    const {
      quantity, orientation = 'horizontal', backgroundColor, hideLines,
    } = attributes;
    const classes = classnames('logoList', `is-${orientation}`, `has-${quantity}-items`, {
      'has-background': !!backgroundColor,
      [`has-${backgroundColor}-background-color`]: !!backgroundColor,
      className: !!className,
    });

    return (<div className={ classes }>
      <InnerBlocks.Content/>
    </div>);
  },
});
