/**
 * Third-Party
 */
import classnames from 'classnames';
import assign from 'lodash-es/assign';

/**
 * Module-specific
 */
import BlockEdit from './InnerBlockEdit';

/**
 * WordPress
 */
const { __, sprintf } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText } = wp.editor;
const { Fragment } = wp.element;

const blockAttributes = {
  style: {
    type: 'string',
  },
  hasButton: {
    type: 'boolean',
  },
  bigTextCss: {
    type: 'object',
    default: {
      fontSize: '20px',
    },
  },
  iconSize: {
    type: 'string',
    default: 'medium',
  },
  underlined: {
    type: 'boolean',
    default: false,
  },

  title: {
    type: 'string',
  },
  body: {
    type: 'string',
  },
  buttonText: {
    type: 'string',
  },
  buttonLink: {
    type: 'string',
  },

  imageID: {
    type: 'number',
  },
  imageAlt: {
    type: 'string',
  },
  imageURL: {
    type: 'string',
  },
  bigtext: {
    type: 'string',
  },
};

registerBlockType('benenson/links-with-icons', {
  title: __('Links with Icons', 'benenson'),
  description: __('Add a links-with-icons block', 'benenson'),
  icon: 'plus',
  category: 'layout',
  parent: ['benenson/repeatable-block'],
  supports: {
    className: false,
  },
  attributes: assign({}, blockAttributes, {
    uncredited: {
      type: 'boolean',
      default: false,
    },
    imageData: {
      type: 'object',
      default: {},
    },
  }),

  deprecated: [{
    supports: {
      className: false,
    },
    attributes: blockAttributes,
    save({ attributes }) {
      const {
        style = 'icon',
        iconSize = 'medium',
        underlined = false,

        title,
        body,
        buttonText,
        buttonLink,

        bigTextCss,
        bigtext,

        imageID,
        imageAlt,
        imageURL,
      } = attributes;

      const { hasButton = (buttonText && buttonLink) } = attributes;

      const imgClasses = classnames('linksWithIcons-imageWrapper', {
        [`is-${iconSize}`]: iconSize !== 'medium',
      });

      const txtClasses = classnames('linksWithIcons-bigtext', {
        'has-underline': underlined,
      });

      return (<Fragment>
        <div className="linksWithIcons">
          <RichText.Content
            className="linksWithIcons-title"
            tagName="div"
            value={ title }
          />
          { style === 'icon' && <div className={ imgClasses }>
            <RichText.Content
              className="linksWithIcons-image"
              tagName="img"
              src={ imageURL }
              alt={ imageAlt }
            />
          </div> }
          { style === 'text' && <RichText.Content
            className={ txtClasses }
            tagName="div"
            value={ bigtext }
            style={ bigTextCss }
          /> }
          <RichText.Content
            className="linksWithIcons-body"
            tagName="div"
            value={ body }
          />
          { hasButton && <a className="btn btn--outline linksWithIcons-button" href={ buttonLink }>{ buttonText }</a> }
        </div>
        <div class="linksWithIcons-spacer"></div>
      </Fragment>);
    },
  }, {
    attributes: assign({}, blockAttributes, {
      uncredited: {
        type: 'boolean',
        default: false,
      },
    }),
    save({ attributes }) {
      const {
        style = 'icon',
        iconSize = 'medium',
        underlined = false,
        uncredited = false,

        title,
        body,
        buttonText,
        buttonLink,

        bigTextCss,
        bigtext,

        imageID,
        imageAlt,
        imageURL,
      } = attributes;

      const { hasButton = (buttonText && buttonLink) } = attributes;

      const imgClasses = classnames('linksWithIcons-imageWrapper', {
        [`is-${iconSize}`]: iconSize !== 'medium',
        'is-uncredited': uncredited,
      });

      const txtClasses = classnames('linksWithIcons-bigtext', {
        'has-underline': underlined,
      });

      return (<Fragment>
        <div className="linksWithIcons">
          <RichText.Content
            className="linksWithIcons-title"
            tagName="div"
            value={ title }
          />
          { style === 'icon' && <div className={ imgClasses }>
            <img className="linksWithIcons-image" src={ imageURL } alt={ imageAlt } />
          </div> }
          { style === 'text' && <RichText.Content
            className={ txtClasses }
            tagName="div"
            value={ bigtext }
            style={ bigTextCss }
          /> }
          <RichText.Content
            className="linksWithIcons-body"
            tagName="div"
            value={ body }
          />
          { hasButton && <a className="btn btn--white" href={ buttonLink }>{ buttonText }</a> }
        </div>
        <div class="linksWithIcons-spacer"></div>
      </Fragment>);
    },
    migrate(attributes) {
      return assign({}, attributes, {
        imageData: {
          full: {
            url: attributes.imageURL,
          },
          'lwi-block-sm': {
            url: attributes.imageURL,
          },
        },
      });
    },
  }],

  edit: BlockEdit,

  save({ attributes }) {
    const {
      style = 'icon',
      underlined = false,

      title,
      body,
      buttonText,
      buttonLink,

      bigTextCss,
      bigtext,
    } = attributes;

    const { hasButton = (buttonText && buttonLink) } = attributes;

    const txtClasses = classnames('linksWithIcons-bigtext', {
      'has-underline': underlined,
    });

    const getImageTag = () => {
      const {
        iconSize = 'medium',
        uncredited = false,

        imageID,
        imageAlt,
        imageData,
      } = attributes;

      const sizeMap = {
        small: 'lwi-block-sm',
        medium: 'lwi-block-md',
        large: 'lwi-block-lg',
        smallRetina: 'lwi-block-sm@2x',
        mediumRetina: 'lwi-block-md@2x',
        largeRetina: 'lwi-block-lg@2x',
      };

      const getUrl = (size, retina = false) => {
        const key = retina ? sizeMap[`${size}Retina`] : sizeMap[size];
        const obj = (imageData[key] || imageData.full || { url: '' });
        return encodeURI(obj.url);
      };

      const imgClasses = classnames('linksWithIcons-imageWrapper', {
        [`is-${iconSize}`]: iconSize !== 'medium',
        'is-uncredited': uncredited,
      });

      let srcset = false;
      if (imageData) {
        const x1 = getUrl(iconSize);
        const x2 = getUrl(iconSize, true);

        if (x1 && x2 && (x1 !== x2)) {
          srcset = sprintf('%s 1x, %s 2x', x1, x2);
        }
      }

      return (<div className={ imgClasses }>
        <img className="linksWithIcons-image" src={ getUrl(iconSize) } srcset={ srcset } alt={ imageAlt } />
      </div>);
    };

    return (<Fragment>
      <div className="linksWithIcons">
        <RichText.Content
          className="linksWithIcons-title"
          tagName="div"
          value={ title }
        />
        { style === 'icon' && getImageTag() }
        { style === 'text' && <RichText.Content
          className={ txtClasses }
          tagName="div"
          value={ bigtext }
          style={ bigTextCss }
        /> }
        <RichText.Content
          className="linksWithIcons-body"
          tagName="div"
          value={ body }
        />
        { hasButton && <RichText.Content
          className="btn btn--white"
          tagName="a"
          href={ buttonLink }
          value={ buttonText }
        /> }
      </div>
      <div class="linksWithIcons-spacer"></div>
    </Fragment>);
  },
});
