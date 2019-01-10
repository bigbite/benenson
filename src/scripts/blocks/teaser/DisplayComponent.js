import classnames from 'classnames';
import PostMediaSelector from '../PostMediaSelector';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl, TextControl } = wp.components;
const { InspectorControls, RichText, URLInputButton } = wp.editor;

class DisplayComponent extends Component {
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  onImageChange = (image) => {
    this.props.setAttributes({
      imageId: image.id,
      imageUrl: image.source_url,
    });
  };

  render() {
    const { attributes } = this.props;

    return (<Fragment>
      <InspectorControls>
      </InspectorControls>
      <div className="teaser">
        <div className="teaser-media teaser-col">
          <p className="teaser-mediaTitle">
            <RichText
              tagName="span"
              onChange={ this.createUpdateAttribute('imageTitle') }
              value={ attributes.imageTitle }
              placeholder={ __('(Image title)', 'benenson') }
              keepPlaceholderOnFocus={ true }
              formattingControls={ [] }
              format="string"
            />
          </p>
          <PostMediaSelector
            mediaId={ attributes.imageId }
            onUpdate={ this.onImageChange }
          />
        </div>
        <div className="teaser-col">
          <div className="teaser-content">
            <h2 className="teaser-title">
              <RichText
                tagName="span"
                onChange={ this.createUpdateAttribute('title') }
                value={ attributes.title }
                placeholder={ __('(Title)', 'benenson') }
                keepPlaceholderOnFocus={ true }
                formattingControls={ [] }
                format="string"
              />
            </h2>
            <div class="teaser-contentBody">
              <RichText
                tagName="span"
                onChange={ this.createUpdateAttribute('content') }
                value={ attributes.content }
                placeholder={ __('(Content)', 'benenson') }
                keepPlaceholderOnFocus={ true }
                format="string"
              />
            </div>
          </div>
          <a href="">
            <RichText
              tagName="span"
              onChange={ this.createUpdateAttribute('linkText') }
              value={ attributes.linkText }
              placeholder={ __('(Link Text)', 'benenson') }
              keepPlaceholderOnFocus={ true }
              formattingControls={ [] }
              format="string"
            />
            <URLInputButton
              url={ attributes.linkUrl }
              onChange={ this.createUpdateAttribute('linkUrl') }
            />
          </a>
        </div>
      </div>
    </Fragment>);
  }
}

export default DisplayComponent;
