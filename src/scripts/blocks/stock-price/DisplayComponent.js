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
      stockHigh: this.props.attributes.stockHigh,
      stockLow: this.props.attributes.stockLow,
      stockPrice: this.props.attributes.stockPrice,
      stockChange: this.props.attributes.stockChange,
    };
  }

  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  componentDidMount() {
    const { attributes } = this.props;

    console.log('attributes', attributes);

    this.fetchStockPrices();
  }

  parseData(data) {
    const { setAttributes } = this.props;

    console.log(data);

    if (typeof data.data['Global Quote'] !== 'undefined') {
      console.log('API worked');
      setAttributes({
        stockLow: data.data['Global Quote']['04. low'],
        stockHigh: data.data['Global Quote']['03. high'],
        stockPrice: data.data['Global Quote']['05. price'],
        stockChange: data.data['Global Quote']['10. change percent'],
      });
    } else {
      console.log('API failed use saved values');
      console.log(this.props.attributes.stocksymbol);
      console.log(this.props.attributes.stockHigh);
      // setAttributes({
      //   stockLow: data.data['Global Quote']['04. low'],
      //   stockHigh: data.data['Global Quote']['03. high'],
      //   stockPrice: data.data['Global Quote']['05. price'],
      //   stockChange: data.data['Global Quote']['10. change percent'],
      // });
    }
  }

  async fetchStockPrices() {
    let stockSymbol = false;
    let apiKey = false;
    //0QOA.ILN
    //TMNSF

    //other use TITAN

    const settings = await wp.apiRequest({
      path: '/wp/v2/settings',
    });

    if (this.props.attributes.stocksymbol !== '') {
      stockSymbol = this.props.attributes.stocksymbol;
    } else if (settings['_stock_symbol'] !== '') {
      stockSymbol = settings['_stock_symbol'];
    }

    if (settings['_stock_api_key'] !== '') {
      apiKey = settings['_stock_api_key'];
    }

    const Url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey==${apiKey}`;

    console.log(Url);

    axios.get(Url)
      .then(data => this.parseData(data))
      .catch(err => console.log(err));
  }

  render() {
    const { attributes } = this.props;
    const { change, stockHigh, stockPrice, stockLow } = this.state;

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
          <TextControl
            label={ __('Stock Exchange', 'benenson') }
            onChange={ this.createUpdateAttribute('stockExchange') }
            value={ attributes.stockExchange }
          />
        </PanelBody>
      </InspectorControls>
      <div className="editor">
       <div class="sharePriceTicker">
        <div class="sharePriceTicker-meta">
          <div>{ attributes.stockExchange }</div>
        </div>
        <div class="sharePriceTicker-data">
          <div class="sharePriceTicker-data-high">{ attributes.stockPrice }</div>
          <div class="sharePriceTicker-data-change">{ attributes.stockChange }</div>
        </div>
      </div>
      </div>
    </Fragment>);
  }
}

export default DisplayComponent;
