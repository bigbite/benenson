const GridItem = props => (<article className="grid-item" style={ {
  backgroundImage: `url(${props.featured_image})`,
} }>
  { props.tag && <span className="grid-itemMeta"><a>{ props.tag.title }</a></span> }
  <h3 className="grid-itemTitle"><a>{ props.title }</a></h3>
  { props.excerpt && <div className="grid-itemContent" dangerouslySetInnerHTML={ { __html: props.excerpt } } /> }
</article>);

export default GridItem;
