import classnames from 'classnames';
import assign from 'lodash-es/assign';
import BlockEdit from './BlockEdit';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { registerBlockType } = wp.blocks;
const {
  IconButton,
  PanelBody,
  SelectControl,
  ToggleControl,
} = wp.components;
const {
  InspectorControls,
  MediaUpload,
  PlainText,
  URLInputButton,
} = wp.editor;


const blockAttributes = {
  style: {
    type: 'string',
  },
  centred: {
    type: 'boolean',
  },
  label: {
    type: 'string',
  },
  content: {
    type: 'string',
  },
  imageID: {
    type: 'integer',
  },
  imageURL: {
    type: 'string',
  },
  imageAlt: {
    type: 'string',
  },
  link: {
    type: 'string',
  },
  buttonBackground: {
    type: 'string',
  },
};

registerBlockType('benenson/action-block', {
  title: __('Action', 'benenson'),
  description: __('Add an Action block', 'benenson'),
  icon: 'megaphone',
  category: 'benenson',
  supports: {
    className: false,
  },
  attributes: assign({}, blockAttributes, {
    linkText: {
      type: 'strng',
    },
  }),

  edit: BlockEdit,

  save({ attributes }) {
    const {
      style = 'standard',
      centred = false,
      label,
      content,
      imageURL,
      imageAlt,
      link,
      linkText,
      buttonBackground,
    } = attributes;

    const blockClasses = classnames('actionBlock', {
      'actionBlock--wide': style === 'wide',
      'is-centred': centred,
    });

    const buttonClasses = classnames([
      'btn',
      'btn--fill',
    ]);

    return (<figure className={ blockClasses }>
      <div className="actionBlock-figure">
        <img className="actionBlock-image" src={ imageURL } alt={ imageAlt } />
        <span className="actionBlock-label">{ label }</span>
      </div>
      <figcaption className="actionBlock-content">
        <p>{ content }</p>
        <a className={ buttonClasses } href={ link }>{ linkText }</a>
      </figcaption>
    </figure>);
  },
});
