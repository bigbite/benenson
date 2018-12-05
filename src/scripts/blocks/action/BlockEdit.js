import classnames from 'classnames';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
  IconButton,
  PanelBody,
  SelectControl,
  ToggleControl,
} = wp.components;
const {
  InspectorControls,
  MediaUpload,
  PlainText,
  URLInputButton,
} = wp.editor;


export default class BlockEdit extends Component {
  render() {
    const { attributes, setAttributes } = this.props;
    const {
      style = 'standard',
      centred = false,
      label,
      content,
      imageID,
      imageURL,
      imageAlt,
      link,
      linkText,
      buttonBackground,
    } = attributes;

    const classes = classnames('actionBlock', {
      'actionBlock--wide': style === 'wide',
      'is-centred': centred,
    });

    const buttonClasses = classnames([
      'btn',
      'btn--fill',
    ]);

    const setURL = (image) => {
      if (!image.sizes || !Object.prototype.hasOwnProperty.call(image.sizes, 'large')) {
        return image.url;
      }

      return image.sizes.large.url;
    };

    return (<Fragment>
      <InspectorControls>
        <PanelBody>
          <SelectControl
            label={ __('Size', 'benenson') }
            value={ style }
            onChange={ newStyle => setAttributes({ style: newStyle }) }
            options={ [
              { value: 'standard', label: __('Standard', 'benenson') },
              { value: 'wide', label: __('Wide', 'benenson') },
            ] }
          />
          <ToggleControl
            label={ __('Centre Aligned', 'benenson') }
            help={ __('Centre align the action block.', 'benenson') }
            checked={ centred }
            onChange={ newCentred => setAttributes({ centred: newCentred }) }
          />
        </PanelBody>
      </InspectorControls>
      <figure className={ classes }>
        <div className="actionBlock-figure">
          <div className="linkList-options">
            { imageID ? <IconButton
              icon="no-alt"
              label={ __('Remove Image', 'benenson') }
              onClick={ () => setAttributes({ imageID: 0, imageURL: '', imageAlt: '' }) }
            /> : <MediaUpload
              allowedTypes={ ['image'] }
              value={ imageID }
              onSelect={ media => setAttributes({
                imageID: media.id,
                imageURL: setURL(media),
                imageAlt: media.alt,
              }) }
              render={ ({ open }) => (<IconButton icon="format-image" onClick={ open } />) }
            /> }
          </div>
          { imageURL && <img className="actionBlock-image" src={ imageURL } alt={ imageAlt } /> }
          <PlainText
            className="actionBlock-label"
            rows="1"
            placeholder={ __('(Label)', 'benenson') }
            value={ label }
            onChange={ newLabel => setAttributes({ label: newLabel }) }
          />
        </div>
        <figcaption className="actionBlock-content">
          <PlainText
            placeholder={ __('Content', 'benenson') }
            rows="3"
            value={ content }
            onChange={ newContent => setAttributes({ content: newContent }) }
          />
          <PlainText
            className={ buttonClasses }
            placeholder={ __('Act Now', 'benenson') }
            rows="1"
            value={ linkText || __('Act Now', 'benenson') }
            onChange={ newLinkText => setAttributes({ linkText: newLinkText }) }
          />
          <URLInputButton
            url={ link }
            onChange={ newLink => setAttributes({ link: newLink }) }
          />
        </figcaption>
      </figure>
    </Fragment>);
  }
}
