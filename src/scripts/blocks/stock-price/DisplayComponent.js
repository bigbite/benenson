import classnames from 'classnames';
import axios from 'axios';

const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;
const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl, TextControl } = wp.components;
const { InspectorControls, RichText, URLInputButton } = wp.editor;

class DisplayComponent extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      stockPrices: [],
      loading: false,
      error: false,
      stocksymbol: this.props.attributes.stocksymbol,
    };
  }

  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  componentDidMount() {
    console.log('mounted');
  }

  parseData(data){
    console.log('data');
    console.log(data);
    console.log(data.data['Global Quote']['03. high']);
  }

  async fetchStockPrices() {
    const stockSymbol = this.state.stocksymbol;
    //0QOA.ILN
    //TMNSF
    const Url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey==A4HQO5VEF6YLX066`;
    axios.get(Url)
      .then(data => this.parseData(data))
      .catch(err => console.log(err));
  }

  render() {
    this.fetchStockPrices();
    const { attributes } = this.props;

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('Options', 'benenson') }>
          <TextControl
            label={ __('Title', 'benenson') }
            onChange={ this.createUpdateAttribute('title') }
            value={ attributes.title }
          />
          <TextControl
            label={ __('Stock Symbol', 'benenson') }
            onChange={ this.createUpdateAttribute('stocksymbol') }
            value={ attributes.stocksymbol }
          />
        </PanelBody>
      </InspectorControls>
      <div className="editor">
        <TextControl
            label={ __('Stock Symbol', 'benenson') }
            onChange={ this.createUpdateAttribute('stocksymbol') }
            value={ attributes.stocksymbol }
          />
      </div>
    </Fragment>);
  }
}

export default DisplayComponent;
