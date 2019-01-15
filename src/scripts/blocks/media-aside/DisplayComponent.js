import classnames from 'classnames';
import PostFeaturedVideo from '../header/PostFeaturedVideo';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { TextControl, PanelBody, ToggleControl } = wp.components;
const { InspectorControls, RichText, URLInputButton } = wp.editor;
const { PostMediaSelector } = benenson.components;

class DisplayComponent extends Component {
  handleMediaChange = (media) => {
    const { setAttributes } = this.props;

    if (media) {
      setAttributes({
        mediaId: media.id,
        mediaUrl: media.source_url,
      });
      return;
    }

    setAttributes({
      mediaId: null,
      mediaUrl: null,
    });
  }

  handleVideoChange = (id) => {
    const { setAttributes } = this.props;

    setAttributes({
      videoId: id,
    });
  }

  handleEmbedChange = (url) => {
    const { setAttributes } = this.props;

    setAttributes({
      embed: url,
    });
  }

  render() {
    const { attributes, setAttributes } = this.props;
    const imageUrl = attributes.mediaUrl ? attributes.mediaUrl : 'turnip';

    return (
      <Fragment>
        <InspectorControls>
          <TextControl
            label={__('Embed url', 'benenson')}
            value={ attributes.embed }
            onChange={ this.handleEmbedChange }
          />
          <ToggleControl
            label={ __('Display in modal', 'benenson') }
            help={ __('Clicking play will open up the video in a modal.', 'benenson') }
            checked={ attributes.modal }
            onChange={ displayModal => setAttributes({ modal: displayModal }) }
          />
          <PanelBody title={__('Image/Video Poster', 'benenson') }>
            <PostMediaSelector
              onUpdate={ this.handleMediaChange }
              mediaId={ attributes.mediaId }
            />
          </PanelBody>
          <PanelBody title={__('Video (will override embed)', 'benenson') }>
            <PostFeaturedVideo
              onUpdate={ this.handleVideoChange }
              featuredVideoId={ attributes.videoId }
            />
          </PanelBody>
        </InspectorControls>
        <div className="mediaAside">
          <div className="mediaAside-col">
            <div className="mediaAside-content">
              <RichText
                tagName="h2"
                className="mediaAside-title"
                onChange={ newTitle => setAttributes({ title: newTitle }) }
                value={ attributes.title }
                placeholder={ __('(Insert Title)', 'benenson') }
                keepPlaceholderOnFocus={ true }
                formattingControls={ [] }
                format="string"
              />
              <RichText
                tagName="p"
                className="mediaAside-text"
                onChange={ newContent => setAttributes({ content: newContent }) }
                value={ attributes.content }
                placeholder={ __('(Insert Content)', 'benenson') }
                keepPlaceholderOnFocus={ true }
                formattingControls={ [] }
                format="string"
              />
              <div className="btn">
                <RichText
                  tagName="p"
                  onChange={ newCtaText => setAttributes({ ctaText: newCtaText }) }
                  value={ attributes.ctaText }
                  placeholder={ __('(Insert Link text)', 'benenson') }
                  keepPlaceholderOnFocus={ true }
                  formattingControls={ [] }
                  format="string"
                />
                <URLInputButton
                  url={ attributes.ctaLink }
                  onChange={ newCtaLink => setAttributes({ ctaLink: newCtaLink }) }
                />
              </div>
            </div>
          </div>
          <div class="mediaAside-col">
            <div class="mediaAside-image">
              <img src={imageUrl} alt=""/>
              { attributes.embed ? <a className="btn" href="" data-modal-embed=""><i class="play-icon">Play video</i></a> : '' }
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DisplayComponent;
