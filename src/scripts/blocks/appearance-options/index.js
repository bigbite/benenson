import PostSelect from './PostSelect';

const { registerPlugin } = wp.plugins;
const {
  SelectControl, PanelBody, ToggleControl, TextControl,
} = wp.components;
const { compose } = wp.compose;
const { Fragment } = wp.element;
const { __ } = wp.i18n;
const { withSelect, withDispatch } = wp.data;
const { PluginSidebar, PluginPostStatusInfo } = wp.editPost;

/**
 * Takes the previous meta and the new meta,
 * it filters out the unchanged values to prevent an rest api error
 * @param oldData
 * @param newData
 * @returns {{}}
 */
const reviseData = (oldData, newData) => Object
  .keys(newData)
  .reduce((prev, key) => {
    if (oldData[key] === newData[key]) {
      return prev;
    }

    return {
      ...prev,
      [key]: newData[key],
    };
  }, {});

const Sidebar = ({ createMetaUpdate, ...props }) => (
  <Fragment>
    <PluginSidebar name="benenson-appearance" title={ __('Appearance', 'benenson') }>
      { props.type === 'page' && (
        <PanelBody title={ __('Header', 'benenson') }>
          <SelectControl
            label={ __('Navigation Style:', 'benenson') }
            options={ [{
              label: __('Global', 'benenson'),
              value: 'global',
            }, {
              label: __('White', 'benenson'),
              value: 'transparent-light',
            }, {
              label: __('Black', 'benenson'),
              value: 'transparent-dark',
            }] }
            value={ props.meta._nav_style }
            onChange={ value => createMetaUpdate('_nav_style', value, props.meta, props.oldMeta) }
          />
        </PanelBody>
      ) }
      { props.type === 'post' && (
        <PanelBody title={ __('Options', 'benenson') }>
          <SelectControl
            label={ __('Post Thumbnail Style', 'benenson') }
            help={ __('Affects its display on the news index only.', 'benenson') }
            options={ [{
              label: __('Half size', 'benenson'),
              value: 'small',
            }, {
              label: __('Full Background', 'benenson'),
              value: 'full',
            }] }
            value={ props.meta._thumbnail_style }
            onChange={ value => createMetaUpdate('_thumbnail_style', value, props.meta, props.oldMeta) }
          />
          <hr />
          <ToggleControl
            label={ __('Hide featured image', 'benenson') }
            help={ __('Disables display of featured image on post single.', 'benenson') }
            checked={ props.meta._hide_featured_image }
            onChange={ () => createMetaUpdate('_hide_featured_image', !props.meta._hide_featured_image, props.meta, props.oldMeta) }
          />
          <hr />
          { !props.meta._hide_featured_image && <Fragment><ToggleControl
            label={ __('Force full-width featured image', 'benenson') }
            help={ __('Ensures a small featured image fills the width of the content area.', 'benenson') }
            checked={ props.meta._stretch_thumbnail }
            onChange={ () => createMetaUpdate('_stretch_thumbnail', !props.meta._stretch_thumbnail, props.meta, props.oldMeta) }
          /><hr /></Fragment> }
          <ToggleControl
            label={ __('Reduce Content Width', 'benenson') }
            help={ __('Adds a small amount of padding to the content.', 'benenson') }
            checked={ props.meta._reduce_content_width }
            onChange={ () => createMetaUpdate('_reduce_content_width', !props.meta._reduce_content_width, props.meta, props.oldMeta) }
          />
        </PanelBody>
      ) }
      { ((props.type === 'post' || props.type === 'page') && props.template !== 'without-sidebar') && (
        <PanelBody title={ __('Sidebar', 'benenson') }>
          <ToggleControl
            label={ __('Disable Sidebar', 'benenson') }
            help={ __('Hides the sidebar for this post', 'benenson') }
            checked={ props.meta._disable_sidebar }
            onChange={ () => createMetaUpdate('_disable_sidebar', !props.meta._disable_sidebar, props.meta, props.oldMeta) }
          />
          <PostSelect
            onChange={ sidebarId => createMetaUpdate('_sidebar_id', sidebarId, props.meta, props.oldMeta) }
            value={ props.meta._sidebar_id }
          />
        </PanelBody>
      ) }
      { props.template === 'without-sidebar' && (
        <PanelBody title={ __('Share Buttons', 'benenson') }>
          <ToggleControl
            label={ __('Disable Share Buttons for this page', 'benenson') }
            checked={ props.meta._disable_share_icons }
            onChange={ () => createMetaUpdate('_disable_share_icons', !props.meta._disable_share_icons, props.meta, props.oldMeta) }
          />
        </PanelBody>
      ) }

      { props.type === 'sidebar' && <PanelBody><p>No options available for this post type.</p></PanelBody> }
    </PluginSidebar>
  </Fragment>
);

const plugin = compose([
  withSelect((select) => {
    // Grab the post meta that has been edited.
    const postMeta = select('core/editor').getEditedPostAttribute('meta') || {};
    // Grab the post meta that was present on load.
    const oldPostMeta = select('core/editor').getCurrentPostAttribute('meta') || {};

    const template =
      (select('core/editor').getEditedPostAttribute('template') || '')
        .replace('templates/', '')
        .replace('.php', '');

    return {
      template,
      meta: { ...oldPostMeta, ...postMeta },
      oldMeta: oldPostMeta,
      type: select('core/editor').getEditedPostAttribute('type'),
    };
  }),
  withDispatch(dispatch => ({
    createMetaUpdate(key, value, newMeta = {}, oldMeta = {}) {
      const meta = {
        ...reviseData(oldMeta, newMeta),
        [key]: value,
      };
      dispatch('core/editor')
        .editPost({
          meta,
        });
    },
  })),
])(Sidebar);

registerPlugin('benenson-appearance', {
  icon: 'admin-appearance',
  render: plugin,
});
