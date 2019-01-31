const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
  InspectorControls, RichText,
} = wp.editor;
const {
  PanelBody, Button, DateTimePicker, ColorPicker,
} = wp.components;

const { PostMediaSelector } = benenson.components;

class DisplayComponent extends Component {
  render() {
    const { attributes, setAttributes } = this.props;
    const {
      date = new Date(),
      title = '',
      backgroundColor = '',
      backgroundId = null,
      backgroundUrl = '',

    } = attributes;

    const styles = {
      backgroundImage: `url('${backgroundUrl}')`,
      backgroundColor,
    };

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title={ __('Date/Time', 'benenson') }>
            <DateTimePicker
              currentDate={ attributes.date }
              onChange={ newDate => setAttributes({ date: newDate }) }
              // is12Hour={ is12HourTime }
            />
          </PanelBody>
          <PanelBody title={ __('Background color', 'benenson') }>
            <ColorPicker
              color={ backgroundColor }
              onChangeComplete={ color => setAttributes({ backgroundColor: color.hex }) }
              disableAlpha
            />
            <Button
              className="components-button is-button is-default is-large"
              onClick={ () => setAttributes({ backgroundColor: '' }) }
            >
            {__('Remove background colour', 'benenson')}
            </Button>
          </PanelBody>
          <PanelBody title={ __('Background image', 'benenson') }>
            <PostMediaSelector
              onUpdate={ (media) => {
                  setAttributes({
                    backgroundUrl: media ? media.source_url : '',
                    backgroundId: media ? media.id : null,
                  });
                }
              }
              mediaId={ backgroundId }
            />
          </PanelBody>
        </InspectorControls>
        <div className="countdownTimer" style={ styles }>
          <RichText
            tagName="h2"
            className="countdownTimer-title"
            onChange={ newTitle => setAttributes({ title: newTitle }) }
            value={ title }
            placeholder={ __('(Insert Title)', 'benenson') }
            keepPlaceholderOnFocus={ true }
            formattingControls={ [] }
            format="string"
          />
          <div className="countdownTimer-items">
            <div className="countdownTimer-item countdownTimer-days">
              <p>10</p>
            </div>
            <div className="countdownTimer-item countdownTimer-hours">
              <p>5</p>
            </div>
            <div className="countdownTimer-item countdownTimer-mins">
              <p>55</p>
            </div>
            <div className="countdownTimer-item countdownTimer-secs">
              <p>12</p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DisplayComponent;
