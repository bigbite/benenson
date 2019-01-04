import classnames from 'classnames';
import PostMediaSelector from '../PostMediaSelector';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { TextControl, PanelBody } = wp.components;
const { InspectorControls, RichText, URLInputButton } = wp.editor;

class DisplayComponent extends Component {
  handleMediaChange = (media) => {
    const { setAttributes } = this.props;

    setAttributes({
      mediaId: media.id,
      mediaUrl: media.source_url,
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
          <PanelBody title={__('Image/Video Poster', 'benenson') }>
            <PostMediaSelector
              onUpdate={ this.handleMediaChange }
              mediaId={ attributes.mediaId }
            />
          </PanelBody>
        </InspectorControls>
        <div className="mediaAside">
          <div className="mediaAside-col">
            <div className="mediaAside-content">
              <h2 className="mediaAside-title">
                <RichText
                  tagName="span"
                  onChange={ newTitle => setAttributes({ title: newTitle }) }
                  value={ attributes.title }
                  placeholder={ __('(Insert Title)', 'benenson') }
                  keepPlaceholderOnFocus={ true }
                  formattingControls={ [] }
                  format="string"
                />
              </h2>
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
                  tagName="span"
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
