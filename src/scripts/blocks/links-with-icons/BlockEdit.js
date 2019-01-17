import assign from 'lodash-es/assign';

const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { getBlockSupport } = wp.blocks;
const { InspectorControls } = wp.editor;
const { createHigherOrderComponent } = wp.compose;
const { PanelBody, ToggleControl } = wp.components;

const { RepeatableBlockContainer } = benenson.components;

wp.hooks.addFilter('benenson.block.linksWithIcons.quantityOptions', 'benenson/blocks', options => assign({}, options, { max: 4 }));

wp.hooks.addFilter('editor.BlockEdit', 'benenson/blocks', createHigherOrderComponent(BlockEdit => (props) => {
  const supports = getBlockSupport(props.name, 'benenson', false);

  if (!supports || supports.repeatable === false) {
    return (<Fragment><BlockEdit { ...props } /></Fragment>);
  }

  return (<Fragment>
    <BlockEdit { ...props } />
    <InspectorControls>
      <PanelBody>
        <ToggleControl
          label={ __('Hide Lines', 'benenson') }
          checked={ props.attributes.hideLines }
          onChange={ newHideLines => props.setAttributes({ hideLines: newHideLines }) }
        />
      </PanelBody>
    </InspectorControls>
  </Fragment>);
}, 'withLinesControl'));

export default class BlockEdit extends RepeatableBlockContainer {
  BLOCKNAME = 'linksWithIcons';
  CLASSNAME = 'linksWithIcons-group';
  ALLOWED_BLOCKS = ['benenson/links-with-icons'];
}
