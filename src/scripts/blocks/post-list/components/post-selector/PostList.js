import { Post } from './Post';

const { __ } = wp.i18n;

/**
 * PostList Component
 * @param object props - Component props.
 * @returns {*}
 * @constructor
 */
export const PostList = (props) => {
  const {
    filtered = false,
    loading = false,
    posts = [],
    action = () => {},
    icon = null,
  } = props;

  if (loading) {
    return <p>{ __('Loading Posts...', 'benenson') }</p>;
  }

  if (filtered && posts.length < 1) {
    return (<div className="post-list">
      <p>{ __('Your query yielded no results, please try again.', 'benenson') }</p>
    </div>);
  }

  if (!posts || posts.length < 1) {
    return <p>{ __('No Posts.', 'benenson') }</p>;
  }

  return (<div className="post-list">
    { posts.map(post => (
      <Post key={ post.id } { ...post } clickHandler={ action } icon={ icon } />
    )) }
    { props.canPaginate
      ? (
        <button onClick={ props.doPagination } disabled={ props.paging }>
          { props.paging ? __('Loading...', 'benenson') : __('Load More', 'benenson') }
        </button>
      ) : null
    }
  </div>);
};

export default PostList;
