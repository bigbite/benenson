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
    blocks: {
      type: 'array',
      default: [],
    },
    hasArrows: {
      type: 'boolean',
      default: true,
    },
    showTabs: {
      type: 'boolean',
      default: true,
    },
  },

  edit: DisplayComponent,

  save({ attributes }) {
    const dateFormat = __experimentalGetSettings().formats.date;

    return (
      <div className="timeline">
        <div className="timeline-container">
          <div class="timeline-line"></div>
          <div className="timelineBlocks">
            { attributes.blocks.length > 0 && attributes.blocks.map((block, index) => {
              const blockDate = block.date !== '' ? <p className="timelineBlock-dateTime">{ dateI18n(dateFormat, block.date) }</p> : null;
              const blockTitle = block.title !== '' ? <p className="timelineBlock-title">{ block.title }</p> : null;
              const blockContent = block.content !== '' ? <p className="timelineBlock-text">{ block.content }</p> : null;

              return (
                <div className="timelineBlock">
                  { blockDate }
                  <div className="timelineBlock-content">
                    { blockTitle }
                    { blockContent }
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
