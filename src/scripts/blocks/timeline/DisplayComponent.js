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
  static emptyBlock = {
    id: '',
    date: new Date(),
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

  /**
   * Higher order component that takes the attribute key,
   * this then returns a function which takes a value,
   * when called it updates the attribute with the key.
   * @param key
   * @returns {function(*): *}
   */
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  addBlock = () => {
    this.setState({
      selectedBlock: this.props.attributes.blocks.length,
    });

    this.props.setAttributes({
      blocks: [
        ...this.props.attributes.blocks,
        {
          ...DisplayComponent.emptyBlock,
          id: randId(),
        },
      ],
    });
  };

  render() {
    const { attributes } = this.props;

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
      </InspectorControls>
    );

    return (
      <Fragment>
        { controls }
        <div className="timmeline">
          <div class="timeline-container">
            { attributes.hasArrows && [
              <button onClick={this.nextSlide} className="slides-arrow slides-arrow--next">{__('Next', 'benenson')}</button>,
              <button onClick={this.prevSlide} className="slides-arrow slides-arrow--previous">{__('Previous', 'benenson')}</button>,
            ] }
            <div className="timelineBlocks">
              { attributes.blocks.length === 0 && (
                <div className="timmelineBlock">
                  <div className="timmelineBlock-contentContainer">
                    <h1 className="timmelineBlock-title">{ __('Add a block below.', 'benenson') }</h1>
                    <button className="btn btn--white" onClick={this.addBlock}>{ __('Add block', 'benenson') }</button>
                  </div>
                </div>
              ) }
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DisplayComponent;
