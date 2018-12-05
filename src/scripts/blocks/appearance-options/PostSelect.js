import Select from 'react-select';

const { Component } = wp.element;
const { __ } = wp.i18n;

class PostSelect extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      loading: false,
      paging: false,
      currentPage: 1,
      maxPages: 1,
      options: [{
        label: 'Global Default',
        value: '0',
      }],
      selected: '',
    };
  }

  componentDidMount() {
    this.fetchSelectedSidebar();
  }

  /**
   * If the current value is present it will fetch that single result,
   * before fetching the remaining posts.
   * @returns {*}
   */
  fetchSelectedSidebar = () => {
    if (!this.props.value) {
      return this.fetchSidebars();
    }

    return wp.apiRequest({ path: `/wp/v2/sidebar/${this.props.value}` })
      .then((item) => {
        this.setState({
          selected: {
            label: item.title.rendered,
            value: item.id,
          },
          options: [{
            label: item.title.rendered,
            value: item.id,
          },
          ...this.state.options,
          ],
        }, () => this.fetchSidebars());
      });
  };

  /**
   * Processes the the api response into an array of objects to be consumed by 'react-select',
   * in addition to this, we also set the current page and max number of pages
   *
   * @param {Object[]} sidebars - Api data response.
   * @param status - the response status
   * @param {Object} xhr - current xhr response object.
   */
  handleApiResult = (sidebars, status, xhr) => {
    const ids = [];
    this.setState({
      options: [
        ...this.state.options,
        ...sidebars.map(sidebar => ({
          label: sidebar.title.rendered,
          value: sidebar.id,
        })),
      ].filter((option) => {
        if (ids.indexOf(option.value) !== -1) {
          return false;
        }

        ids.push(option.value);
        return true;
      }),
      maxPages: xhr.getResponseHeader('x-wp-totalpages'),
      loading: false,
      paging: false,
    });
  };

  fetchSidebars() {
    wp.apiRequest({ path: '/wp/v2/sidebar' })
      .then(this.handleApiResult);
  }

  /**
   * Paginate the sidebar selector when the select box hits the bottom.
   */
  fetchSidebarPage = () => {
    if (this.state.loading || this.state.paging || this.state.currentPage >= this.state.maxPages) {
      return;
    }

    const currentPage = this.state.currentPage + 1;

    this.setState({
      paging: true,
      currentPage,
    });

    wp.apiRequest({ path: `/wp/v2/sidebar/?page=${currentPage}` })
      .then(this.handleApiResult);
  };

  /**
   * Fire the onchange method thats passed down in props,
   * Also sets the state for the selected value.
   *
   * @param {Object} value - current selected item in the select box.
   */
  handleInputChange = (value) => {
    this.props.onChange(value.value);
    this.setState({
      selected: value,
    });
  };

  render() {
    return (<Select
      options={ this.state.options }
      styles={ {
        menu: base => ({
          ...base,
          position: 'relative',
        }),
      } }
      isLoading={ this.state.loading || this.state.paging }
      isDisabled={ this.state.loading }
      placeholder={ this.state.loading ? __('Loading', 'benenson') : __('Select a sidebar', 'benenson') }
      onMenuScrollToBottom={ this.fetchSidebarPage }
      onChange={ this.handleInputChange }
      isClearable={ false }
      value={ this.state.selected || null }
    />);
  }
}

export default PostSelect;
