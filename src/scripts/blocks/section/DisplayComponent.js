import classNames from 'classnames';
import PostMediaSelector from '../PostMediaSelector';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl, TextControl } = wp.components;
const { InspectorControls, InnerBlocks } = wp.editor;

class DisplayComponent extends Component {
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  onMediaChange = (media) => {
    if (media) {
      this.props.setAttributes({
        mediaId: media.id,
        mediaUrl: media.source_url,
      });
      return;
    }

    this.props.setAttributes({
      mediaId: null,
      mediaUrl: null,
    });
  };

  render() {
    const { attributes } = this.props;
    const styles = {
      backgroundImage: `url(${attributes.mediaUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    };

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <SelectControl
            label={ __('Background Colour', 'benenson') }
            options={ [{
              label: __('White', 'benenson'),
              value: '',
            }, {
              label: __('Grey', 'benenson'),
              value: 'grey',
            }] }
            value={ attributes.background }
            onChange={ this.createUpdateAttribute('background') }
          />
          <SelectControl
            label={ __('Padding', 'benenson') }
            options={ [{
              label: __('Normal', 'benenson'),
              value: '',
            }, {
              label: __('Small', 'benenson'),
              value: 'small',
            }, {
              label: __('None', 'benenson'),
              value: 'no-padding',
            }] }
            value={ attributes.padding }
            onChange={ this.createUpdateAttribute('padding') }
          />
          <SelectControl
            label={ __('Width', 'benenson') }
            options={ [{
              label: __('Normal', 'benenson'),
              value: '',
            }, {
              label: __('Narrow', 'benenson'),
              value: 'narrow',
            }, {
              label: __('Wide', 'benenson'),
              value: 'wide',
            }] }
            value={ attributes.width }
            onChange={ this.createUpdateAttribute('width') }
          />
          <TextControl
            label={ __('Id (scroll location)', 'benenson') }
            onChange={ this.createUpdateAttribute('id') }
            value={ attributes.id }
          />
        </PanelBody>
        <PanelBody title={ __('Background Image', 'benenson') }>
          <PostMediaSelector
            onUpdate={ this.onMediaChange }
            mediaId={ attributes.mediaId }
          />
        </PanelBody>
      </InspectorControls>
      <section className={ classNames({
        section: true,
        'section--tinted': attributes.background === 'grey',
        [`section--${attributes.padding}`]: !!attributes.padding,
      }) } style={ attributes.mediaUrl ? styles : null }>
        <div className="container">
          <InnerBlocks />
        </div>
      </section>
    </Fragment>);
  }
}

export default DisplayComponent;
