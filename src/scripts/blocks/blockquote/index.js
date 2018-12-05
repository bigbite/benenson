import classnames from 'classnames';
import assign from 'lodash-es/assign';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { createBlock, getPhrasingContentSchema, registerBlockType } = wp.blocks;
const { InspectorControls, RichText } = wp.editor;
const {
  join,
  split,
  create,
  toHTMLString,
} = wp.richText;
const {
  PanelBody,
  SelectControl,
  ToggleControl,
} = wp.components;

registerBlockType('benenson/quote', {
  title: __('Blockquote', 'benenson'),
  description: __('Add a blockquote block', 'benenson'),
  icon: (<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" d="M0 0h24v24H0V0z" />
    <path d="M19 18h-6l2-4h-2V6h8v7l-2 5zm-2-2l2-3V8h-4v4h4l-2 4zm-8 2H3l2-4H3V6h8v7l-2 5zm-2-2l2-3V8H5v4h4l-2 4z" />
  </svg>),
  category: 'benenson',
  supports: {
    className: false,
  },
  attributes: {
    align: {
      type: 'string',
    },
    size: {
      type: 'string',
    },
    colour: {
      type: 'string',
    },
    capitalise: {
      type: 'boolean',
    },
    lined: {
      type: 'boolean',
    },
    content: {
      type: 'string',
    },
    citation: {
      type: 'string',
    },
  },

  transforms: {
    from: [{
      type: 'block',
      isMultiBlock: true,
      blocks: ['core/paragraph'],
      transform: attributes => createBlock('benenson/quote', {
        content: toHTMLString(join(attributes.map(({ content }) => create({ html: content })), '\u2028'), 'p'),
      }),
    }, {
      type: 'block',
      blocks: ['core/heading'],
      transform: ({ content }) => createBlock('benenson/quote', {
        content: `<p>${content}</p>`,
      }),
    }, {
      type: 'block',
      blocks: ['core/pullquote'],
      transform: ({ value, citation }) => createBlock('benenson/quote', {
        content: value,
        citation,
      }),
    }, {
      type: 'pattern',
      regExp: /^>\s/,
      transform: ({ content }) => createBlock('benenson/quote', {
        content: `<p>${content}</p>`,
      }),
    }, {
      type: 'raw',
      selector: 'blockquote',
      schema: {
        blockquote: {
          children: {
            p: {
              children: getPhrasingContentSchema(),
            },
          },
        },
      },
    }],
    to: [{
      type: 'block',
      blocks: ['core/paragraph'],
      transform: ({ content, citation }) => {
        const paragraphs = [];

        if (content) {
          paragraphs.push(...split(create({ html: content, multilineTag: 'p' }), '\u2028')
            .map(piece => createBlock('core/paragraph', {
              content: toHTMLString(piece),
            })));
        }

        if (citation) {
          paragraphs.push(createBlock('core/paragraph', {
            content: citation,
          }));
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
      transform: ({ content, citation, ...attrs }) => {
        if (content === '<p></p>') {
          return createBlock('core/heading', {
            content: citation,
          });
        }

        const pieces = split(create({ html: content, multilineTag: 'p' }), '\u2028');
        const quotePieces = pieces.slice(1);

        return [
          createBlock('core/heading', {
            content: toHTMLString(pieces[0]),
          }),
          createBlock('benenson/quote', {
            ...attrs,
            citation,
            content: toHTMLString(quotePieces.length ? join(pieces.slice(1), '\u2028') : create(), 'p'),
          }),
        ];
      },
    }, {
      type: 'block',
      blocks: ['core/pullquote'],
      transform: ({ content, citation }) => createBlock('core/pullquote', {
        value: content,
        citation,
      }),
    }],
  },

  edit: class extends Component {
    static isRightToLeft = document.documentElement.getAttribute('dir') === 'rtl';
    static hasI18n = Object.prototype.hasOwnProperty.call(window, 'benensonCoreI18n');

    getDirections() {
      const directionalOptions = [
        /* translators: text alignment. for RTL languages, localise as 'Right' */
        { value: 'start', label: __('Left', 'benenson') },
        { value: '', label: __('Default', 'benenson') },
      ];

      if (!this.isRightToLeft) {
        /* translators: text alignment. for RTL languages, localise as 'Left' */
        directionalOptions.push({ value: 'end', label: __('Right', 'benenson') });
      }

      return directionalOptions;
    }

    getQuoteStyles() {
      if (!this.hasI18n) {
        return '';
      }

      const {
        openDoubleQuote,
        closeDoubleQuote,
        openSingleQuote,
        closeSingleQuote,
      } = window.benensonCoreI18n;

      return `.blockquote {
        quotes: "${openDoubleQuote}" "${closeDoubleQuote}" "${openSingleQuote}" "${closeSingleQuote}";
      }`;
    }

    render() {
      const { attributes, setAttributes } = this.props;
      const {
        align = '',
        size = '',
        colour = '',
        capitalise = false,
        lined = true,
        content = '',
        citation = '',
      } = attributes;

      const classes = classnames('blockquote', {
        [`align-${align}`]: !!align,
        [`is-${size}`]: !!size,
        [`is-${colour}`]: !!colour,
        'is-capitalised': capitalise,
        'is-lined': lined,
      });

      return (<Fragment>
        <InspectorControls>
          <PanelBody>
            <SelectControl
              label={ __('Alignment', 'benenson') }
              value={ align }
              onChange={ newAlign => setAttributes({ align: newAlign }) }
              options={ this.getDirections() }
            />
            <SelectControl
              label={ __('Size', 'benenson') }
              value={ size }
              onChange={ newSize => setAttributes({ size: newSize }) }
              options={ [
                { value: 'small', label: __('Small', 'benenson') },
                { value: 'medium', label: __('Medium', 'benenson') },
                { value: '', label: __('Large', 'benenson') },
              ] }
            />
            <SelectControl
              label={ __('Text Colour', 'benenson') }
              value={ colour }
              onChange={ newColour => setAttributes({ colour: newColour }) }
              options={ [
                { value: '', label: __('Black', 'benenson') },
                { value: 'grey', label: __('Grey', 'benenson') },
                { value: 'white', label: __('White', 'benenson') },
              ] }
            />
          { !this.isRightToLeft && <ToggleControl
            label={ __('Capitalise', 'benenson') }
            help={ __('Capitalise the content.', 'benenson') }
            checked={ capitalise }
            onChange={ newCaps => setAttributes({ capitalise: newCaps }) }
          /> }
          <ToggleControl
            label={ __('Line', 'benenson') }
            help={ __('Toggle display of line embellishment.', 'benenson') }
            checked={ lined }
            onChange={ newLine => setAttributes({ lined: newLine }) }
          />
          </PanelBody>
        </InspectorControls>
        <style>{ this.getQuoteStyles() }</style>
        <div className={ classes }>
          <div><RichText
            tagName="p"
            placeholder={ __('(Insert Quote Text)', 'benenson') }
            value={ content }
            formattingControls={ [] }
            keepPlaceholderOnFocus={ true }
            onChange={ newContent => setAttributes({ content: newContent }) }
          /></div>
          <div><RichText
            tagName="cite"
            placeholder={ __('(Insert Citation)', 'benenson') }
            value={ citation }
            keepPlaceholderOnFocus={ true }
            onChange={ newCitation => setAttributes({ citation: newCitation }) }
          /></div>
        </div>
      </Fragment>);
    }
  },

  save({ attributes }) {
    const {
      align = '',
      size = '',
      colour = '',
      capitalise = false,
      lined = true,
      content = '',
      citation = '',
    } = attributes;

    const classes = classnames('blockquote', {
      [`align-${align}`]: !!align,
      [`is-${size}`]: !!size,
      [`is-${colour}`]: !!colour,
      'is-capitalised': capitalise,
      'is-lined': lined,
    });

    const quoteStyle = {};
    if (Object.prototype.hasOwnProperty.call(window, 'benensonCoreI18n')) {
      const {
        openDoubleQuote,
        closeDoubleQuote,
        openSingleQuote,
        closeSingleQuote,
      } = window.benensonCoreI18n;

      quoteStyle.quotes = `"${openDoubleQuote}" "${closeDoubleQuote}" "${openSingleQuote}" "${closeSingleQuote}";`;
    }

    return (<blockquote className={ classes } style={ quoteStyle }>
      <RichText.Content tagName="p" value={ content } />
      <RichText.Content tagName="cite" value={ citation } />
    </blockquote>);
  },
});
