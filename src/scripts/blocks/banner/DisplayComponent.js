import classnames from 'classnames';
import PostFeaturedVideo from './PostFeaturedVideo';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
  InspectorControls,
  MediaUpload,
  RichText,
  URLInputButton,
} = wp.editor;
const {
  IconButton,
  PanelBody,
  SelectControl,
  TextControl,
} = wp.components;

export default class DisplayComponent extends Component {
  state = {
    videoUrl: false,
  }

  componentDidMount() {
    const { type, featuredVideoId } = this.props.attributes;

    if (type === 'video' && !this.state.videoUrl && featuredVideoId) {
      this.fetchVideoUrl();
    }
  }

  componentDidUpdate() {
    const { type, featuredVideoId } = this.props.attributes;

    if (type === 'video' && !this.state.videoUrl && featuredVideoId) {
      this.fetchVideoUrl();
    }
  }

  fetchVideoUrl = () => {
    const { featuredVideoId } = this.props.attributes;

    wp.apiRequest({
      path: `/wp/v2/media/${featuredVideoId}`,
    }).then((resp) => {
      this.setState({
        videoUrl: resp.source_url,
      });
    });
  };

  setImageUrl = (image) => {
    if (!image.sizes || !Object.hasOwnProperty.call(image.sizes, 'large')) {
      return image.url;
    }

    return image.sizes.large.url;
  };

  render() {
    const { attributes = {}, setAttributes } = this.props;
    const { videoUrl } = this.state;
    const {
      type = 'image',
      size = false,
      background = false,
      alignment = false,

      imageID,
      imageURL,
      featuredVideoId,
      title,
      content,
      embed,
      ctaText,
      ctaLink,
    } = attributes;

    const classes = classnames('page-hero', 'headerBlock', {
      'page-heroSize--full': !size,
      'page-heroBackground--transparent': !background,
      'page-heroAlignment--left': !alignment,
      'page-hero--video': type === 'video',
      [`page-heroSize--${size}`]: size,
      [`page-heroBackground--${background}`]: background,
      [`page-heroAlignment--${alignment}`]: alignment,
    });

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <SelectControl
            label={ __('Alignment', 'benenson') }
            options={[{
              /* translators: text alignment. for RTL languages, localise as 'Right' */
              label: __('Left', 'benenson'),
              value: 'left',
            }, {
              label: __('Centre', 'benenson'),
              value: 'center',
            }, {
              /* translators: text alignment. for RTL languages, localise as 'Left' */
              label: __('Right', 'benenson'),
              value: 'right',
            }]}
            value={ alignment }
            onChange={ newAlignment => setAttributes({ alignment: newAlignment }) }
          />
          <SelectControl
            label={ __('Background Colour', 'benenson') }
            options={ [
              { value: '', label: __('Translucent black', 'benenson') },
              { value: 'none', label: __('None', 'benenson') },
              { value: 'light', label: __('White', 'benenson') },
              { value: 'dark', label: __('Black', 'benenson') },
            ] }
            value={ background }
            onChange={ newBackground => setAttributes({ background: newBackground }) }
          />
          <SelectControl
            label={ __('Size', 'benenson') }
            options={ [
              { value: '', label: __('Normal', 'benenson') },
              { value: 'small', label: __('Small', 'benenson') },
            ] }
            value={ size }
            onChange={ newSize => setAttributes({ size: newSize }) }
          />
          <SelectControl
            label={ __('Background Type', 'benenson') }
            options={ [
              { value: '', label: __('Image', 'benenson') },
              { value: 'video', label: __('Video', 'benenson') },
            ] }
            value={ type }
            onChange={ newType => setAttributes({ type: newType }) }
          />
          <TextControl
            label={ __('Embed URL', 'benenson') }
            help={ __('Setting this will override the call to action link and will now open a modal with the embed.', 'benenson') }
            value={ embed }
            onChange={ newEmbed => setAttributes({ embed: newEmbed }) }
          />
        </PanelBody>
        { type === 'video' && <PanelBody title={ __('Featured Video', 'benenson') }>
          <PostFeaturedVideo
            featuredVideoId={ featuredVideoId }
            onUpdate={ newVideoID => setAttributes({ featuredVideoId: newVideoID }) }
          />
        </PanelBody> }
      </InspectorControls>
      <section className={ classes } style={ { backgroundImage: `url(${imageURL})` } }>
        { type !== 'video' && <div className="linkList-options">
          { imageID ? <IconButton
            icon="no-alt"
            label={ __('Remove Image', 'benenson') }
            onClick={ () => setAttributes({ imageID: 0, imageURL: '' }) }
          /> : <MediaUpload
            allowedTypes={ ['image'] }
            value={ imageID }
            onSelect={ media => setAttributes({
              imageID: media.id,
              imageURL: this.setImageUrl(media),
            }) }
            render={ ({ open }) => (<IconButton icon="format-image" onClick={ open } />) }
          /> }
        </div> }

        { videoUrl && <div className="page-heroVideoContainer">
          <video className="page-heroVideo">
            <source src={ videoUrl } />
          </video>
        </div> }
        <div className="container">
          <div className="hero-content">
            <RichText
              tagName="h1"
              className="page-heroTitle"
              value={ title }
              placeholder={ __('(Banner Title)', 'benenson') }
              keepPlaceholderOnFocus={ true }
              format="string"
              onChange={ newTitle => setAttributes({ title: newTitle }) }
            />
            <RichText
              tagName="p"
              className="page-heroContent"
              value={ content }
              placeholder={ __('(Banner Content)', 'benenson') }
              keepPlaceholderOnFocus={ true }
              format="string"
              onChange={ newContent => setAttributes({ content: newContent }) }
            />
            <div className="page-heroCta">
              <div className="btn">
                { embed && <i className="play-icon"></i> }
                <RichText
                  tagName="span"
                  value={ ctaText }
                  placeholder={ __('(Call to action)', 'benenson') }
                  keepPlaceholderOnFocus={ true }
                  format="string"
                  onChange={ newCtaText => setAttributes({ ctaText: newCtaText }) }
                />
                { (!embed || embed.length < 1) && <URLInputButton
                  url={ ctaLink }
                  onChange={ newCtaLink => setAttributes({ ctaLink: newCtaLink }) }
                /> }
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>);
  }
}
