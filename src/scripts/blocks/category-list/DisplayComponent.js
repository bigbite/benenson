const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
  PanelBody, RangeControl, Spinner,
} = wp.components;
const { InspectorControls, RichText } = wp.editor;

class DisplayComponent extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      categories: [],
      loading: false,
      error: false,
    };
  }

  componentDidMount() {
    this.fetchCategories();
  }

  async fetchCategories() {
    this.setState({
      loading: true,
      error: false,
    });

    try {
      const categories = await wp.apiRequest({
        path: '/wp/v2/categories?per_page=100&parent=0',
      });

      this.setState({
        categories,
        loading: false,
        error: false,
      });
    } catch (e) {
      this.setState({
        error: true,
        loading: false,
      });
    }
  }

  /**
   * Higher order component that takes the attribute key,
   * this then returns a function which takes a value,
   * when called it updates the attribute with the key.
   * @param key
   * @returns {function(*): *}
   */
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  render() {
    const { attributes } = this.props;
    const { loading, error, categories = [] } = this.state;

    const controls = (
        <InspectorControls>
          <PanelBody title={ __('Options', 'benenson') }>
            <RangeControl
              label={__('Maximum number of categories to show')}
              desc={__('Set to 0 to show all.')}
              value={attributes.maximum || 0}
              onChange={this.createUpdateAttribute('maximum')}
              min={0}
              max={categories.length}
            />
          </PanelBody>
        </InspectorControls>
    );

    return (
      <Fragment>
        { controls }
        <div>
          <RichText
            tagName="h3"
            placeholder={ __('Title', 'benenson') }
            value={attributes.title}
            onChange={this.createUpdateAttribute('title')}
            keepPlaceholderOnFocus={ true }
            format="string"
          />
          <div className="wp-category-container">
            { loading && (
              <div>
                <Spinner />
                <p>{ __('Loading categories', 'benenson') }</p>
              </div>
            ) }

            { error && (
              <p>{ __('Something went wrong whilst trying to fetch the categories.', 'benenson') }</p>
            ) }

            { !loading && !error && categories.length < 1 && (
              <p>{ __('No categories to show.', 'benenson') }</p>
            ) }

            { !loading && !error && categories.length > 0 && (
              <ul>
                {
                  // eslint-disable-next-line max-len
                  categories.filter((cat, index) => !attributes.maximum || attributes.maximum === 0 || index + 1 <= attributes.maximum).map(category => <li key={category.id}>{category.name}</li>)
                }
              </ul>
            ) }
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DisplayComponent;
