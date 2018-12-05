import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
  Button,
  IconButton,
  PanelBody,
  SelectControl,
  ToggleControl,
} = wp.components;
const {
  InspectorControls,
  MediaUpload,
  PlainText,
  RichText,
  URLInputButton,
} = wp.editor;

const getClosestSize = (media) => {
  const sizeList = media.sizes || media.media_details.sizes;
  const sizes = {};

  Object.keys(sizeList).forEach((size) => {
    sizes[size] = sizeList[size].height;
  });

  let closest = 'full';

  Object.keys(sizes).forEach((size) => {
    if (Math.abs(600 - sizes[size]) < Math.abs(600 - sizes[closest])) {
      closest = size;
    }
  });

  return closest;
};

export default class ImageBlockEdit extends Component {
  state = {
    image: {},
    video: {},
  }

  componentDidMount() {
    const { attributes } = this.props;
    const { type, imageID = 0, videoID = 0 } = attributes;

    let mediaID = imageID;
    let key = 'image';

    if (type === 'video') {
      mediaID = videoID;
      key = 'video';
    }

    wp.apiRequest({
      path: `/wp/v2/media/${mediaID}`,
    }).then(response => this.setState({ [key]: response }));
  }

  updateImage(media, style = 'loose') {
    let size = 'full';
    if (style === 'fixed') {
      size = getClosestSize(media);
    }

    const sizeList = media.sizes || media.media_details.sizes;
    const url = sizeList[size].url || sizeList[size].source_url;

    this.setState({
      image: media,
    });

    this.props.setAttributes({
      imageID: media.id,
      imageURL: url,
    });
  }

  removeImage = () => {
    this.setState({ image: {} });
    this.props.setAttributes({ imageID: 0, imageURL: '' });
  }

  updateVideo = (media) => {
    this.removeVideo();

    this.setState({ video: media });
    this.props.setAttributes({ videoID: media.id, videoURL: media.source_url || media.url });
  }

  removeVideo = () => {
    this.setState({ video: {} });
    this.props.setAttributes({ videoID: 0, videoURL: '' });
  }

  updateStyle = (style) => {
    this.props.setAttributes({ style });

    if (this.state.image) {
      this.updateImage(this.state.image, style);
    }
  }

  updateButtonAttribute(index, attribute, value) {
    const { attributes, setAttributes } = this.props;
    const { buttons } = attributes;

    return setAttributes({
      buttons: [
        // old buttons up to current index
        ...buttons.slice(0, Math.max(0, index)),
        // current button
        {
          ...buttons[index],
          [attribute]: value,
        },
        // old buttons after current index
        ...buttons.slice(index + 1, buttons.length),
      ],
    });
  }

  createButton(index = -1, button = false) {
    const { attributes, setAttributes } = this.props;
    const { buttons } = attributes;

    if (!buttons[index]) {
      buttons[index] = {
        text: '',
        url: '',
      };
    }

    return (<div style={ { position: 'relative' } } key={ index }>
      <div className="imageBlock-buttonWrapper">
        <PlainText
          className="btn btn--white"
          rows="1"
          placeholder={ __('(Link Text)', 'benenson') }
          value={ buttons[index].text }
          onChange={ text => this.updateButtonAttribute(index, 'text', text) }
        />
      </div>
      <div className="linkList-options">
        { buttons.length > 1 && <IconButton
          icon="no-alt"
          label={ __('Remove Button', 'benenson') }
          onClick={ () => this.removeButton(index) }
        /> }
        <URLInputButton
          url={ buttons[index].url }
          onChange={ url => this.updateButtonAttribute(index, 'url', url) }
        />
      </div>
    </div>);
  }

  removeButton(index) {
    const { attributes, setAttributes } = this.props;
    const { buttons } = attributes;

    const newButtons = [
      ...buttons.slice(0, Math.max(0, index)),
      ...buttons.slice(index + 1, buttons.length),
    ];

    setAttributes({ buttons: newButtons });
  }

  imagePanelControls() {
    const { attributes, setAttributes } = this.props;
    const {
      type = '',
      parallax = false,
      align = 'default',
      style = 'loose',
    } = attributes;

    if (parallax || type === 'video') {
      return '';
    }

    return (<PanelBody>
      <SelectControl
        label={ __('Image Style', 'benenson') }
        value={ style }
        onChange={ newStyle => this.updateStyle(newStyle) }
        options={ [
          { value: 'fixed', label: __('Fixed Height (600px)', 'benenson') },
          { value: 'loose', label: __('Actual Height', 'benenson') },
        ] }
      />
      <SelectControl
        label={ __('Alignment', 'benenson') }
        help={ __('Only has an effect on images smaller than their container', 'benenson') }
        value={ align }
        onChange={ newAlign => setAttributes({ align: newAlign }) }
        options={ [
          { value: 'default', label: __('Default', 'benenson') },
          /* translators: text alignment. for RTL languages, localise as 'Right' */
          { value: 'left', label: __('Left', 'benenson') },
          { value: 'centre', label: __('Centre', 'benenson') },
          /* translators: text alignment. for RTL languages, localise as 'Left' */
          { value: 'right', label: __('Right', 'benenson') },
        ] }
      />
    </PanelBody>);
  }

  imageInlineControls() {
    const { type = '', imageID = 0 } = this.props.attributes;

    if (type === 'video') {
      return '';
    }

    return (<div className="linkList-options imageBlock-action">
      { imageID ? <IconButton
        icon="no-alt"
        label={ __('Remove Image', 'benenson') }
        onClick={ this.removeImage }
      /> : <MediaUpload
        allowedTypes={ ['image'] }
        value={ imageID }
        onSelect={ (media) => {
          /**
            * MediaUpload component doesn't return full sizes array, so we need to
            * grab it from the API again. Inefficient, but it's a Gutenberg core issue
            * that was supposedly resolved in https://github.com/WordPress/gutenberg/pull/7605,
            * but either wasn't, or was subject to a regression failure.
            */
          wp.apiRequest({ path: `/wp/v2/media/${media.id}` }).then((response) => {
            this.updateImage({
              id: response.id,
              sizes: response.media_details.sizes,
            });
          });
        } }
        render={ ({ open }) => (<IconButton icon="format-image" onClick={ open } />) }
      /> }
    </div>);
  }

  overlayInputFields() {
    const { attributes, setAttributes } = this.props;
    const {
      hasOverlay = false,
      title = '',
      content = '',
      buttons = [],
    } = attributes;

    if (!hasOverlay) {
      return '';
    }

    return (<div className="imageBlock-overlay">
      <RichText
        className="imageBlock-title"
        rows="1"
        placeholder={ __('(Title)', 'benenson') }
        value={ title }
        onChange={ newTitle => setAttributes({ title: newTitle }) }
      />
      <RichText
        className="imageBlock-content"
        placeholder={ __('(Content)', 'benenson') }
        value={ content }
        format="string"
        keepPlaceholderOnFocus={ true }
        onChange={ newContent => setAttributes({ content: newContent }) }
      />
      <div className="imageBlock-buttonsContainer">
      { buttons.map((button, index) => this.createButton(index, button)) }
      { buttons.length < 1 && this.createButton(0) }
        <IconButton
          icon="plus"
          label={ __('Add Button', 'benenson') }
          onClick={ () => setAttributes({ buttons: [...buttons, { text: '', url: '' }] }) }
        />
      </div>
    </div>);
  }

  videoPanelControls() {
    const { attributes, setAttributes } = this.props;
    const { videoID = 0, videoURL = '', type = '' } = attributes;

    if (type !== 'video') {
      return '';
    }

    if (!videoURL) {
      return (<PanelBody>
        <MediaUpload
          title={ __('Choose Video', 'benenson') }
          onSelect={ media => this.updateVideo(media) }
          allowedTypes={ ['video'] }
          modalClass="editor-post-featured-image__media-modal"
          render={ ({ open }) => (
            <Button className="editor-post-featured-image__toggle" onClick={ open }>
              { __('Choose Video', 'benenson') }
            </Button>
          ) }
        />
      </PanelBody>);
    }

    return (<PanelBody>
      <MediaUpload
        title={ __('Replace Video', 'benenson') }
        onSelect={ media => this.updateVideo(media) }
        allowedTypes={ ['video'] }
        modalClass="editor-post-featured-image__media-modal"
        render={ ({ open }) => (<div>
          <video><source src={ videoURL } /></video>
          <Button onClick={ open } isDefault isLarge>{ __('Replace Video', 'benenson') }</Button>
        </div>) }
      />
      <Button onClick={ this.removeVideo } isLink isDestructive>
        { __('Remove Video', 'benenson') }
      </Button>
    </PanelBody>);
  }

  backgroundMediaFields() {
    const { type = '', imageURL = '', videoURL = '' } = this.props.attributes;

    if (!type && imageURL) {
      return (<img className="imageBlock-image" src={ imageURL } />);
    }

    if (videoURL && (this.state.video.source_url || this.state.video.url)) {
      return (<video className="imageBlock-video"><source src={ videoURL } /></video>);
    }

    return '';
  }

  render() {
    const { attributes, setAttributes } = this.props;
    const {
      type = '',
      style = 'loose',
      parallax = false,
      align = 'default',
      hasOverlay = false,
      imageURL = '',
      caption,
      buttons = [],
    } = attributes;

    const classes = classnames('imageBlock', {
      'imageBlock--fixed': style === 'fixed',
      'has-video': type === 'video',
      'has-parallax': parallax,
      [`align${align}`]: align !== 'default',
    });

    const capClasses = classnames('imageBlock-caption', {
      [`align${align}`]: align !== 'default',
    });

    return (<Fragment>
      <InspectorControls>
        <PanelBody>
          <SelectControl
            label={ __('Background Type', 'benenson') }
            options={ [{
              label: __('Image', 'benenson'),
              value: '',
            }, {
              label: __('Video', 'benenson'),
              value: 'video',
            }] }
            value={ type }
            onChange={ newType => setAttributes({ type: newType }) }
          />
        </PanelBody>

        { this.imagePanelControls() }

        <PanelBody>
          <ToggleControl
            label={ __('Display Overlay', 'benenson') }
            checked={ hasOverlay }
            onChange={ newHasOverlay => setAttributes({ hasOverlay: newHasOverlay }) }
          />
          <ToggleControl
            label={ __('Enable Parallax', 'benenson') }
            checked={ parallax }
            onChange={ newParallax => setAttributes({
              parallax: newParallax,
              style: newParallax ? 'loose' : style,
            }) }
          />
        </PanelBody>

        { this.videoPanelControls() }
      </InspectorControls>

      <div className={ classes }>
        { this.backgroundMediaFields() }
        { this.overlayInputFields() }
      </div>

      <RichText
        className={ capClasses }
        rows="1"
        placeholder={ __('(Insert Caption, if required)', 'benenson') }
        value={ caption }
        onChange={ newCaption => setAttributes({ caption: newCaption }) }
      />

      { this.imageInlineControls() }
      <div className="clear"></div>
    </Fragment>);
  }
}
