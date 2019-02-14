/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */
import './blocks/appearance-options';
import './blocks/blockquote';
import './blocks/section';
import './blocks/columns';
import './blocks/header';
import './blocks/call-to-action';
import './blocks/post-list';
import './blocks/links-with-icons';
import './blocks/image';
import './blocks/tweet';
import './blocks/action';
import './blocks/menu';
import './blocks/iframe';
import './blocks/slider';
import './blocks/download';
import './blocks/key-facts';
import './blocks/category-list';
import './blocks/logo-list';
import './blocks/link';
import './blocks/media-aside';
import assign from 'lodash-es/assign';

const {
  CheckboxControl,
  PanelBody,
  TextControl,
  TextareaControl,
} = wp.components;

const {
  createHigherOrderComponent,
} = wp.compose;

const {
  InspectorControls,
} = wp.editor;

const {
  isEmpty,
} = lodash;

const {
  Fragment,
  RawHTML,
  renderToString,
} = wp.element;

const { hooks } = wp;

wp.blocks.registerBlockStyle('core/table', {
  name: 'responsive',
  label: 'Responsive',
});


// function addListBlockClassName(settings, name) {
//   if (name !== 'core/list') {
//     return settings;
//   }

//   return assign({}, settings, {
//     supports: assign({}, settings.supports, {
//       className: true,
//     }),
//   });
// }


const titleAttributes = {
  titleText: {
    type: 'string',
    default: '',
  },
};

const registerAttributes = (settings, name) => {

  if ('core/list' !== name) {
    return settings;
  }

  settings.attributes = Object.assign(settings.attributes, titleAttributes);
  return settings;
};

hooks.addFilter('blocks.registerBlockType', 'times', registerAttributes);


const addFields = createHigherOrderComponent((BlockEdit) => {
  return (props) => {

    if ('core/list' !== props.name) {
      console.log('return');
      console.log('returning', props.name);
      return (
        <BlockEdit {...props} />
      );
    }

    const {
      attributes,
      setAttributes,
    } = props;

    const {
      titleText,
    } = attributes;

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title={ 'Title Text' }>
            <TextareaControl
              defaultValue={ titleText }
              onChange={( value ) => setAttributes({ titleText: value })}
              label={ 'Title Text' }
              placeholder={ '' }
              />
          </PanelBody>
        </InspectorControls>
        <BlockEdit { ...props } />
      </Fragment>
    );
  };
});


wp.hooks.addFilter(
  'editor.BlockEdit',
  'times',
  addFields,
);


const saveAttributes = (element, blockType, attributes) => {
  console.log('block type name', blockType.name);
  if ('core/list' !== blockType.name) {
    return element;
  }

  console.log('list detected');

  const {
    titleText,
  } = attributes;

  const titleProps = [];
  if (!isEmpty(titleText)) {
    titleProps.push({
      value: titleText,
    });
  }

  let elementAsString = renderToString(element);

  return (
    <RawHTML>{elementAsString}</RawHTML>
  );
};

hooks.addFilter('blocks.getSaveElement', 'times', saveAttributes);
