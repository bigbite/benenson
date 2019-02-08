import classnames from 'classnames';

const randId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { applyFilters } = wp.hooks;
const {
  PanelBody, Button, TextControl, ToggleControl, SelectControl, DateTimePicker,
} = wp.components;

const {
  InspectorControls, RichText, BlockIcon, URLInputButton,
} = wp.editor;

const { PostMediaSelector } = benenson.components;

const { dateI18n, format, __experimentalGetSettings } = wp.date;

class DisplayComponent extends Component {
  static emptyBlock = {
    id: '',
    date: new Date(),
    title: '',
    content: '',
  };

  constructor(...props) {
    super(...props);

    this.state = {
      selectedBlock: 0,
    };
  }

  /**
   * Higher order component that takes the attribute key,
   * this then returns a function which takes a value,
   * when called it updates the attribute with the key.
   * @param key
   * @returns {function(*): *}
   */
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  createUpdateBlockAttribute =
  index =>
    key =>
      value =>
        this.props.setAttributes({
          blocks: [
            ...this.props.attributes.blocks
              .slice(0, Math.max(0, index)),
            {
              ...this.props.attributes.blocks[index],
              [key]: value,
            },
            ...this.props.attributes
              .blocks.slice(index + 1, this.props.attributes.blocks.length),
          ],
        });

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

  deleteBlock = (index) => {
    if (index === this.props.attributes.blocks.length - 1) {
      this.setState({
        selectedBlock: index - 1,
      });
    }

    this.props.setAttributes({
      blocks: [
        ...this.props.attributes
          .blocks.slice(0, Math.max(0, index)),
        ...this.props.attributes
          .blocks.slice(index + 1, this.props.attributes.blocks.length),
      ],
    });
  };

  initiateDelete = () => {
    if (confirm(__('Are you sure you want to delete this block from the timeline?', 'benenson'))) { // eslint-disable-line no-restricted-globals, no-alert
      this.deleteBlock(this.state.selectedBlock);
    }
  };

  selectBlock = index => this.setState({
    selectedBlock: index,
  });

  createSelectBlock = index => () => this.selectBlock(index);

  render() {
    const { attributes } = this.props;
    const { selectedBlock } = this.state;

    const currentBlock = attributes.blocks[selectedBlock];
    const updateBlock = this.createUpdateBlockAttribute(selectedBlock);

    const dateFormat = __experimentalGetSettings().formats.date;

    const controls = (
      <InspectorControls>
        { attributes.blocks.length > 0 && (
          <PanelBody title={ __('Timeline Block Options', 'benenson') }>
            <DateTimePicker
              currentDate={ attributes.date }
              onChange={updateBlock('date')}
            />
          </PanelBody>
        ) }
        <PanelBody title={ __('Options', 'benenson') }>
          <ToggleControl
            label={__('Show Arrows', 'benenson')}
            checked={attributes.hasArrows}
            onChange={this.createUpdateAttribute('hasArrows')}
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
            <div className="timelineBlocks">
              { attributes.blocks.length === 0 && (
                <div className="timmelineBlock">
                  <div className="timmelineBlock-contentContainer">
                    <h1 className="timmelineBlock-title">{ __('Add a block below.', 'benenson') }</h1>
                    <button className="btn btn--white" onClick={this.addBlock}>{ __('Add block', 'benenson') }</button>
                  </div>
                </div>
              ) }
              { currentBlock && (
                <div class="timelineBlock">
                  <p className="timelineBlock-dateTime">{ dateI18n(dateFormat, currentBlock.date) }</p>
                  <div className="timelineBlock-content">
                    <RichText
                      tagname="p"
                      className="timelineBlock-title"
                      placeholder={ __('(Title)', 'benenson') }
                      value={currentBlock.title}
                      onChange={updateBlock('title')}
                      formattingControls={[]}
                      keepPlaceholderOnFocus={ true }
                      format="string"
                    />
                    <RichText
                      tagname="p"
                      className="timelineBlock-text"
                      placeholder={ __('(Content)', 'benenson') }
                      value={currentBlock.content}
                      onChange={updateBlock('content')}
                      formattingControls={[]}
                      keepPlaceholderOnFocus={ true }
                      format="string"
                    />
                  </div>
                </div>
              ) }
            </div>
          </div>
          <nav className="timeline-nav">
          { currentBlock && (
            <div className="timeline-navActions">
              <button className="timeline-navButton btn" onClick={ this.initiateDelete }>{ __('Remove Block', 'benenson') }</button>
              <button className="timeline-navButton btn" onClick={ this.addBlock }>{ __('Add Block', 'benenson') }</button>
            </div>
          ) }
          { attributes.blocks.length > 0 && attributes.blocks.map((block, index) => {
                const blockTitle = block.title && block.title !== '';

                if (selectedBlock === index) {
                  return (
                    <div className="timeline-navButton is-active btn">
                        <span>{blockTitle ? block.title : __('(No Title)', 'benenson')}</span>
                    </div>
                  );
                }

                return (
                  <button className="timeline-navButton btn" onClick={ this.createSelectBlock(index) }>
                    {blockTitle ? block.title : __('(No Title)', 'benenson')}
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
