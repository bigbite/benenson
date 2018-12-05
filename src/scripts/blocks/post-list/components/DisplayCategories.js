import difference from 'lodash-es/difference';
import isString from 'lodash-es/isString';
import LinkList from './display/LinkList';
import GridItem from './display/GridItem';
import PostItem from './display/PostItem';

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

  normaliseCategory = (category = '[]') => {
    let normal = category;

    if (isString(normal)) {
      normal = JSON.parse(normal);
    }

    if (!Array.isArray(normal)) {
      normal = [normal];
    }

    normal = normal.map((val) => {
      if (isString(val)) {
        return JSON.parse(val);
      }

      return val;
    });

    return normal.filter(Boolean);
  }

  componentDidMount() {
    this.fetchPostsByCategory();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.category && !this.props.category) {
      return;
    }

    const prev = this.normaliseCategory(prevProps.category);
    const next = this.normaliseCategory(this.props.category);

    if (prev.length !== next.length) {
      this.fetchPostsByCategory();
      return;
    }

    let propsAreEquivalent = true;

    next.forEach((a, i) => {
      const b = prev[i];
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);

      if (difference(aKeys, bKeys).length > 0) {
        propsAreEquivalent = false;
        return;
      }

      aKeys.forEach((k) => {
        if (a[k] === b[k]) {
          return;
        }

        propsAreEquivalent = false;
      });
    });

    if (!propsAreEquivalent) {
      this.fetchPostsByCategory();
    }
  }

  fetchPostsByCategory() {
    const { category } = this.props;

    let value = this.normaliseCategory(category);

    if (!value.length) {
      this.setState({
        results: [],
        category: [],
      });
      return;
    }

    this.setState({
      loading: true,
    });

    // We store category as string of an array of objects
    // to retain the label for the select box.
    value = value.map(v => v.value).join(',');

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
    const { style, prefix } = this.props;
    const { loading, results } = this.state;
    const category = this.normaliseCategory(this.props.category);

    const isList = style === 'list';
    const isGrid = style === 'grid';
    const isPost = style === 'post';

    const hasCategory = category.length > 0;
    const hasResults = results.length > 0;

    if (loading) {
      return (<div><p>{ __('Loading...', 'benenson') }</p></div>);
    }

    if (!hasCategory) {
      return (<div><p className="linklist-container">{ __('Select a category.', 'benenson') }</p></div>);
    }

    if (!hasResults) {
      return (<div><p className="linklist-container">{ __('No Items found', 'benenson') }</p></div>);
    }

    if (isList) {
      return (
        <div>
          <ul className="linkList linklist-container">
            {results.filter((item, i) => i < this.props.amount).map(result => <LinkList key={ `${prefix}-${result.id}` } { ...result } />)}
          </ul>
        </div>
      );
    }

    if (isGrid) {
      return (
        <div>
          <div className={ `grid grid-${this.props.amount}` }>
            {results.filter((item, i) => i < this.props.amount).map(result => <GridItem key={ `${prefix}-${result.id}` } { ...result } />)}
          </div>
        </div>
      );
    }

    if (isPost) {
      return (
        <div>
          <div className={ `grid grid-${this.props.amount}` }>
            {results.filter((item, i) => i < this.props.amount).map(result => <PostItem key={ `${prefix}-${result.id}` } { ...result } />)}
          </div>
        </div>
      );
    }

    return (<div></div>);
  }
}

export default DisplayCategories;
