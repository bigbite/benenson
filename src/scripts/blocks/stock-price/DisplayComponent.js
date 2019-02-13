import classnames from 'classnames';
import axios from 'axios';

const { __ } = wp.i18n;
const { applyFilters } = wp.hooks;
const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl, TextControl } = wp.components;
const { InspectorControls, RichText, URLInputButton } = wp.editor;

//0QOA.ILN
//TMNSF
//other use TITAN

class DisplayComponent extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      loading: false,
      error: false,
    };
  }

  calculateTimeFromLastCall = (date1, date2) => {
    let difference = date1 - date2;

    const minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60;

    return minutesDifference;
  }

  createUpdateAttribute = key => value => this.props.setAttributes({ [key]: value });

  componentDidMount() {
    const { attributes } = this.props;
    this.fetchStockPrices();
  }

  parseData(data) {
    const { setAttributes } = this.props;

    console.log(data.data);

    if (typeof data.data['Global Quote'] !== 'undefined') {
      setAttributes({
        stockLow: parseFloat(data.data['Global Quote']['04. low']),
        stockHigh: parseFloat(data.data['Global Quote']['03. high']),
        stockPrice: parseFloat(data.data['Global Quote']['05. price']),
        stockChange: data.data['Global Quote']['10. change percent'],
        lastUpdateTime: new Date().getTime(),
      });
    } else if (typeof this.props.attributes.stockChange !== 'undefined') {
      this.setState({ error: `Last updated ${this.props.atribute.lastUpdateTime}` });
    } else {
      this.setState({ error: 'No data from API, API limit may have been reached.' });
    }
  }

  async fetchStockPrices() {
    let stockSymbol = false;
    let apiKey = false;
    console.log('time difference', new Date().getTime(), 'second',this.props.attributes.lastUpdateTime);
    console.log(this.calculateTimeFromLastCall(new Date().getTime(), this.props.attributes.lastUpdateTime));

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

    axios.get(Url)
      .then(data => this.parseData(data))
      .catch(err => console.log(err));
  }

  render() {
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
        <div className="gutenberg-error-message">
          <div class="gutenberg-error-message">{ this.state.error }</div>
        </div>
      </div>
      </div>
    </Fragment>);
  }
}

export default DisplayComponent;
