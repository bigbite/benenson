import classnames from 'classnames';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;

registerBlockType('benenson/key-fact', {
  title: 'Key Fact',
  parent: ['benenson/key-facts'],
  category: 'layout',
  supports: {
    className: false,
  },
  attributes: {
    title: {
      type: 'string',
    },
    content: {
      type: 'string',
    },
  },

  edit({ attributes, setAttributes }) {
    const { title, content } = attributes;

    return (<div className="factBlock-item">
      <RichText
        className="factBlock-itemTitle"
        tagName="h3"
        placeholder={ __('(Insert Title)', 'benenson') }
        keepPlaceholderOnFocus={ true }
        value={ title }
        formattingControls={ [] }
        onChange={ newTitle => setAttributes({ title: newTitle }) }
      />
      <RichText
        className="factBlock-itemContent"
        tagName="p"
        placeholder={ __('(Insert Content)', 'benenson') }
        keepPlaceholderOnFocus={ true }
        value={ content }
        formattingControls={ [] }
        onChange={ newContent => setAttributes({ content: newContent }) }
      />
    </div>);
  },

  save({ attributes }) {
    const { title, content } = attributes;

    return (<li className="factBlock-item">
      <h3 className="factBlock-itemTitle">{ title }</h3>
      <p className="factBlock-itemContent">{ content }</p>
    </li>);
  },
});
