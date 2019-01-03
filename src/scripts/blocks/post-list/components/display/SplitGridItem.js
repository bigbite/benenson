const SplitGridItem = props => (<article className="splitGrid-item" style={ {
  backgroundImage: `url(${props.featured_image})`,
} }>
  <div class="splitGrid-content">
    { props.tag && <span className="splitGrid-itemMeta"><a>{ props.tag.title }</a></span> }
    <h3 className="splitGrid-itemTitle"><a>{ props.title }</a></h3>
    { props.excerpt && <div className="splitGrid-itemContent" dangerouslySetInnerHTML={ { __html: props.excerpt } } /> }
    <span className="splitGrid-itemDate">{ props.date }</span>
  </div>
</article>);

export default SplitGridItem;
