const { __ } = wp.i18n;
const { createBlock, registerBlockType } = wp.blocks;
const { Component } = wp.element;
const {
  MediaPlaceholder, MediaUpload, BlockControls, RichText,
} = wp.editor;
const {
  Button, Toolbar, IconButton,
} = wp.components;

registerBlockType('benenson/block-download', {
  title: __('Resource Download', 'benenson'),
  description: __('Add a button to download a resource', 'benenson'),
  icon: 'download',
  category: 'benenson',
  supports: {
    className: false,
    multiple: false,
  },

  attributes: {
    fileId: {
      type: 'integer',
      source: 'meta',
      meta: 'download_id',
    },
    downloadButtonText: {
      type: 'string',
      source: 'meta',
      meta: 'download_text',
    },
  },

  edit: class extends Component {
    render() {
      const { attributes, setAttributes } = this.props;

      if (!attributes.fileId) {
        return (
          <div>
            <MediaPlaceholder
              icon="media-default"
              labels={{
                title: __('File', 'benenson'),
                name: __('A File', 'benenson'),
              }}
              onSelect={({ id: fileId = 0 }) => setAttributes({ fileId })}
              accept="*"
              type="*"
            />
          </div>
        );
      }

      return (
        [
          <div className="btn btn--dark btn--download" style={{
            marginRight: '20px',
          }}>
            <RichText
              format="string"
              formattingControls={[]}
              keepPlaceholderOnFocus={ true }
              value={attributes.downloadButtonText}
              onChange={downloadButtonText => setAttributes({ downloadButtonText })}
              tagName="span"
              placeholder={__('[Download Resource]', 'benenson')}
            />
          </div>,
          <Button
            isDestructive
            isLink
            onClick={() => setAttributes({ fileId: 0 })}
          >
            {__('Remove Resource', 'benenson')}
          </Button>,
          <BlockControls>
            <Toolbar>
              <MediaUpload
                onSelect={({ id: fileId = 0 }) => setAttributes({ fileId })}
                value={attributes.fileId}
                render={({ open }) => (
                  <IconButton
                    className="components-toolbar__control"
                    label={ __('Edit File', 'benenson') }
                    onClick={ open }
                    icon="edit"
                  />
                )}
              />
            </Toolbar>
          </BlockControls>,
        ]
      );
    }
  },

  save: () => null,
});
