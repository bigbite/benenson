import classnames from 'classnames';
import PostFeaturedVideo from './PostFeaturedVideo';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { compose } = wp.compose;
const { withSelect } = wp.data;
const {
  withFilters, PanelBody, SelectControl, TextControl,
} = wp.components;
const { RichText, URLInputButton, InspectorControls } = wp.editor;
const { PostFeaturedImage } = wp.editor;

class DisplayComponent extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      videoUrl: false,
    };
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
  /**
  * Higher order component that takes the attribute key,
  * this then returns a function which takes a value,
  * when called it updates the attribute with the key.
  * @param key
  * @returns {function(*): *}
  */
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  fetchVideoUrl = () => {
    const { featuredVideoId } = this.props.attributes;

    wp.apiRequest({
      path: `/wp/v2/media/${featuredVideoId}`,
    })
      .then((resp) => {
        this.setState({
          videoUrl: resp.source_url,
        });
      });
  };

  render() {
    const { attributes = {} } = this.props;
    const { media } = this.props;

    const classes = classnames('page-hero', {
      'page-heroSize--full': !attributes.size,
      'page-heroBackground--transparent': !attributes.background,
      'page-heroAlignment--left': !attributes.alignment,
      [`page-heroSize--${attributes.size}`]: attributes.size || false,
      [`page-heroBackground--${attributes.background}`]: attributes.background || false,
      [`page-heroAlignment--${attributes.alignment}`]: attributes.alignment || false,
      'page-hero--video': attributes.type === 'video',
    });

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <SelectControl
            label={ __('Alignment', 'benenson') }
            options={ [{
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
            }] }
            value={ attributes.alignment }
            onChange={ this.createUpdateAttribute('alignment') }
          />
          <SelectControl
            label={ __('Background Colour', 'benenson') }
            options={ [{
              label: __('Translucent black', 'benenson'),
              value: '',
            }, {
              label: __('None', 'benenson'),
              value: 'none',
            }, {
              label: __('White', 'benenson'),
              value: 'light',
            }, {
              label: __('Black', 'benenson'),
              value: 'dark',
            }] }
            value={ attributes.background }
            onChange={ this.createUpdateAttribute('background') }
          />
          <SelectControl
            label={ __('Size', 'benenson') }
            options={ [{
              label: __('Normal', 'benenson'),
              value: '',
            }, {
              label: __('Small', 'benenson'),
              value: 'small',
            }] }
            value={ attributes.size }
            onChange={ this.createUpdateAttribute('size') }
          />

          <SelectControl
            label={ __('Background Type', 'benenson') }
            options={ [{
              label: __('Image', 'benenson'),
              value: '',
            }, {
              label: __('Video', 'benenson'),
              value: 'video',
            }] }
            value={ attributes.type }
            onChange={ this.createUpdateAttribute('type') }
          />

          <TextControl
            label={__('Embed url', 'benenson')}
            value={ attributes.embed }
            onChange={ this.createUpdateAttribute('embed') }
          />
          <p><em>{ __('Setting this will override the cta link and will now open a modal with the embed in the hero.', 'benenson') }</em></p>
        </PanelBody>
        <PanelBody title={ attributes.type === 'video' ? __('Background Image', 'benenson') : __('Featured Image', 'benenson') }>
          <PostFeaturedImage />
        </PanelBody>
        { attributes.type === 'video' && <PanelBody title={__('Featured Video', 'benenson') }>
          <PostFeaturedVideo
            featuredVideoId={attributes.featuredVideoId}
            onUpdate={this.createUpdateAttribute('featuredVideoId')}
          />
        </PanelBody> }
      </InspectorControls>
      <section className={ classes } style={ { backgroundImage: `url(${media ? media.source_url : ''})` } }>
        {
          this.state.videoUrl &&
            <div className="page-heroVideoContainer">
              <video className="page-heroVideo">
                <source src={this.state.videoUrl} />
              </video>
            </div>
        }
        <div className="container">
          <div className="hero-content">
            <RichText
              tagName="h1"
              className="page-heroTitle"
              value={ attributes.title }
              placeholder={ __('(Header Title)', 'benenson') }
              keepPlaceholderOnFocus={ true }
              format="string"
              onChange={ this.createUpdateAttribute('title') }
            />
            <RichText
              tagName="p"
              className="page-heroContent"
              value={ attributes.content }
              placeholder={ __('(Header Content)', 'benenson') }
              keepPlaceholderOnFocus={ true }
              format="string"
              onChange={ this.createUpdateAttribute('content') }
            />
            <div className="page-heroCta">
              <div className="btn">
                { attributes.embed && <i className="play-icon"></i> }
                <RichText
                  tagName="span"
                  value={ attributes.ctaText }
                  placeholder={ __('(Call to action)', 'benenson') }
                  keepPlaceholderOnFocus={ true }
                  format="string"
                  onChange={ this.createUpdateAttribute('ctaText') }
                />
                { (!attributes.embed || attributes.embed.length < 1) && <URLInputButton
                  url={ attributes.ctaLink }
                  onChange={ this.createUpdateAttribute('ctaLink') }
                /> }
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>);
  }
}

const applyWithSelect = () => withSelect((select) => {
  const { getMedia, getPostType } = select('core');
  const { getEditedPostAttribute } = select('core/editor');
  const featuredImageId = getEditedPostAttribute('featured_media');

  /**
   * getMedia && getPostType are initially undefined.
   * This is causing an API request to /wp-admin/undefined/ on load.
   * Unfortunately, there doesn't appear to be an easy way around this,
   * but we should investigate potential solutions.
   * - @jonmcp
   * FAO: @jrmd
   *
   */
  return {
    media: featuredImageId ? getMedia(featuredImageId) : null,
    postType: getPostType(getEditedPostAttribute('type')),
    featuredImageId,
  };
});

export default compose(
  applyWithSelect(),
  withFilters('editor.PostFeaturedImage'),
)(DisplayComponent);
