import assign from 'lodash-es/assign';
import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

const { dateI18n, format, __experimentalGetSettings } = wp.date;

registerBlockType('benenson/timeline', {
  title: __('Timeline', 'benenson'),
  icon: 'admin-post',
  category: 'benenson',
  keywords: [
    __('Timeline', 'benenson'),
  ],
  supports: {
    multiple: true,
  },
  attributes: {
    timelineId: {
      type: 'string',
    },
    milestones: {
      type: 'array',
      default: [],
    },
  },

  edit: DisplayComponent,

  save({ attributes }) {
    const dateFormat = __experimentalGetSettings().formats.date;

    return (
      <div className="timeline">
        <div className="timeline-container">
          <div class="timeline-line"></div>
          <div className="timelineMilestones">
            { attributes.milestones.length > 0 && attributes.milestones.map((milestone, index) => {
              const milestoneDate = milestone.date !== '' ? <p className="timelineMilestone-dateTime">{ dateI18n(dateFormat, milestone.date) }</p> : null;
              const milestoneTitle = milestone.title !== '' ? <p className="timelineMilestone-title">{ milestone.title }</p> : null;
              const milestoneContent = milestone.content !== '' ? <p className="timelineMilestone-text">{ milestone.content }</p> : null;

              return (
                <div className="timelineMilestone">
                  { milestoneDate }
                  <div className="timelineMilestone-content">
                    { milestoneTitle }
                    { milestoneContent }
                  </div>
                </div>
              );
            }) }
          </div>
        </div>
      </div>
    );
  },
});
