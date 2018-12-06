import classnames from 'classnames';
import PostMediaSelector from '../PostMediaSelector';

const randId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
  PanelBody, Button, TextControl, ToggleControl, SelectControl,
} = wp.components;

const {
  InspectorControls, RichText, BlockIcon, URLInputButton,
} = wp.editor;

class DisplayComponent extends Component {
  static emptySlide = {
    id: '',
    title: '',
    heading: '',
    subheading: '',
    content: '',
    imageId: '',
    imageUrl: '',
    callToActionText: '',
    callToActionLink: '',
    alignment: '',
    background: '',
    hideContent: false,
    sizes: {},
  };

  static alignmentOptions = [
    /* translators: text alignment. for RTL languages, localise as 'Right' */
    { label: __('Left', 'benenson'), value: '' },
    { label: __('Centre', 'benenson'), value: 'center' },
    /* translators: text alignment. for RTL languages, localise as 'Left' */
    { label: __('Right', 'benenson'), value: 'right' },
  ];

  static backgroundOptions = [
    { label: __('Opaque', 'benenson'), value: '' },
    { label: __('Translucent', 'benenson'), value: 'opaque' },
    { label: __('Transparent', 'benenson'), value: 'transparent' },
  ];

  constructor(...props) {
    super(...props);

    this.state = {
      selectedSlide: 0,
    };
  }

  componentDidMount() {
    const { attributes, setAttributes } = this.props;

    if (!attributes.sliderId) {
      setAttributes({
        sliderId: randId(),
      });
    }

    attributes.slides.forEach((slide, index) => {
      if (!slide.id) {
        this.createUpdateSlideAttribute(index)('id')(randId());
      }

      if (!slide.sizes && slide.imageId) {
        this.requestSizes(index);
      }
    });
  }

  requestSizes(index) {
    const { attributes, setAttributes } = this.props;
    const { slides } = attributes;
    const { imageId } = slides[index];

    const update = this.createUpdateSlideAttribute(index)('sizes');

    wp.apiRequest({ path: `/wp/v2/media/${imageId}` })
      .then(resp => update(resp.media_details.sizes));
  }

  /**
   * Higher order component that takes the attribute key,
   * this then returns a function which takes a value,
   * when called it updates the attribute with the key.
   * @param key
   * @returns {function(*): *}
   */
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  createUpdateSlideAttribute =
      index =>
        key =>
          value =>
            this.props.setAttributes({
              slides: [
                ...this.props.attributes.slides
                  .slice(0, Math.max(0, index)),
                {
                  ...this.props.attributes.slides[index],
                  [key]: value,
                },
                ...this.props.attributes
                  .slides.slice(index + 1, this.props.attributes.slides.length),
              ],
            });

  createUpdateImage =
      index =>
        ({
          id: imageId = false,
          source_url: imageUrl = false,
          media_details: {
            sizes,
          } = {},
        } = {}) =>
          this.props.setAttributes({
            slides: [
              ...this.props.attributes.slides
                .slice(0, Math.max(0, index)),
              {
                ...this.props.attributes.slides[index],
                imageId,
                imageUrl,
                sizes,
              },
              ...this.props.attributes
                .slides.slice(index + 1, this.props.attributes.slides.length),
            ],
          });

  deleteSlide = (index) => {
    if (index === this.props.attributes.slides.length - 1) {
      this.setState({
        selectedSlide: index - 1,
      });
    }

    this.props.setAttributes({
      slides: [
        ...this.props.attributes
          .slides.slice(0, Math.max(0, index)),
        ...this.props.attributes
          .slides.slice(index + 1, this.props.attributes.slides.length),
      ],
    });
  };

  addSlide = () => {
    this.setState({
      selectedSlide: this.props.attributes.slides.length,
    });

    this.props.setAttributes({
      slides: [
        ...this.props.attributes.slides,
        {
          ...DisplayComponent.emptySlide,
          id: randId(),
        },
      ],
    });
  };

  createDeleteSlide = index => () => this.deleteSlide(index);

  selectSlide = index => this.setState({
    selectedSlide: index,
  });

  createSelectSlide = index => () => this.selectSlide(index);

  initiateDelete = () => {
    if (confirm(__('Do you wish to delete this slide? This action is irreversible', 'benenson'))) { // eslint-disable-line no-restricted-globals, no-alert
      this.deleteSlide(this.state.selectedSlide);
    }
  };

  nextSlide = () => this.setState({
    selectedSlide:
      this.state.selectedSlide === this.props.attributes.slides.length - 1 ?
        0 : this.state.selectedSlide + 1,
  });

  prevSlide = () => this.setState({
    selectedSlide: this.state.selectedSlide === 0 ?
      this.props.attributes.slides.length - 1 : this.state.selectedSlide - 1,
  });

  render() {
    const { attributes } = this.props;
    const { selectedSlide } = this.state;

    const currentSlide = attributes.slides[selectedSlide];
    const updateSlide = this.createUpdateSlideAttribute(selectedSlide);

    const controls = (
        <InspectorControls>
          <PanelBody title={ __('Options', 'benenson') }>
            <ToggleControl
              label={__('Show Arrows', 'benenson')}
              checked={attributes.hasArrows}
              onChange={this.createUpdateAttribute('hasArrows')}
            />

            <ToggleControl
              label={__('Has Content', 'benenson')}
              checked={attributes.hasContent}
              onChange={this.createUpdateAttribute('hasContent')}
              help={<span>{ __('By disabling this you will hide the content in *ALL* slides. To disable this on only one slide, select the desired slide and toggle the "Hide Content" field in the "Slide Options" panel.', 'benenson') }</span>} // eslint-disable-line max-len
            />

            <ToggleControl
              label={__('Show Tabs', 'benenson')}
              checked={attributes.showTabs}
              onChange={this.createUpdateAttribute('showTabs')}
              help={<span>{ __('Hide the tabs on the front end, these will still show in the panel to allow you to navigate through each slide.', 'benenson') }</span>} // eslint-disable-line max-len
            />
          </PanelBody>

          { attributes.slides.length > 0 && (
            <PanelBody title={ __('Slide Options', 'benenson') }>
              <TextControl
                label={ __('Slide Title', 'benenson') }
                onChange={updateSlide('title')}
                value={currentSlide.title}
              />
              <label style={{
                display: 'block',
                marginBottom: '5px',
              }}>Slide Background</label>
              <PostMediaSelector
                mediaId={currentSlide.imageId}
                onUpdate={this.createUpdateImage(selectedSlide)}
              />
              <hr />
              <SelectControl
                label={__('Content Alignment', 'benenson')}
                value={currentSlide.alignment}
                options={DisplayComponent.alignmentOptions}
                onChange={updateSlide('alignment')}
              />
              <SelectControl
                label={__('Background Style', 'benenson')}
                value={currentSlide.background}
                options={DisplayComponent.backgroundOptions}
                onChange={updateSlide('background')}
              />
              <ToggleControl
                label={__('Hide Content', 'benenson')}
                checked={currentSlide.hideContent}
                onChange={updateSlide('hideContent')}
                help={<span>{ __('By enabling this you will hide the content on *THIS* slide. To disable content on all slides go to the "Options" and toggle the "Has Content" field.', 'benenson') }</span>} // eslint-disable-line max-len
              />

              <hr />
              <Button isDestructive isLink onClick={this.initiateDelete}>{__('Remove Slide', 'benenson')}</Button>
              <p><em><small>{__('This is irreversible.', 'benenson')}</small></em></p>
            </PanelBody>
          ) }
        </InspectorControls>
    );

    return (
      <Fragment>
        { controls }
        <div>
          <div className="slider">
            <div className="slides-container">
              { attributes.hasArrows && [
                <button onClick={this.nextSlide} className="slides-arrow slides-arrow--next">{__('Next', 'benenson')}</button>,
                <button onClick={this.prevSlide} className="slides-arrow slides-arrow--previous">{__('Previous', 'benenson')}</button>,
              ] }
              <div className="slides">
                { attributes.slides.length === 0 && (
                  <div className="slide">
                    <div className="slide-contentContainer">
                      <h1 className="slide-title">{ __('Add a slide below.', 'benenson') }</h1>
                      <button className="btn btn--white" onClick={this.addSlide}>{ __('Add Slide', 'benenson') }</button>
                    </div>
                  </div>
                ) }

                { currentSlide && (
                  <div className={classnames({
                    slide: true,
                    [`is-${currentSlide.alignment}-aligned`]: !!currentSlide.alignment,
                    [`has-${currentSlide.background}-background`]: !!currentSlide.background,
                  })} style={{
                    backgroundImage: `url(${currentSlide.imageUrl || ''})`,
                  }}>
                    { !currentSlide.hideContent && attributes.hasContent && (
                      <div className="slide-contentContainer">
                        <h1 className="slide-title">
                          <RichText
                            tagname="span"
                            placeholder={ __('(Heading)', 'benenson') }
                            value={currentSlide.heading}
                            onChange={updateSlide('heading')}
                            formattingControls={[]}
                            keepPlaceholderOnFocus={ true }
                            format="string"
                          />
                        </h1>
                        <h2 className="slide-subtitle">
                          <RichText
                            tagname="span"
                            placeholder={ __('(Sub-Heading)', 'benenson') }
                            value={currentSlide.subheading}
                            onChange={updateSlide('subheading')}
                            formattingControls={[]}
                            keepPlaceholderOnFocus={ true }
                            format="string"
                          />
                        </h2>
                        <div className="slide-content">
                          <RichText
                            tagname="p"
                            placeholder={ __('(Content)', 'benenson') }
                            value={currentSlide.content}
                            onChange={updateSlide('content')}
                            formattingControls={[]}
                            keepPlaceholderOnFocus={ true }
                          />
                        </div>
                        <div className="slide-callToAction">
                          <div className="btn btn--white">
                            <RichText
                              tagname="span"
                              placeholder={ __('(Button Text)', 'benenson') }
                              value={currentSlide.callToActionText}
                              onChange={updateSlide('callToActionText')}
                              formattingControls={[]}
                              keepPlaceholderOnFocus={ true }
                              format="string"
                            />
                          </div>
                          <URLInputButton
                            url={ currentSlide.callToActionLink }
                            onChange={ updateSlide('callToActionLink') }
                          />
                        </div>
                      </div>
                    ) }
                  </div>
                )}
              </div>
            </div>
            <nav className="slider-nav">
              { attributes.slides.length > 0 && attributes.slides.map((slide, index) => {
                const slideTitle = slide.title && slide.title !== '';

                if (selectedSlide === index) {
                  return (
                    <div className="slider-navButton is-active">
                        <span>{slideTitle ? slide.title : __('(No Title)', 'benenson')}</span>
                    </div>
                  );
                }

                return (
                  <button className="slider-navButton" onClick={this.createSelectSlide(index)}>
                    {slideTitle ? slide.title : __('(No Title)', 'benenson')}
                  </button>
                );
              }) }

              <button className="slider-navButton" onClick={this.addSlide}>{ __('Add Slide', 'benenson') }</button>
            </nav>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DisplayComponent;
