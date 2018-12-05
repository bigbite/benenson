
const PostItem = props => (<article className="postGrid-item">
  <h3 className="grid-itemTitle"><a>{ props.title }</a></h3>
  { props.tag && <span className="grid-itemMeta"><a>{ props.tag.title }</a></span> }
  { props.excerpt && <div className="grid-itemContent" dangerouslySetInnerHTML={ { __html: props.excerpt } } /> }
</article>);

export default PostItem;
