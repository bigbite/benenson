import classnames from 'classnames';
import assign from 'lodash-es/assign';
import isEmpty from 'lodash-es/isEmpty';
import DisplayComponent from './DisplayComponent';

const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;
const { RichText } = wp.editor;
const {
  join,
  split,
  create,
  toHTMLString,
} = wp.richText;

const createParagraphs = string => split(create({
  html: string,
  multilineTag: 'p',
}), '\u2028').map(piece => createBlock('core/paragraph', {
  content: toHTMLString(piece),
}));

const blockAttributes = {
  preheading: {
    type: 'array',
  },
  title: {
    type: 'string',
  },
  content: {
    type: 'array',
  },
  ctaLink: {
    type: 'string',
  },
  ctaText: {
    type: 'array',
  },
  background: {
    type: 'string',
  },
  style: {
    type: 'string',
  },
};

registerBlockType('benenson/block-call-to-action', {
  title: __('Call To Action', 'benenson'),
  icon: 'megaphone',
  category: 'benenson',
  keywords: [
    __('Call To Action', 'benenson'),
  ],
  supports: {
    className: false,
    multiple: true,
  },
  attributes: assign({}, blockAttributes, {
    preheading: {
      type: 'string',
    },
    content: {
      type: 'string',
    },
    ctaText: {
      type: 'string',
    },
  }),

  transforms: {
    from: [{
      type: 'block',
      isMultiBlock: true,
      blocks: ['core/paragraph'],
      transform: attributes => createBlock('benenson/block-call-to-action', {
        content: toHTMLString(join(attributes.map(({ content }) => create({ html: content })), '\u2028'), 'p'),
      }),
    }, {
      type: 'block',
      isMultiBlock: false,
      blocks: ['core/heading'],
      transform: ({ content }) => createBlock('benenson/block-call-to-action', {
        title: content,
      }),
    }],
    to: [{
      type: 'block',
      blocks: ['core/paragraph'],
      transform: ({ preheading, title, content }) => {
        const paragraphs = [];

        if (preheading) {
          paragraphs.push(...createParagraphs(preheading));
        }

        if (title) {
          paragraphs.push(...createParagraphs(title));
        }

        if (content) {
          paragraphs.push(...createParagraphs(content));
        }

        if (paragraphs.length === 0) {
          return createBlock('core/paragraph', {
            content: '',
          });
        }

        return paragraphs;
      },
    }, {
      type: 'block',
      blocks: ['core/heading'],
      transform: ({ preheading, title, content }) => {
        const blocks = [];

        if (preheading) {
          blocks.push(...createParagraphs(preheading));
        }

        if (title) {
          blocks.push(createBlock('core/heading', {
            content: title,
          }));
        }

        if (content) {
          blocks.push(...createParagraphs(content));
        }

        if (blocks.length === 0) {
          return createBlock('core/heading', {
            content: '',
          });
        }

        return blocks;
      },
    }],
  },

  edit: DisplayComponent,

  save: ({ attributes }) => {
    const {
      background = false,
      style = false,

      preheading,
      title,
      content,
      ctaLink,
      ctaText,
    } = attributes;

    const divClasses = classnames('callToAction', { [`callToAction--${background}`]: background });
    const linkClasses = classnames('btn', { [`btn--${style}`]: style });

    return (<div className={ divClasses } role="note" aria-label={ title }>
      { !isEmpty(preheading) && <RichText.Content tagName="h2" className="callToAction-preHeading" value={ preheading } /> }
      { !isEmpty(title) && <RichText.Content tagName="h1" className="callToAction-heading" value={ title } /> }
      { !isEmpty(content) && <RichText.Content tagName="p" className="callToAction-content" value={ content } /> }
      { (!isEmpty(ctaLink) && !isEmpty(ctaText)) && <a href={ ctaLink } className={ linkClasses }>
        <RichText.Content tagName="span" value={ ctaText } />
      </a> }
    </div>);
  },
});
