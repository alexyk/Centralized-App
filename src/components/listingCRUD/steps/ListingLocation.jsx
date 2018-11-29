// import 'react-select/dist/react-select.css';
import '../../../styles/css/components/profile/listings/listing-location.css';

import { INVALID_ADDRESS, MISSING_ADDRESS, MISSING_CITY, MISSING_COUNTRY } from '../../../constants/warningMessages.js';

import Autocomplete from 'react-google-autocomplete';
import BasicsAside from '../aside/BasicsAside';
import FooterNav from '../navigation/FooterNav';
import { LONG } from '../../../constants/notificationDisplayTimes.js';
import ListingCrudNav from '../navigation/ListingCrudNav';
import LocationPicker from 'react-location-picker';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import AsyncSelect from 'react-select/lib/Async';
import _ from 'lodash';

const GOOGLE_MAPS_API_AUTOCOMPLETE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
const GOOGLE_MAPS_API_PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json'
const GOOGLE_API_KEY = 'AIzaSyBLMYRyzRm83mQIUj3hsO-UVz8-yzfAvmU';

const customStyles = {
  container: (styles) => ({
    ...styles,
    outline: 'none',
  }),
  input: (styles) => ({
    ...styles,
    outline: 'none',
  }),
  control: (styles) => ({
    ...styles,
    height: '61px',
    padding: '0 10px'
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none'
  }),
};

class ListingLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null
    };

    this.onChange = this.onChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.loadOptions = _.debounce(this.loadOptions, 300).bind(this);
  }

  // const getWarningMessage = (message) => {
  //   NotificationManager.warning(message, '', LONG);
  //   props.onChange({ target: { name: 'street', value: '' } });
  //   props.onChange({ target: { name: 'lng', value: '' } });
  //   props.onChange({ target: { name: 'lat', value: '' } });
  //   props.onChange({ target: { name: 'isAddressSelected', value: false } });
  // };

  // const handleStreetSelected = (place) => {
  //   if (place.address_components) {
  //     let addressComponentsMap = props.convertGoogleApiAddressComponents(place);
  //     let lat = place.geometry.location.lat();
  //     let lng = place.geometry.location.lng();
  //     // console.log(place);
  //     // console.log(lat);
  //     // console.log(lng);
  //     props.onChange({ target: { name: 'lng', value: undefined } });
  //     props.onChange({ target: { name: 'lat', value: undefined } });
  //     if (addressComponentsMap.filter(x => x.type === 'route')[0] && lat && lng) {
  //       const addressNumber = addressComponentsMap.filter(x => x.type === 'street_number')[0] ? addressComponentsMap.filter(x => x.type === 'street_number')[0].name : '';
  //       const addressRoute = addressComponentsMap.filter(x => x.type === 'route')[0].name;
  //       if (!addressRoute) {
  //         getWarningMessage('Please fill valid address - location and number');
  //       } else {
  //         const address = `${addressNumber ? addressNumber + ' ' : ''}${addressRoute}`;
  //         props.onChange({ target: { name: 'street', value: address } });
  //         props.onChange({ target: { name: 'lng', value: place.geometry.location.lng() } });
  //         props.onChange({ target: { name: 'lat', value: place.geometry.location.lat() } });
  //         props.onChange({ target: { name: 'isAddressSelected', value: true } });
  //         changeAddressComponents(addressComponentsMap);
  //       }
  //     } else {
  //       getWarningMessage('Invalid address');
  //     }
  //   }
  // };

  // const changeAddressComponents = (addressComponentsMap) => {
  //   let addressCountry = addressComponentsMap.filter(x => x.type === 'country')[0];
  //   let addressCityName = addressComponentsMap.filter(x => x.type === 'locality')[0]
  //     || addressComponentsMap.filter(x => x.type === 'postal_town')[0]
  //     || addressComponentsMap.filter(x => x.type === 'administrative_area_level_2')[0];
  //   let addressStateName = addressComponentsMap.filter(x => x.type === 'administrative_area_level_1')[0];

  //   if (addressCityName) {
  //     props.onChange({ target: { name: 'city', value: addressCityName ? addressCityName.name : '' } });
  //   }
  //   else {
  //     getWarningMessage('An error has occurred. Please contact with support');
  //   }
  //   props.onChange({ target: { name: 'country', value: addressCountry ? addressCountry.name : '' } });
  //   props.onChange({ target: { name: 'state', value: addressStateName ? addressStateName.name : '' } });
  //   props.onChange({ target: { name: 'countryCode', value: addressCountry ? addressCountry.shortName : '' } });
  // };

  // const onAddressChange = (e) => {
  //   props.onChange({ target: { name: 'isAddressSelected', value: false } });
  //   props.onChange(e);
  // };

  

  onChange(selectedOption) {
    if (selectedOption) {
      this.props.onChange({ target: { name: 'selectedOption', value: selectedOption }});
      this.geocode(selectedOption.value);
    }
  }

  onInputChange(input) {
    if (!input) {
      input = '';
    }

    this.setState({ input });
  }

  fetchCities() {
    const { input } = this.state;
    return fetch(`${GOOGLE_MAPS_API_AUTOCOMPLETE_URL}?key=${GOOGLE_API_KEY}&type=address&input=${input}`)
      .then(res => res.json())
      .then(data => {
        const { predictions } = data;
        if (!predictions) {
          return [];
        }
        
        return predictions.map(c => ({
          value: c.place_id,
          label: c.description
        }));
      });
  }

  geocode(placeId) {
    fetch(`${GOOGLE_MAPS_API_PLACE_DETAILS_URL}?placeid=${placeId}&key=${GOOGLE_API_KEY}&fields=address_component,geometry&language=en`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'OK') {
          const { lat, lng } = data.result.geometry.location;
          const address = this.getAddressComponents(data.result.address_components);
          this.props.onChange({ target: { name: 'street', value: this.props.values.selectedOption.label } });
          this.props.onChange({ target: { name: 'country', value: address.country } });
          this.props.onChange({ target: { name: 'state', value: address.state } });
          this.props.onChange({ target: { name: 'city', value: address.city } });
          this.props.onChange({ target: { name: 'lat', value: lat } });
          this.props.onChange({ target: { name: 'lng', value: lng } });
        }
      });
  }

  loadOptions(input, callback) {
    this.fetchCities().then(cities => callback(cities));
  }

  getAddressComponents(components) {
    const address = {};

    components.forEach((component) => {
      const types = component.types;
      if (types.indexOf('locality') !== -1) {
        address.city = component.long_name;
      }
      if (types.indexOf('country') !== -1) {
        address.country = component.long_name;
      }
      if (types.indexOf('administrative_area_level_1') !== -1) {
        address.state = component.long_name;
      }
    });

    if (!address.state) {
      address.state = address.city;
    }

    return address;
  }
  

  render() {

    const { country, city, selectedOption, state } = this.props.values;
    const next = validateInput(this.props.values) ? this.props.next : this.props.location.pathname;
    const handleClickNext = validateInput(this.props.values)
      ? () => { this.props.updateProgress(1); }
      : () => { showErrors(this.props.values); };

    const defaultPosition = {
      lat: Number(this.props.values.lat),
      lng: Number(this.props.values.lng)
    };

    return (
      <div id="create-listing-location">
        <ListingCrudNav progress='33%' />
        <div className="container">
          <div className="row">
            <div className="listings create">
              <div className="col-md-3">
                <BasicsAside routes={this.props.routes} />
              </div>
              <div className="col-md-9">
                <div className="form-group">
                  <h2>Where&rsquo;s your place located?</h2>
                  <hr />
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="street">Street address</label>
                      {/* <Autocomplete
                        value={street}
                        onChange={onAddressChange}
                        name="street"
                        onPlaceSelected={handleStreetSelected}
                        types={['address']}
                        placeholder="e.g. 123 Easy Street"
                      /> */}
                      <AsyncSelect
                        className={``}
                        value={selectedOption}
                        styles={customStyles}
                        loadOptions={this.loadOptions}
                        onInputChange={this.onInputChange}
                        onChange={this.onChange}
                        placeholder={'e.g. 123 Easy Street'}
                        isClearable
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="country">Country/Region</label>
                      <input id="country" name="country" onChange={this.props.onChange} value={country} placeholder="-- Select country/region --" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input id="city" name="city" onChange={this.props.onChange} value={city} />
                    </div>

                    <div className="form-group">
                      <label htmlFor="country">State</label>
                      <input id="state" name="state" onChange={this.props.onChange} value={state} />
                    </div>
                    <div className="protection-message">
                      <p><i className="fa fa-2x fa-lightbulb-o" aria-hidden="true"></i>Your exact address will only be shared with confirmed guests.</p>
                    </div>
                    {this.props.values.lat && this.props.values.lng && <LocationPicker
                      containerElement={<div style={{ height: '100%' }} />}
                      mapElement={<div style={{ height: '400px' }} />}
                      defaultPosition={defaultPosition}
                      onChange={this.props.handleLocationChange}
                      radius={-1}
                      zoom={16}
                    />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterNav next={next} prev={this.props.prev} handleClickNext={handleClickNext} step={5} />
      </div>
    );
  }
}

function validateInput(values) {
  const { street, city, country, isAddressSelected } = values;
  if (!isAddressSelected) {
    return false;
  }

  if (street.length < 6) {
    return false;
  }

  if (!city || city.trim() === '') {
    return false;
  }

  if (!country || country.trim() === '') {
    return false;
  }

  return true;
}

function showErrors(values) {
  const { street, city, country, isAddressSelected } = values;
  if (!isAddressSelected) {
    NotificationManager.warning(MISSING_ADDRESS, '', LONG);
  }

  if (street.length < 6) {
    NotificationManager.warning(INVALID_ADDRESS, '', LONG);
  }

  if (!city || city.trim() === '') {
    NotificationManager.warning(MISSING_CITY, '', LONG);
  }

  if (!country || country.trim() === '') {
    NotificationManager.warning(MISSING_COUNTRY, '', LONG);
  }
}

ListingLocation.propTypes = {
  values: PropTypes.any,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  updateCities: PropTypes.func,
  updateProgress: PropTypes.func,
  prev: PropTypes.string,
  next: PropTypes.string,
  convertGoogleApiAddressComponents: PropTypes.func,
  routes: PropTypes.object,
  handleLocationChange: PropTypes.func,

  // Router props
  location: PropTypes.object,
};

export default withRouter(ListingLocation);
