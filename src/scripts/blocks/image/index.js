import classnames from 'classnames';
import BlockEdit from './BlockEdit';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;
const { Fragment } = wp.element;

const uniqueId = () => {
  const valid = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const count = valid.length;
  let length = 5;
  let id = '';

  while (length-- > 0) { // eslint-disable-line
    id += valid.charAt(Math.floor(Math.random() * count));
  }

  return id;
};

const blockAttributes = {
  type: {
    type: 'string',
  },
  style: {
    type: 'string',
  },
  align: {
    type: 'string',
  },
  hasOverlay: {
    type: 'boolean',
  },
  parallax: {
    type: 'boolean',
  },
  identifier: {
    type: 'string',
    source: 'attribute',
    selector: '.imageBlock',
    attribute: 'class',
  },

  imageID: {
    type: 'integer',
  },
  imageURL: {
    type: 'string',
  },

  videoID: {
    type: 'integer',
  },
  videoURL: {
    type: 'string',
  },

  title: {
    type: 'string',
  },
  content: {
    type: 'string',
  },
  buttons: {
    type: 'array',
    default: [],
  },
  caption: {
    type: 'string',
  },
};

registerBlockType('benenson/image-block', {
  title: 'Image Block',
  description: __('Add a flexible image block with optional overlay', 'benenson'),
  icon: 'format-image',
  category: 'benenson',
  supports: {
    className: false,
  },
  attributes: blockAttributes,
  save({ attributes }) {
    const {
      type = '',
      style = 'loose',
      hasOverlay = false,
      parallax = false,
      align = 'default',

      imageURL = '',
      videoURL = '',

      title,
      content,
      copyright,
      caption,
      buttons = [],
    } = attributes;

    let identifier;
    if (attributes.identifier) {
      // pull existing id from outer div instead of generating it.
      identifier = attributes.identifier.replace(/imageBlock\s+imageBlock-([0-9a-zA-Z]*?)\s+(?:has-parallax)?/, '$1').trim();
    }

    if (!identifier) {
      identifier = uniqueId();
    }

    const classes = classnames('imageBlock', {
      [`imageBlock-${identifier}`]: parallax,
      'imageBlock--fixed': style === 'fixed',
      'has-video': type === 'video',
      'has-parallax': parallax,
    });

    const capClasses = classnames('imageBlock-caption', {
      [`align${align}`]: align !== 'default',
    });

    if (parallax) {
      const css = `.imageBlock-${identifier} .imageBlock-overlay{background-image: url('${encodeURI(imageURL)}')}`;

      return (<Fragment>
        <div className={ classes }>
          <style>{ css }</style>
          { hasOverlay ? <div className="imageBlock-overlay">
            <div className="imageBlock-title">{ title }</div>
            <div className="imageBlock-content"><RichText.Content tagName="p" value={ content } /></div>
            <div className="imageBlock-buttonWrapper">
            { buttons.map(button => <a className="btn btn--white" href={ button.url }>{ button.text }</a>) }
            </div>
          </div> : <div className="imageBlock-overlay"></div> }
        </div>
        { caption && <div className={ capClasses }>{ caption }</div> }
      </Fragment>);
    }

    const block = (<Fragment>
      <div className={ classes }>
        { !type && <img className="imageBlock-image" src={ encodeURI(imageURL) } /> }
        { type === 'video' && <video className="imageBlock-video" autoplay loop muted><source src={ encodeURI(videoURL) } /></video> }
        { hasOverlay && <div className="imageBlock-overlay">
          <div className="imageBlock-title">{ title }</div>
          <div className="imageBlock-content"><RichText.Content tagName="p" value={ content } /></div>
          <div className="imageBlock-buttonWrapper">
            { buttons.map(button => <a className="btn btn--white" href={ button.url }>{ button.text }</a>) }
          </div>
        </div> }
      </div>
      { caption && <div className={ capClasses }>{ caption }</div> }
    </Fragment>);

    if (align === 'default') {
      return block;
    }

    const wrapperClasses = classnames('imageBlock-wrapper', 'u-cf', {
      [`align${align}`]: align !== 'default',
    });

    return (<div className={ wrapperClasses }>{ block }</div>);
  },
  edit: BlockEdit,
});
