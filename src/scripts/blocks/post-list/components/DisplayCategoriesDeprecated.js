import LinkList from './display/LinkList';
import GridItem from './display/GridItem';

const { __ } = wp.i18n;
const { Component } = wp.element;


class DisplayCategories extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      results: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchPostsByCategory();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      this.fetchPostsByCategory();
    }
  }

  fetchPostsByCategory() {
    const { category } = this.props;

    if (!category) {
      return;
    }

    this.setState({
      loading: true,
    });

    // We store category as an object to retain the label for the select box.
    const { value } = JSON.parse(category);

    wp.apiRequest({
      path: `/wp/v2/posts/?categories=${value}&_embed`,
    })
      .then(results => this.setState({
        results: this.alterResults(results),
        loading: false,
      }));
  }

  strip = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  alterResults = response => response.map((resp) => {
    const tags = resp
      ._embedded['wp:term']
      .reduce((prev, curr) => ([...prev, ...curr]), [])
      .map(tag => ({
        title: tag.name,
        link: tag.link,
      }));

    let featuredImage = false;

    if (resp.featured_media || resp.featured_media > 0) {
      featuredImage = resp._embedded['wp:featuredmedia'][0].source_url || false;
    }

    let excerpt = this.strip(resp.excerpt.rendered);
    excerpt = excerpt.length > 250 ? `${excerpt.slice(0, 250)}...` : '';

    return {
      id: resp.id,
      title: resp.title.rendered,
      link: resp.link,
      tag: tags.shift(),
      excerpt,
      featured_image: featuredImage,
    };
  });

  render() {
    const { category, style, prefix } = this.props;

    return (<div>
      { this.state.loading && <p>{ __('Loading...', 'benenson') }</p> }

      {
        !this.state.loading &&
        !this.state.results.length &&
        category &&
        <p className="linklist-container">{ __('No Items found', 'benenson') }</p>
      }

      {
        !this.state.loading &&
        !category &&
        <p className="linklist-container">{ __('Select a category.', 'benenson') }</p>
      }

      {
        !this.state.loading &&
        this.state.results.length > 0 &&
        style === 'list' &&
        category &&
        <ul className="linkList linklist-container">
        {
          this.state.results
            .filter((item, i) => i < this.props.amount)
            .map(result => <LinkList key={ `${prefix}-${result.id}` } { ...result } />)
        }
        </ul>
      }

      {
        !this.state.loading &&
        this.state.results.length > 0 &&
        style === 'grid' &&
        category &&
        <div className={ `grid grid-${this.props.amount}` }>
        {
          this.state.results
            .filter((item, i) => i < this.props.amount)
            .map(result => <GridItem key={ `${prefix}-${result.id}` } { ...result } />)
        }
        </div>
      }
    </div>);
  }
}

export default DisplayCategories;
