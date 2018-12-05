import LinkList from './display/LinkList';
import GridItem from './display/GridItem';
import PostItem from './display/PostItem';

const { __ } = wp.i18n;

const SelectPreview = ({ loading, posts = [], ...props }) => {
  if (loading) {
    return <p>{ __('Loading...', 'benenson') }</p>;
  }

  if (!posts.length > 0) {
    return <p>{ __('No Posts.', 'benenson') }</p>;
  }

  if (props.style === 'grid') {
    return (
      <div className={ `grid grid-${posts.length}` }>
      {posts.map(result => <GridItem key={ `${props.prefix}-${result.id}` } { ...result } />)}
      </div>
    );
  }

  if (props.style === 'post') {
    return (
      <div className={ `grid grid-${posts.length}` }>
        {posts.map(result => <PostItem key={ `${props.prefix}-${result.id}` } { ...result } />)}
      </div>
    );
  }

  return (
    <ul className="linkList">
      {posts.map(result => <LinkList key={ `${props.prefix}-${result.id}` } { ...result } />)}
    </ul>
  );
};

export default SelectPreview;
