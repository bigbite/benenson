
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
  iconSize: {
    type: 'string',
    default: 'small',
  },
  underlined: {
    type: 'boolean',
    default: false,
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
};

registerBlockType('benenson/logo', {
  title: __('Logo', 'benenson'),
  description: __('Add a logos block', 'benenson'),
  icon: 'plus',
  category: 'layout',
  parent: ['benenson/logos-block'],
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

  edit: BlockEdit,

  save({ attributes }) {
    const {
      style = 'icon',
      underlined = false,
    } = attributes;

    const txtClasses = classnames('linksWithIcons-bigtext', {
      'has-underline': underlined,
    });

    const getImageTag = () => {
      const {
        iconSize = 'small',
        uncredited = false,
        imageID,
        imageAlt,
        imageData,
      } = attributes;

      const sizeMap = {
        small: 'logo-block',
        medium: 'logo-block',
        large: 'logo-block',
        smallRetina: 'logo-block',
        mediumRetina: 'logo-block',
        largeRetina: 'logo-block',
      };

      const getUrl = (size, retina = false) => {
        const key = retina ? sizeMap[`${size}Retina`] : sizeMap[size];
        const obj = (imageData[key] || imageData.full || { url: '' });
        return encodeURI(obj.url);
      };

      const imgClasses = classnames('logoList-item-imageWrapper', {
        [`is-${iconSize}`]: iconSize !== 'small',
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
        <img className="logoList-item-image" src={ getUrl(iconSize) } srcset={ srcset } alt={ imageAlt } />
      </div>);
    };

    return (<Fragment>
      <div className="logoList-item">
        { style === 'icon' && getImageTag() }
      </div>
    </Fragment>);
  },
});
