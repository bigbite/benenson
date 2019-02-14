import classnames from 'classnames';

const randId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { applyFilters } = wp.hooks;
const {
  PanelBody, Button, TextControl, ToggleControl, SelectControl,
} = wp.components;
const {
  InspectorControls, RichText, BlockIcon, URLInputButton,
} = wp.editor;
const { PostMediaSelector } = benenson.components;

class DisplayComponent extends Component {
  static emptySlide = {
    id: '',
    title: '',
    imageId: '',
    imageUrl: '',
    imageLink: '',
    newTab: false,
  };

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
        } = {}) => {
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
        };

  addSlide = () => {
    const { attributes, setAttributes } = this.props;

    setAttributes({
      slides: [...attributes.slides, {
        ...DisplayComponent.emptySlide,
        id: randId(),
      }],
    });

    this.setState({
      selectedSlide: attributes.slides.length,
    });
  };

  deleteSlide = (index) => {
    const { attributes, setAttributes } = this.props;

    if (index === attributes.slides.length - 1) {
      this.setState({
        selectedSlide: index - 1,
      });
    }

    this.props.setAttributes({
      slides: [
        ...attributes.slides.slice(0, Math.max(0, index)),
        ...attributes.slides.slice(index + 1, attributes.slides.length),
      ],
    });
  };

  initiateDelete = () => {
    if (confirm(__('Are you sure you want to delete this logo from the slider?'))) { // eslint-disable-line no-restricted-globals, no-alert
      this.deleteSlide(this.state.selectedSlide);
    }
  };

  selectSlide = index => this.setState({
    selectedSlide: index,
  });

  createSelectSlide = index => () => this.selectSlide(index);

  movePrev = () => {
    const { selectedSlide } = this.state;

    const slideOrder = [...this.props.attributes.slides];
    const temp = slideOrder[selectedSlide];
    slideOrder[selectedSlide] = slideOrder[selectedSlide - 1];
    slideOrder[selectedSlide - 1] = temp;

    this.props.setAttributes({
      slides: slideOrder,
    });

    this.setState({
      selectedSlide: selectedSlide - 1,
    });
  };

  moveNext = () => {
    const { selectedSlide } = this.state;

    const slideOrder = [...this.props.attributes.slides];
    const temp = slideOrder[selectedSlide];
    slideOrder[selectedSlide] = slideOrder[selectedSlide + 1];
    slideOrder[selectedSlide + 1] = temp;

    this.props.setAttributes({
      slides: slideOrder,
    });

    this.setState({
      selectedSlide: selectedSlide + 1,
    });
  };

  render() {
    const { attributes, setAttributes } = this.props;
    const { selectedSlide } = this.state;

    const currentSlide = attributes.slides[selectedSlide];
    const updateSlide = this.createUpdateSlideAttribute(selectedSlide);

    const controls = (
      <InspectorControls>
        <ToggleControl
          label={ __('Show Arrows', 'benenson') }
          checked={ attributes.hasArrows }
          onChange={ this.createUpdateAttribute('hasArrows') }
        />
        { currentSlide && (
          <PanelBody title={ __('Slide Options', 'benenson') }>
            <TextControl
              label="Slide title"
              value={ currentSlide.title }
              onChange={ updateSlide('title') }
            />
            <ToggleControl
              label={ __('Open link in new tab', 'benenson') }
              checked={ currentSlide.newTab }
              onChange={ updateSlide('newTab') }
            />
            { attributes.slides.length >= 2 && (
                <p>Change milestone position:</p>
            )}
            { selectedSlide !== 0 && (
              <Button onClick={ this.movePrev } className="is-button is-default is-large" style={ { marginRight: '10px' } }>Move back</Button>
            )}
            { selectedSlide < attributes.slides.length - 1 && (
              <Button onClick={ this.moveNext } className="is-button is-default is-large">Move forward</Button>
            )}
          </PanelBody>
        ) }
      </InspectorControls>
    );

    return (
      <Fragment>
        { controls }
        <div className="logoSlider">
          <div class="logoSlides-container">
            <div class="logoSlides">
              { attributes.slides.length === 0 && (
                <div className="logoSlide">
                  <div className="logoSlide-contentContainer">
                    <h1 className="logoSlide-title">{ __('Add a logo below.', 'benenson') }</h1>
                    <button className="btn btn--white" onClick={ this.addSlide }>{ __('Add Logo', 'benenson') }</button>
                  </div>
                </div>
              ) }
              { currentSlide && (
                <div className="logoSlide">
                  <PostMediaSelector
                    mediaId={ currentSlide.imageId }
                    onUpdate={ this.createUpdateImage(selectedSlide) }
                  />
                  <URLInputButton
                    url={ currentSlide.imageLink }
                    onChange={ updateSlide('imageLink') }
                  />
                </div>
              ) }
            </div>
          </div>
          <nav className="logoSlider-nav">
          { currentSlide && (
            <div className="logoSlider-navActions">
              <button className="logoSlider-navButton btn" onClick={ this.initiateDelete }>{ __('Remove Slide', 'benenson') }</button>
              <button className="logoSlider-navButton btn" onClick={ this.addSlide }>{ __('Add Slide', 'benenson') }</button>
            </div>
          ) }
          { attributes.slides.length > 0 && attributes.slides.map((slide, index) => {
            const slideTitle = slide.title && slide.title !== '';

            if (selectedSlide === index) {
              return (
                <div className="logoSlider-navButton is-active btn">
                    <span>{ slideTitle ? slide.title : __('(No Title)', 'benenson') }</span>
                </div>
              );
            }

            return (
              <button className="logoSlider-navButton btn" onClick={ this.createSelectSlide(index) }>
                { slideTitle ? slide.title : __('(No Title)', 'benenson') }
              </button>
            );
          }) }
          </nav>
        </div>
      </Fragment>
    );
  }
}

export default DisplayComponent;
