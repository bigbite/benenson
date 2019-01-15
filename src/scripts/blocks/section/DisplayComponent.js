import classNames from 'classnames';

const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;
const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl, TextControl } = wp.components;
const { InspectorControls, InnerBlocks } = wp.editor;
const { PostMediaSelector } = benenson.components;

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
      backgroundPosition: 'center',
    };

    const backgroundOptions = applyFilters('benenson.block.section.backgroundOptions', [{
      label: __('White', 'benenson'),
      value: '',
    }, {
      label: __('Grey', 'benenson'),
      value: 'grey',
    }]);

    const paddingOptions = applyFilters('benenson.block.section.paddingOptions', [{
      label: __('Normal', 'benenson'),
      value: '',
    }, {
      label: __('Small', 'benenson'),
      value: 'small',
    }, {
      label: __('None', 'benenson'),
      value: 'no-padding',
    }]);

    const widthOptions = applyFilters('benenson.block.section.widthOptions', [{
      label: __('Normal', 'benenson'),
      value: '',
    }, {
      label: __('Narrow', 'benenson'),
      value: 'narrow',
    }, {
      label: __('Wide', 'benenson'),
      value: 'wide',
    }]);

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <SelectControl
            label={ __('Background Colour', 'benenson') }
            options={ backgroundOptions }
            value={ attributes.background }
            onChange={ this.createUpdateAttribute('background') }
          />
          <SelectControl
            label={ __('Padding', 'benenson') }
            options={ paddingOptions }
            value={ attributes.padding }
            onChange={ this.createUpdateAttribute('padding') }
          />
          <SelectControl
            label={ __('Width', 'benenson') }
            options={ widthOptions }
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
        [`${attributes.className}`]: !!attributes.className,
        'section--tinted': attributes.background === 'grey',
        [`section--${attributes.padding}`]: !!attributes.padding,
      }) } style={ attributes.mediaUrl ? styles : null }>
        <div className="container">
          { typeof this.props.insertBlocksAfter !== 'undefined' &&
            <InnerBlocks />
          }
        </div>
      </section>
    </Fragment>);
  }
}

export default DisplayComponent;
