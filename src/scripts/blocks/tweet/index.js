import classnames from 'classnames';

const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;
const { PanelBody, SelectControl, ToggleControl } = wp.components;
const { Component, Fragment } = wp.element;
const { InspectorControls, PlainText } = wp.editor;

const blockAttributes = {
  title: {
    type: 'string',
  },
  content: {
    type: 'string',
  },
  size: {
    type: 'string',
  },
  centred: {
    type: 'boolean',
  },
};

registerBlockType('benenson/tweet-block', {
  title: __('Tweet Action', 'benenson'),
  description: __('Add a Tweet Action block', 'benenson'),
  icon: 'twitter',
  category: 'benenson',
  supports: {
    className: false,
  },
  attributes: blockAttributes,

  edit: class extends Component {
    updateContent = (newContent) => {
      const { setAttributes } = this.props;
      let content = newContent;
      let { length } = content;
      let cropAt = 280;

      if (length <= cropAt) {
        return setAttributes({ content });
      }

      content.match(/https?:\/\/[^\s]+/g).forEach((link) => {
        length -= link.length;
        cropAt += link.length;

        // 23 is a t.co link length
        length += 23;
        cropAt -= 23;
      });

      // limit to maximum tweet length
      if (length > 280) {
        content = content.substring(0, cropAt);
      }

      return setAttributes({ content });
    }

    render() {
      const { attributes, setAttributes } = this.props;
      const {
        title = '',
        content = '',
        size = '',
        centred = false,
      } = attributes;

      const blockClasses = classnames('tweetAction', {
        'tweetAction--narrow': size === 'narrow',
        aligncentre: centred === true,
      });

      const buttonClasses = classnames([
        'btn',
        'btn--fill',
      ]);

      return (<Fragment>
        <InspectorControls>
          <PanelBody>
            <SelectControl
              label={ __('Size', 'benenson') }
              value={ size }
              onChange={ newSize => setAttributes({ size: newSize }) }
              options={ [
                { value: '', label: __('Default', 'benenson') },
                { value: 'narrow', label: __('Narrow', 'benenson') },
              ] }
            />
            <ToggleControl
              label={ __('Centre Align', 'benenson') }
              checked={ centred }
              onChange={ newValue => setAttributes({ centred: newValue }) }
            />
          </PanelBody>
        </InspectorControls>

        <div className={ blockClasses }>
          <div className="tweetAction-header">
            <span className="dashicons dashicons-twitter" aria-label="Twitter Logo"></span>
            <PlainText
              className="tweetAction-title"
              placeholder={ __('(Action Title)', 'benenson') }
              value={ title }
              onChange={ newTitle => setAttributes({ title: newTitle }) }
            />
          </div>
          <PlainText
            className="tweetAction-content"
            rows="11"
            placeholder={ __('(Place Tweet text proforma here)', 'benenson') }
            value={ content }
            onChange={ newContent => this.updateContent(newContent) }
          />
          <div>
            <button className={ buttonClasses } aria-label={ __('Send this Tweet', 'benenson') }>{ __('Send this Tweet', 'benenson') }</button>
          </div>
        </div>
      </Fragment>);
    }
  },

  save({ attributes }) {
    const {
      title = '',
      content = '',
      size = '',
      centred = false,
    } = attributes;

    const shareBase = 'https://twitter.com/intent/tweet';
    const fullUrl = `${shareBase}?text=${encodeURIComponent(content)}`;

    const blockClasses = classnames('tweetAction', {
      'tweetAction--narrow': size === 'narrow',
      aligncentre: centred === true,
    });

    const buttonClasses = classnames([
      'btn',
      'btn--fill',
    ]);

    return (<div className={ blockClasses }>
      <div className="tweetAction-header">
        <span className="dashicons dashicons-twitter" aria-label="Twitter Logo"></span>
        <h3 className="tweetAction-title">{ title }</h3>
      </div>
      <div className="tweetAction-content">{ content }</div>
      <div>
        <a className={ buttonClasses } href={ fullUrl } target="_blank" aria-label={ __('Send this Tweet', 'benenson') }>{ __('Send this Tweet', 'benenson') }</a>
      </div>
    </div>);
  },
});
