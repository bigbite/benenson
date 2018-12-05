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

wp.blocks.registerBlockStyle('core/table', {
  name: 'responsive',
  label: 'Responsive',
});
