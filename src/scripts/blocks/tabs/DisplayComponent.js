import classnames from 'classnames';

const randId = () => Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { applyFilters } = wp.hooks;
const {
  PanelBody, Button, TextControl, ToggleControl, SelectControl,
} = wp.components;

const {
  InspectorControls, RichText, BlockIcon, URLInputButton, InnerBlocks,
} = wp.editor;

const { PostMediaSelector } = benenson.components;

class DisplayComponent extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      selectedTab: 0,
    };
  }

  static emptyTab = {
    id: '',
    title: '',
  };

  /**
   * Higher order component that takes the attribute key,
   * this then returns a function which takes a value,
   * when called it updates the attribute with the key.
   * @param key
   * @returns {function(*): *}
   */
  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  createUpdateTabAttribute =
  index =>
    key =>
      value =>
        this.props.setAttributes({
          tabs: [
            ...this.props.attributes.tabs
              .slice(0, Math.max(0, index)),
            {
              ...this.props.attributes.tabs[index],
              [key]: value,
            },
            ...this.props.attributes
              .tabs.slice(index + 1, this.props.attributes.tabs.length),
          ],
        });


  getBlockList = () => {
    const blockList = [];

    wp.data.select('core/blocks').getBlockTypes().forEach((block) => {
      if (block.name !== 'benenson/block-section') {
        blockList.push(block.name);
      }
    });

    return blockList;
  }

  addTab = () => {
    const { attributes, setAttributes } = this.props;

    this.setState({
      selectedTab: attributes.tabs.length,
    });

    setAttributes({
      tabs: [
        ...attributes.tabs,
        {
          ...DisplayComponent.emptyTab,
          id: randId(),
        },
      ],
    });
  };

  deleteTab = (index) => {
    if (index === this.props.attributes.tabs.length - 1) {
      this.setState({
        selectedTab: index - 1,
      });
    }

    this.props.setAttributes({
      tabs: [
        ...this.props.attributes
          .tabs.slice(0, Math.max(0, index)),
        ...this.props.attributes
          .tabs.slice(index + 1, this.props.attributes.tabs.length),
      ],
    });
  };

  createDeleteTab = index => () => this.deleteTab(index);

  initiateDelete = () => {
    if (confirm(__('Do you wish to delete this tab? This action is irreversible', 'benenson'))) { // eslint-disable-line no-restricted-globals, no-alert
      this.deleteTab(this.state.selectedTab);
    }
  };

  selectTab = index => this.setState({
    selectedTab: index,
  });

  createSelectTab = index => () => this.selectTab(index);

  render() {
    const { attributes, innerBlocks } = this.props;
    const { selectedTab } = this.state;

    const currentTab = attributes.tabs[selectedTab];
    const updateTab = this.createUpdateTabAttribute(selectedTab);

    const tabStyles = applyFilters('benenson.block.tabs.styleOptions', [{
      label: __('Horizontal Tabs', 'benenson'),
      value: '',
    }, {
      label: __('Vertical Tabs', 'benenson'),
      value: 'vertical',
    }]);

    const controls = (
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <TextControl
            label={ __('Tabs title', 'benenson') }
            value={ attributes.tabTitle }
            onChange={ this.createUpdateAttribute('tabTitle') }
          />
          <SelectControl
            label={ __('Tab style', 'benenson') }
            value={ attributes.tabStyle }
            options={ tabStyles }
            onChange={ this.createUpdateAttribute('tabStyle') }
          />
          <ToggleControl
            label={ __('Mobile accordion', 'benenson') }
            help={ __('On mobile the tabs will be stacked, the behaviour will be that of an accordion.', 'benenson') }
            checked={ attributes.mobileAccordion }
            onChange={ this.createUpdateAttribute('mobileAccordion') }
          />
        </PanelBody>
      </InspectorControls>
    );

    const tabClasses = classnames('tabs', {
      [`tabStyle--${attributes.tabStyle}`]: attributes.tabStyle != '',
      ['tabMobile--accordion']: attributes.mobileAccordion,
    });

    console.log(attributes);

    return (
      <Fragment>
        { controls }
        <div className={ tabClasses } data-activeTab={ selectedTab }>
          { innerBlocks.length > 0 && (
            <ul className="tabs-naviation">
              { innerBlocks.map((tab, index) => {
                const title = tab.attributes.title ? tab.attributes.title : __('(No Title)', 'benenson');
                const classes = classnames('tabNavigation-item', {
                  'is-active': index === selectedTab,
                });

                return <li className={ classes }><button className="btn" onClick={ this.createSelectTab(index) }>{ title }</button></li>;
              }) }
            </ul>
          ) }
          <div className="tabs-content">
            <InnerBlocks
              allowedBlocks={ ['benenson/block-tabs-tab'] }
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DisplayComponent;
