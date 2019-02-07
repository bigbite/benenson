import classnames from 'classnames';

const randId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
  InspectorControls, RichText, URLInputButton,
} = wp.editor;
const {
  PanelBody, Button, DateTimePicker, ColorPicker, SelectControl, ToggleControl,
} = wp.components;
const { applyFilters } = wp.hooks;
const { PostMediaSelector } = benenson.components;

class DisplayComponent extends Component {
  componentDidMount() {
    const { attributes, setAttributes } = this.props;

    if (!attributes.countdownId) {
      setAttributes({
        countdownId: randId(),
      });
    }
  }

  render() {
    const { attributes, setAttributes } = this.props;
    const {
      countdownId = '',
      date = new Date(),
      title = '',
      revealTitle = '',
      revealContent = '',
      revealBtnText = '',
      revealBtnUrl = '',
      backgroundColor = '',
      backgroundId = null,
      backgroundUrl = '',
      textColor = '',
      hideTimer = false,
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
            <ToggleControl
              label={ __('Hide timer', 'benenson') }
              help={ __('When the timer has finished hide it from users.', 'benenson') }
              checked={ hideTimer }
              onChange={ hideShow => setAttributes({ hideTimer: hideShow }) }
            />
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
          <div className="countdownTimer-reveal">
            <RichText
              tagName="h2"
              className="countdownTimer-title"
              onChange={ newTitle => setAttributes({ revealTitle: newTitle }) }
              value={ revealTitle }
              placeholder={ __('(Insert Reveal Title)', 'benenson') }
              keepPlaceholderOnFocus={ true }
              formattingControls={ [] }
              format="string"
            />
            <RichText
              tagName="h2"
              className="countdownTimer-content"
              onChange={ newContent => setAttributes({ revealContent: newContent }) }
              value={ revealContent }
              placeholder={ __('(Insert Reveal Content)', 'benenson') }
              keepPlaceholderOnFocus={ true }
              formattingControls={ [] }
              format="string"
            />
            <div className="countdownTimer-btn btn">
              <RichText
                tagName="p"
                onChange={ newCtaText => setAttributes({ revealBtnText: newCtaText }) }
                value={ revealBtnText }
                placeholder={ __('(Insert Link text)', 'benenson') }
                keepPlaceholderOnFocus={ true }
                formattingControls={ [] }
                format="string"
              />
              <URLInputButton
                url={ revealBtnUrl }
                onChange={ newCtaLink => setAttributes({ revealBtnUrl: newCtaLink }) }
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DisplayComponent;
