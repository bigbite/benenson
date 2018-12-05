import classnames from 'classnames';
import memoize from 'memize';
import times from 'lodash-es/times';
import './fact';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { PanelBody, RangeControl, SelectControl } = wp.components;
const { InnerBlocks, InspectorControls, RichText } = wp.editor;
const { Fragment } = wp.element;

const ALLOWED_BLOCKS = ['benenson/key-fact'];
const getLayoutTemplate = memoize(blocks => times(blocks, () => ALLOWED_BLOCKS));

registerBlockType('benenson/key-facts', {
  title: __('Key Facts', 'benenson'),
  description: __('Add a key facts block', 'benenson'),
  icon: 'lightbulb',
  category: 'benenson',
  supports: {
    className: false,
  },
  attributes: {
    title: {
      type: 'string',
    },
    quantity: {
      type: 'number',
    },
    background: {
      type: 'string',
    },
  },

  edit({ attributes, setAttributes }) {
    const { title, quantity = 2, background = '' } = attributes;

    const classes = classnames('factBlock', {
      'has-background': !!background,
      [`has-${background}-background-color`]: !!background,
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
            label={ __('Background Colour', 'benenson') }
            value={ background }
            onChange={ newBgColor => setAttributes({ background: newBgColor }) }
            options={ [
              { value: '', label: __('None', 'benenson') },
              { value: 'very-light-gray', label: __('Grey', 'benenson') },
            ] }
          />
        </PanelBody>
      </InspectorControls>
      <div className={ classes }>
        <RichText
          className="factBlock-title"
          tagName="h2"
          placeholder={ __('(Insert Title)', 'benenson') }
          keepPlaceholderOnFocus={ true }
          value={ title }
          formattingControls={ [] }
          onChange={ newTitle => setAttributes({ title: newTitle }) }
          format="string"
        />
        <InnerBlocks
          template={ getLayoutTemplate(quantity) }
          templateLock="insert"
          allowedBlocks={ ALLOWED_BLOCKS }
        />
      </div>
    </Fragment>);
  },

  save({ attributes }) {
    const { title = '', background = '' } = attributes;

    const classes = classnames('factBlock', {
      'has-background': !!background,
      [`has-${background}-background-color`]: !!background,
    });

    const label = title.replace(' ', '-').toLowerCase();

    return (<aside className={ classes } aria-labelledby={ label }>
      <h2 id={ label } className="factBlock-title" aria-hidden="true">{ title }</h2>
      <ol><InnerBlocks.Content/></ol>
    </aside>);
  },
});
