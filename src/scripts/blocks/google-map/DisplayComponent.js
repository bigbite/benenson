/* global benensonCoreData, jquery */

import { debounce, isObject } from 'lodash-es';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Select from 'react-select';

const { getBlockType } = wp.blocks;
const {
  PanelBody,
  RangeControl,
  TextControl,
  ToggleControl,
} = wp.components;
const { compose } = wp.compose;
const { InspectorControls } = wp.editor;
const { Component, Fragment } = wp.element;
const { __ } = wp.i18n;


export default class DisplayComponent extends Component {
  apiKey = benensonCoreData.mapsApiKey;

  state = {
    addresses: [],
    addressIndex: null,
    loading: false,
  };

  constructor(...props) {
    super(...props);

    this.getAddress = debounce(this.getAddress.bind(this), 750);
  }

  componentDidMount() {
    if (this.props.attributes.address) {
      this.handleApiCall(this.props.attributes.address);
    }
  }

  setAttributeDefaults() {
    const defaults = getBlockType(this.props.name).attributes;

    this.props.setAttributes({
      address: defaults.address.default,
      latitude: defaults.latitude.default,
      longitude: defaults.longitude.default,
    });
  }

  handleApiCall(address) {
    this.setState({ loading: true });
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${this.apiKey}&address=${address.replace(', ', '+')}`;

    jQuery.ajax({ url }).then((data) => {
      this.setState({ addresses: data.results });
    }).then(() => {
      this.state.addresses.forEach((add, index) => {
        if (this.props.attributes.address === add.formatted_address) {
          this.setState({ addressIndex: index });
        }
      });

      this.setState({ loading: false });
    });
  }

  getAddress = (address) => {
    if (!address) {
      return;
    }

    this.handleApiCall(address);
  }

  setAddress = (option) => {
    if (!isObject(option) || !Object.prototype.hasOwnProperty.call(option, 'value')) {
      this.setState({
        addressIndex: null,
        addresses: [],
      });

      this.setAttributeDefaults();

      return;
    }

    const { setAttributes } = this.props;
    const { addresses } = this.state;
    const address = addresses[option.value];

    this.setState({ addressIndex: option.value });
    setAttributes({ address: address.formatted_address });
    setAttributes({ latitude: address.geometry.location.lat });
    setAttributes({ longitude: address.geometry.location.lng });
  }

  renderInputs() {
    const { attributes, setAttributes } = this.props;

    if (attributes.useCoords) {
      return (<Fragment>
        <TextControl
          label={ __('Latitude', 'benenson') }
          value={ attributes.latitude }
          onChange={ latitude => setAttributes({ latitude }) }
        />
        <TextControl
          label={ __('Longitude', 'benenson') }
          value={ attributes.longitude }
          onChange={ longitude => setAttributes({ longitude }) }
        />
      </Fragment>);
    }

    const { addresses, addressIndex, loading } = this.state;

    const options = addresses.map((address, index) => ({
      value: index,
      label: address.formatted_address,
    }));

    const selectedValue = options.filter(opt => opt.value === addressIndex)[0];

    return (<Select
      options={ options }
      isMulti={ false }
      isLoading={ loading }
      isDisabled={ loading }
      placeholder={ loading ? __('loading', 'benenson') : __('Enter Address', 'benenson') }
      onInputChange={ this.getAddress }
      onChange={ this.setAddress }
      isClearable={ true }
      value={ selectedValue }
    />);
  }

  render() {
    const { attributes, setAttributes } = this.props;

    if (!this.apiKey) {
      return (<div style={ {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
        backgroundColor: '#e5e5e5',
      } }>
        <span>{ __('No Maps API Key found. Please add one in Theme Options.', 'benenson') }</span>
      </div>);
    }

    return (<Fragment>
      <InspectorControls>
        <PanelBody title={ __('User-facing settings', 'benenson') }>
          <ToggleControl
            label={ __('Disable Zoom', 'benenson') }
            checked={ attributes.disableUserZoom }
            onChange={ disableUserZoom => setAttributes({ disableUserZoom }) }
          />
        </PanelBody>
        <PanelBody title={ __('Map Settings', 'benenson') }>
          <ToggleControl
            label={ __('Display Map Marker', 'benenson') }
            checked={ attributes.showMarker }
            onChange={ showMarker => setAttributes({ showMarker }) }
          />
          <ToggleControl
            label={ __('Use Coordinates', 'benenson') }
            help={ __('Set the map centre using lat/lng instead of address lookup', 'benenson') }
            checked={ attributes.useCoords }
            onChange={ useCoords => setAttributes({ useCoords }) }
          />
          <RangeControl
            label={ __('Zoom Level', 'benenson') }
            value={ attributes.zoomLevel }
            min={ 0 }
            max={ 22 }
            onChange={ zoomLevel => setAttributes({ zoomLevel }) }
          />
        </PanelBody>
        <PanelBody title={ __('Map Position', 'benenson') }>
          { this.renderInputs() }
        </PanelBody>
      </InspectorControls>
      <GoogleMap
        mapContainerStyle={ { height: '400px' } }
        zoom={ attributes.zoomLevel }
        center={ { lat: attributes.latitude, lng: attributes.longitude } }
        options={ {
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          rotateControl: false,
          scaleControl: false,
          zoomControl: false,
          scrollwheel: false,
        } }
      >{ attributes.showMarker && <Marker position={ {
        lat: attributes.latitude,
        lng: attributes.longitude,
      } } /> }</GoogleMap>
    </Fragment>);
  }
}
