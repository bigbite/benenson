const { Component } = wp.element;
const { __ } = wp.i18n;
const { Button } = wp.components;
const { MediaUpload } = wp.editor;

const DEFAULT_SET_FEATURE_VIDEO_LABEL = __('Set featured video', 'benenson');
const DEFAULT_REMOVE_FEATURE_VIDEO_LABEL = __('Remove featured video', 'benenson');

class PostFeaturedVideo extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      media: false,
    };
  }

  componentDidMount() {
    if (this.props.featuredVideoId && !this.state.media) {
      this.fetchMediaObject();
    }
  }

  fetchMediaObject() {
    const { featuredVideoId } = this.props;
    wp.apiRequest({
      path: `/wp/v2/media/${featuredVideoId}`,
    })
      .then((resp) => {
        this.setState({
          media: { ...resp },
        });
      });
  }

  handleUpdateVideo = (media) => {
    if (!media) {
      this.setState({
        media: false,
      });

      this.props.onUpdate('');
      return;
    }

    this.setState({
      media,
    });

    this.props.onUpdate(media.id);
  };

  handleRemoveVideo = () => this.handleUpdateVideo(false);

  render() {
    const { featuredVideoId } = this.props;
    const { media } = this.state;

    return (<div className="editor-post-featured-image">
      { !!featuredVideoId && (<MediaUpload
        title={ DEFAULT_SET_FEATURE_VIDEO_LABEL }
        onSelect={ this.handleUpdateVideo }
        allowedTypes={ ['video'] }
        modalClass="editor-post-featured-image__media-modal"
        render={ ({ open }) => (
          <Button className="editor-post-featured-image__preview" onClick={ open }></Button>
        ) }
      />) }
      { !!featuredVideoId && media && !media.isLoading && (<MediaUpload
        title={ DEFAULT_SET_FEATURE_VIDEO_LABEL }
        onSelect={ this.handleUpdateVideo }
        allowedTypes={ ['video'] }
        modalClass="editor-post-featured-image__media-modal"
        render={ ({ open }) => (<div>
          <video>
            <source src={ media.source_url || media.url } />
          </video>
          <Button onClick={ open } isDefault={ true } isLarge={ true }>
            { __('Replace Video') }
          </Button>
        </div>) }
      />) }
      { !featuredVideoId && (<div>
        <MediaUpload
          title={ DEFAULT_SET_FEATURE_VIDEO_LABEL }
          onSelect={ this.handleUpdateVideo }
          allowedTypes={ ['video'] }
          modalClass="editor-post-featured-image__media-modal"
          render={ ({ open }) => (
            <Button className="editor-post-featured-image__toggle" onClick={ open }>
              { DEFAULT_SET_FEATURE_VIDEO_LABEL }
            </Button>
          ) }
        />
      </div>) }
      { !!featuredVideoId && (<Button
        onClick={ this.handleRemoveVideo }
        isLink={ true }
        isDestructive={ true }
      >
        { DEFAULT_REMOVE_FEATURE_VIDEO_LABEL }
      </Button>) }
    </div>);
  }
}

export default PostFeaturedVideo;
