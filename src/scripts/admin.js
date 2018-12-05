jQuery(document).ready(($) => {
  let mediaUploader;

  $('#upload_image_button').click((e) => {
    e.preventDefault();

    if (mediaUploader) {
      mediaUploader.open();
      return;
    }

    mediaUploader = wp.media({
      title: 'Choose Image',
      button: {
        text: 'Choose Image',
      },
      multiple: false,
    });

    wp.media.frames.file_frame = mediaUploader;

    mediaUploader.on('select', () => {
      const attachment = mediaUploader.state().get('selection').first().toJSON();
      $('#_logo_image').attr('src', attachment.sizes.thumbnail.url);
      $('#_logo_input').val(attachment.id);
    });

    mediaUploader.open();
  });
});
