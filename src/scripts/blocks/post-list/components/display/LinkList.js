const LinkItem = props => (<li>
  <article className="linkList-item">
    { props.tag && <span className="linkList-itemMeta"><a>{ props.tag.title }</a></span> }
    <h3 className="linkList-itemTitle"><a>{ props.title }</a></h3>
    { props.ctaText && <a className="postGrid-item-button" aria-hidden="true">{ props.ctaText }</a> }
  </article>
</li>);

export default LinkItem;
