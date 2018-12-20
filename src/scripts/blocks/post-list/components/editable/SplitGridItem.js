const { __ } = wp.i18n;
const { RichText, URLInputButton, MediaUpload } = wp.editor;
const { IconButton } = wp.components;

const GridItem = props => (
  <article className="grid-item" style={ {
    backgroundImage: `url(${props.featured_image})`,
  } }>
    <span className="grid-itemMeta">
      <RichText
        tagName="span"
        onChange={ props.createUpdate('tagText') }
        value={ props.tagText }
        placeholder={ __('(Insert Tag)', 'benenson') }
        keepPlaceholderOnFocus={ true }
        formattingControls={ [] }
        format="string"
      />
      <URLInputButton
        url={ props.tagLink }
        onChange={ props.createUpdate('tagLink') }
      />
    </span>
    <h3 className="grid-itemTitle">
      <a>
        <RichText
          tagName="span"
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
      </a>
    </h3>
    <div className="grid-itemContent">
      <RichText
        tagName="p"
        onChange={ props.createUpdate('excerpt') }
        value={ props.excerpt }
        placeholder={ __('(Insert Content)', 'benenson') }
        keepPlaceholderOnFocus={ true }
        formattingControls={ [] }
        format="string"
      />
    </div>
    <div className="linkList-options">
      {
        props.featured_image_id &&
        props.featured_image_id !== -1 &&
        <IconButton icon="no-alt" onClick={ () => props.updateMedia({
          featured_image_id: '',
          featured_image: '',
        }) }>
          { __('Remove Image', 'benenson') }
        </IconButton>
      }
      <MediaUpload
        onSelect={ ({ id, url }) => props.updateMedia({
          featured_image_id: id,
          featured_image: url,
        }) }
        value={ props.featured_image_id }
        allowedTypes={ ['image'] }
        render={ ({ open }) => (
        <IconButton icon="format-image" onClick={ open } />
        ) }
      />
      <IconButton onClick={ props.createRemove } icon="trash" />
    </div>
  </article>
);

export default GridItem;
