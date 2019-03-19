import { PostList } from './PostList';

const { __ } = wp.i18n;
const { BlockIcon } = wp.editor;

const PostSelector = (props) => {
  const isFiltered = props.state.filtering;
  const postList = isFiltered &&
  !props.state.filterLoading ?
    props.state.filterPosts :
    props.state.posts.filter(post => post.type === props.state.type);
  const pageKey = props.state.filter ? 'filter' : props.state.type;
  const canPaginate = (props.state.pages[pageKey] || 1) < props.state.pagesTotal[pageKey];

  const addIcon = props.getSelectedPosts().length >= 8 ? null : <BlockIcon icon="plus" />;
  const removeIcon = <BlockIcon icon="minus" />;

  return (<div className="wp-block-bigbite-postlist">
    <div className="post-selector">
      <div className="post-selectorHeader">
        <div className="searchbox">
          <label htmlFor="searchinput">
            <BlockIcon icon="search" />
            <input
              id="searchinput"
              type="search"
              placeholder={ __('Please enter your search query...', 'benenson') }
              value={ props.state.filter }
              onChange={ props.onInputFilterChange }
            />
          </label>
        </div>
        <div className="filter">
          { /* eslint-disable-line react/jsx-one-expression-per-line */ }
          <label htmlFor="options">{ __('Post Type:', 'benenson') }</label>
          <select name="options" id="options" onChange={ props.onPostTypeChange }>
            { props.state.types.length < 1 ? (<option value="">{ __('Loading...', 'benenson') }</option>) : Object.keys(props.state.types).map(key => <option key={ key } value={ key }>{ props.state.types[key].name }</option>) }
          </select>
        </div>
      </div>
      <div className="post-selectorContainer">
        <PostList
          posts={ postList }
          loading={ props.state.initialLoading || props.state.loading || props.state.filterLoading }
          filtered={ isFiltered }
          action={ props.addPost }
          paging={ props.state.paging }
          canPaginate={ canPaginate }
          doPagination={ props.doPagination }
          icon={ addIcon }
        />
        <PostList
          posts={ props.getSelectedPosts() }
          loading={ props.state.initialLoading }
          action={ props.removePost }
          icon={ removeIcon }
        />
      </div>
    </div>
  </div>);
};

export default PostSelector;
