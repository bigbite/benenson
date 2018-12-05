const { __ } = wp.i18n;
const { RichText, URLInputButton } = wp.editor;
const { IconButton } = wp.components;

const LinkItem = props => (<li>
  <article className="linkList-item">
    <span className="linkList-itemMeta">
      <RichText
        tagName="a"
        onChange={ props.createUpdate('tagText') }
        value={ props.tagText }
        placeholder={ __('(Tag Name)', 'benenson') }
        keepPlaceholderOnFocus={ true }
        formattingControls={ [] }
        format="string"
      />
      <URLInputButton
        url={ props.tagLink }
        onChange={ props.createUpdate('tagLink') }
      />
    </span>
    <h3 className="linkList-itemTitle">
      <RichText
        tagName="a"
        onChange={ props.createUpdate('title') }
        value={ props.title }
        placeholder={ __('(Insert Title)', 'benenson') }
        keepPlaceholderOnFocus={ true }
        formattingControls={ [] }
        format="string"
      />
      <URLInputButton
        url={ props.titleLink }
        onChange={ props.createUpdate('titleLink') }
      />
    </h3>
    <div className="linkList-options">
      <IconButton onClick={ props.createRemove } icon="trash" />
    </div>
  </article>
</li>);

export default LinkItem;
