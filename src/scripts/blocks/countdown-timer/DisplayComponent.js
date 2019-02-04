import classnames from 'classnames';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
  InspectorControls, RichText,
} = wp.editor;
const {
  PanelBody, Button, DateTimePicker, ColorPicker, SelectControl,
} = wp.components;
const { applyFilters } = wp.hooks;
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
      textColor = '',
    } = attributes;

    // Note: US English spelling.
    const colourOptions = applyFilters('benenson.block.blockCountdown.colorOptions', [{
      label: __('White', 'benenson'),
      value: '',
    }, {
      label: __('Black', 'benenson'),
      value: 'black',
    }]);

    const styles = {
      backgroundImage: `url('${backgroundUrl}')`,
      backgroundColor,
    };

    const classes = classnames('countdownTimer', {
      [`is-${textColor}`]: !!textColor,
    });

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title={ __('Options', 'benenson') }>
            <SelectControl
              label={ __('Text Colour', 'benenson') }
              value={ textColor }
              onChange={ color => setAttributes({ textColor: color }) }
              options={ colourOptions }
            />
            <DateTimePicker
              currentDate={ date }
              onChange={ newDate => setAttributes({ date: newDate }) }
            />
          </PanelBody>
          <PanelBody title={ __('Background colour', 'benenson') }>
            <ColorPicker
              color={ backgroundColor }
              onChangeComplete={ color => setAttributes({ backgroundColor: color.hex }) }
              disableAlpha={ true }
            />
            <Button
              className="components-button is-button is-default is-large"
              onClick={ () => setAttributes({ backgroundColor: '' }) }
            >
            { __('Remove background colour', 'benenson') }
            </Button>
          </PanelBody>
          <PanelBody title={ __('Background Image', 'benenson') }>
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
        <div className={ classes } style={ styles }>
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
              <p><span>00</span>{ __('Days', 'benenson') }</p>
            </div>
            <div className="countdownTimer-item countdownTimer-hours">
              <p><span>00</span>{ __('Hours', 'benenson') }</p>
            </div>
            <div className="countdownTimer-item countdownTimer-mins">
              <p><span>00</span>{ __('Minutes', 'benenson') }</p>
            </div>
            <div className="countdownTimer-item countdownTimer-secs">
              <p><span>00</span>{ __('Seconds', 'benenson') }</p>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DisplayComponent;
