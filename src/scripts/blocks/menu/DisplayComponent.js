import classnames from 'classnames';

const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;
const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl } = wp.components;
const { InspectorControls } = wp.editor;

class DisplayComponent extends Component {
  // Note: US English spelling.
  static colours = applyFilters('benenson.block.menu.colorOptions', [{
    label: __('White', 'benenson'),
    value: '',
  }, {
    label: __('Grey', 'benenson'),
    value: 'dark',
  }]);

  constructor(...args) {
    super(...args);
    this.state = {
      loadingMenu: false,
      errorMenu: false,
      loadingList: false,
      errorList: false,
      list: [
        { label: __('Select a menu...', 'benenson'), value: '' },
      ],
      menus: {},
    };
  }

  componentDidMount() {
    if (this.props.attributes.menuId) {
      this.fetchMenu();
    }

    this.fetchList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.attributes.menuId !== this.props.attributes.menuId) {
      this.fetchMenu();
    }
  }

  fetchMenu() {
    const { menuId } = this.props.attributes;
    if (this.state.menus[menuId]) {
      return;
    }

    this.setState({
      loadingMenu: true,
    });

    wp.apiRequest({
      path: `/benenson/v1/menu/${menuId}`,
    }).then((response) => {
      this.setState({
        loadingMenu: false,
        menus: {
          ...this.state.menus,
          [menuId]: response,
        },
      });
    });
  }

  fetchList() {
    this.setState({
      loadingList: true,
    });
    wp.apiRequest({
      path: '/benenson/v1/menu',
    }).then((response) => {
      this.setState({
        loadingList: false,
        list: [
          ...this.state.list,
          ...response.map(resp => ({
            label: resp.name,
            value: resp.term_id,
          })),
        ],
      });
    });
  }

  render() {
    const { attributes, setAttributes } = this.props;

    const classes = classnames('postlist-categoriesContainer', {
      [`section--${attributes.color}`]: !!attributes.color,
    });

    const hasLoadedMenu = attributes.menuId &&
      !this.state.loadingMenu &&
      this.state.menus[attributes.menuId];

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          { this.state.loadingList && (<p>
            { __('Loading Menus...', 'benenson') }
          </p>) }
          <SelectControl
            label={ __('Menu', 'benenson') }
            options={ this.state.list }
            disabled={ this.state.loadingList }
            value={ attributes.menuId }
            onChange={ menuId => setAttributes({ menuId: parseInt(menuId, 10) }) }
          />
          <SelectControl
            label={ __('Background Colour', 'benenson') }
            options={ DisplayComponent.colours }
            value={ attributes.color }
            onChange={ color => setAttributes({ color }) }
          />
        </PanelBody>
      </InspectorControls>
      <div>
        { !attributes.menuId && <p>{ __('Select a menu in the sidebar', 'benenson') }</p> }
        { attributes.menuId && this.state.loadingMenu && <p>{ __('Loading Menu...', 'benenson') }</p> }
        { hasLoadedMenu && (<div className={ classes }>
          <ul
            className="postlist-categories"
            dangerouslySetInnerHTML={ { __html: this.state.menus[attributes.menuId].rendered } }
          />
        </div>) }
      </div>
    </Fragment>);
  }
}

export default DisplayComponent;
