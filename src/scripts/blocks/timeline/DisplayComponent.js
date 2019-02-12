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
  static emptyMilestone = {
    id: '',
    date: new Date(),
    title: '',
    content: '',
  };

  constructor(...props) {
    super(...props);

    this.state = {
      selectedMilestone: 0,
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

  createUpdateMilestoneAttribute =
  index =>
    key =>
      value =>
        this.props.setAttributes({
          milestones: [
            ...this.props.attributes.milestones
              .slice(0, Math.max(0, index)),
            {
              ...this.props.attributes.milestones[index],
              [key]: value,
            },
            ...this.props.attributes
              .milestones.slice(index + 1, this.props.attributes.milestones.length),
          ],
        });

  addMilestone = () => {
    this.setState({
      selectedMilestone: this.props.attributes.milestones.length,
    });

    this.props.setAttributes({
      milestones: [
        ...this.props.attributes.milestones,
        {
          ...DisplayComponent.emptyMilestone,
          id: randId(),
        },
      ],
    });
  };

  deleteMilestone = (index) => {
    if (index === this.props.attributes.Milestones.length - 1) {
      this.setState({
        selectedMilestone: index - 1,
      });
    }

    this.props.setAttributes({
      milestones: [
        ...this.props.attributes
          .milestones.slice(0, Math.max(0, index)),
        ...this.props.attributes
          .milestones.slice(index + 1, this.props.attributes.milestones.length),
      ],
    });
  };

  initiateDelete = () => {
    if (confirm(__('Are you sure you want to delete this milestone from the timeline?', 'benenson'))) { // eslint-disable-line no-restricted-globals, no-alert
      this.deleteMilestone(this.state.selectedMilestone);
    }
  };

  selectMilestone = index => this.setState({
    selectedMilestone: index,
  });

  createSelectMilestone = index => () => this.selectMilestone(index);

  render() {
    const { attributes } = this.props;
    const { selectedMilestone } = this.state;

    const currentMilestone = attributes.milestones[selectedMilestone];
    const updateMilestone = this.createUpdateMilestoneAttribute(selectedMilestone);

    const dateFormat = __experimentalGetSettings().formats.date;

    const controls = (
      <InspectorControls>
        { currentMilestone && (
          <PanelBody title={ __('Timeline Milestone Options', 'benenson') }>
            <DateTimePicker
              currentDate={ currentMilestone.date }
              onChange={updateMilestone('date')}
            />
          </PanelBody>
        ) }
      </InspectorControls>
    );

    return (
      <Fragment>
        { controls }
        <div className="timmeline">
          <div class="timeline-container">
            <div className="timelineMilestones">
              { attributes.milestones.length === 0 && (
                <div className="timmelineMilestone">
                  <div className="timmelineMilestone-contentContainer">
                    <h1 className="timmelineMilestone-title">{ __('Add a milestone below.', 'benenson') }</h1>
                    <button className="btn btn--white" onClick={this.addMilestone}>{ __('Add milestone', 'benenson') }</button>
                  </div>
                </div>
              ) }
              { currentMilestone && (
                <div class="timelineMilestone">
                  <p className="timelineMilestone-dateTime">{ dateI18n(dateFormat, currentMilestone.date) }</p>
                  <div className="timelineMilestone-content">
                    <RichText
                      tagname="p"
                      className="timelineMilestone-title"
                      placeholder={ __('(Title)', 'benenson') }
                      value={currentMilestone.title}
                      onChange={updateMilestone('title')}
                      formattingControls={[]}
                      keepPlaceholderOnFocus={ true }
                      format="string"
                    />
                    <RichText
                      tagname="p"
                      className="timelineMilestone-text"
                      placeholder={ __('(Content)', 'benenson') }
                      value={currentMilestone.content}
                      onChange={updateMilestone('content')}
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
          { currentMilestone && (
            <div className="timeline-navActions">
              <button className="timeline-navButton btn" onClick={ this.initiateDelete }>{ __('Remove Milestone', 'benenson') }</button>
              <button className="timeline-navButton btn" onClick={ this.addMilestone }>{ __('Add Milestone', 'benenson') }</button>
            </div>
          ) }
          { attributes.milestones.length > 0 && attributes.milestones.map((milestone, index) => {
                const milestoneTitle = milestone.title && milestone.title !== '';

                if (selectedMilestone === index) {
                  return (
                    <div className="timeline-navButton is-active btn">
                        <span>{milestoneTitle ? milestone.title : __('(No Title)', 'benenson')}</span>
                    </div>
                  );
                }

                return (
                  <button className="timeline-navButton btn" onClick={ this.createSelectMilestone(index) }>
                    {milestoneTitle ? milestone.title : __('(No Title)', 'benenson')}
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
