import classNames from 'classnames';
import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InnerBlocks } = wp.editor;

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('benenson/block-section', {
  title: __('Section', 'benenson'),
  icon: 'editor-table',
  category: 'benenson',
  keywords: [
    __('Section', 'benenson'),
    __('Grey', 'benenson'),
  ],
  attributes: {
    background: {
      type: 'string',
    },
    padding: {
      type: 'string',
    },
    width: {
      type: 'string',
    },
  },

  edit: DisplayComponent,

  // Returns null due to the component being rendered server side
  save: ({ attributes }) => (
    <section className={ classNames({
      section: true,
      'section--tinted': attributes.background === 'grey',
      [`section--${attributes.padding}`]: !!attributes.padding,
      [`section--${attributes.width}`]: !!attributes.width,
    }) }>
      <div className="container">
        <InnerBlocks.Content />
      </div>
    </section>
  ),
});
