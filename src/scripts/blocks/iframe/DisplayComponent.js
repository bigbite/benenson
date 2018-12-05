const { __ } = wp.i18n;
const { Component, Fragment, createRef } = wp.element;
const {
  PanelBody, TextControl, Placeholder, Button,
} = wp.components;
const { InspectorControls, RichText } = wp.editor;

class DisplayComponent extends Component {
  constructor(...args) {
    super(...args);
    this.inputRef = createRef();
    this.updateEmbedUrl = this.createUpdateAttribute('embedUrl');
  }
  /**
   * Higher order component that takes the attribute key,
   * this then returns a function which takes a value,
   * when called it updates the attribute with the key.
   * @param key
   * @returns {function(*): *}
   */
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  onSubmit = (event) => {
    event.preventDefault();
    this.updateEmbedUrl(this.inputRef.current.value);
  };

  doReset = (event) => {
    event.preventDefault();
    this.updateEmbedUrl('');
  };

  placeholder = () => {
    const label = __('Iframe URL', 'benenson');

    return (
      <Placeholder label={ label } className="wp-block-embed">
        <form onSubmit={ this.onSubmit }>
          <input
            ref={this.inputRef}
            type="url"
            className="components-placeholder__input"
            aria-label={ label }
            placeholder={ __('Enter URL to embed here…', 'benenson') }
          />
          <Button
            isLarge
            type="submit">
            { __('Embed', 'benenson') }
          </Button>
        </form>
      </Placeholder>
    );
  };

  embedContainer = () => {
    const { attributes, isSelected } = this.props;
    const width = parseInt(attributes.width, 10);
    const height = parseInt(attributes.height, 10);
    const minHeight = parseInt(attributes.minHeight, 10);

    return (
      <figure className="wp-block-embed">
        <div className="fluid-iframe" style={{
          paddingTop: `${(height / width) * 100}%`,
          minHeight,
        }}>
          <iframe src={attributes.embedUrl} style={ { height: `${minHeight}px` } } />
        </div>
        { (attributes.caption || isSelected) && (
          <RichText
            tagName="figcaption"
            placeholder={ __('Write caption…', 'benenson') }
            keepPlaceholderOnFocus={ true }
            value={ attributes.caption }
            onChange={ this.createUpdateAttribute('caption') }
            inlineToolbar
            format="string"
          />
        ) }
      </figure>
    );
  };
  render() {
    const { attributes } = this.props;

    const controls = (
        <InspectorControls>
          <PanelBody title={ __('Options', 'benenson') }>
            <TextControl
              label={ __('Width', 'benenson') }
              value={ attributes.width }
              type="number"
              step={ 10 }
              help={ (!attributes.width && attributes.height) ? __('Required when specifying a height', 'benenson') : '' }
              onChange={ this.createUpdateAttribute('width') }
            />
            <TextControl
              label={ __('Height', 'benenson') }
              value={ attributes.height }
              type="number"
              step={ 10 }
              help={ (!attributes.height && attributes.width) ? __('Required when specifying a width', 'benenson') : '' }
              onChange={ this.createUpdateAttribute('height') }
            />
            <hr/>
            <TextControl
              label={ __('Minimum Height', 'benenson') }
              value={ attributes.minHeight }
              type="number"
              step={ 10 }
              min={ 0 }
              max={ 1000 }
              help={ (!attributes.height && !attributes.width) ? __('Required if not using width/height, optional otherwise', 'benenson') : '' }
              onChange={ this.createUpdateAttribute('minHeight') }
            />
            { attributes.embedUrl && <Button onClick={this.doReset} isPrimary>{__('Reset Embed Url', 'benenson')}</Button> }
          </PanelBody>
        </InspectorControls>
    );

    return (
      <Fragment>
        { controls }
        <div>
          { attributes.embedUrl ? this.embedContainer() : this.placeholder() }
        </div>
      </Fragment>
    );
  }
}

export default DisplayComponent;
