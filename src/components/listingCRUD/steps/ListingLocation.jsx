import 'react-select/dist/react-select.css';
import '../../../styles/css/components/profile/listings/listing-location.scss';

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

function ListingLocation(props) {
  const getWarningMessage = (message) => {
    NotificationManager.warning(message, '', LONG);
    props.onChange({ target: { name: 'street', value: '' } });
    props.onChange({ target: { name: 'lng', value: '' } });
    props.onChange({ target: { name: 'lat', value: '' } });
    props.onChange({ target: { name: 'isAddressSelected', value: false } });
  };

  const handleStreetSelected = (place) => {
    if (place.address_components) {
      let addressComponentsMap = props.convertGoogleApiAddressComponents(place);
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      // console.log(place);
      // console.log(lat);
      // console.log(lng);
      props.onChange({ target: { name: 'lng', value: undefined } });
      props.onChange({ target: { name: 'lat', value: undefined } });
      if (addressComponentsMap.filter(x => x.type === 'route')[0] && lat && lng) {
        const addressNumber = addressComponentsMap.filter(x => x.type === 'street_number')[0] ? addressComponentsMap.filter(x => x.type === 'street_number')[0].name : '';
        const addressRoute = addressComponentsMap.filter(x => x.type === 'route')[0].name;
        if (!addressRoute) {
          getWarningMessage('Please fill valid address - location and number');
        } else {
          const address = `${addressNumber ? addressNumber + ' ' : ''}${addressRoute}`;
          props.onChange({ target: { name: 'street', value: address } });
          props.onChange({ target: { name: 'lng', value: place.geometry.location.lng() } });
          props.onChange({ target: { name: 'lat', value: place.geometry.location.lat() } });
          props.onChange({ target: { name: 'isAddressSelected', value: true } });
          changeAddressComponents(addressComponentsMap);
        }
      } else {
        getWarningMessage('Invalid address');
      }
    }
  };

  const changeAddressComponents = (addressComponentsMap) => {
    let addressCountry = addressComponentsMap.filter(x => x.type === 'country')[0];
    let addressCityName = addressComponentsMap.filter(x => x.type === 'locality')[0]
      || addressComponentsMap.filter(x => x.type === 'postal_town')[0]
      || addressComponentsMap.filter(x => x.type === 'administrative_area_level_2')[0];
    let addressStateName = addressComponentsMap.filter(x => x.type === 'administrative_area_level_1')[0];

    if (addressCityName) {
      props.onChange({ target: { name: 'city', value: addressCityName ? addressCityName.name : '' } });
    }
    else {
      getWarningMessage('An error has occurred. Please contact with support');
    }
    props.onChange({ target: { name: 'country', value: addressCountry ? addressCountry.name : '' } });
    props.onChange({ target: { name: 'state', value: addressStateName ? addressStateName.name : '' } });
    props.onChange({ target: { name: 'countryCode', value: addressCountry ? addressCountry.shortName : '' } });
  };

  const onAddressChange = (e) => {
    props.onChange({ target: { name: 'isAddressSelected', value: false } });
    props.onChange(e);
  };

  const { country, city, street, state } = props.values;
  const next = validateInput(props.values) ? props.next : props.location.pathname;
  const handleClickNext = validateInput(props.values)
    ? () => { props.updateProgress(1); }
    : () => { showErrors(props.values); };

  const defaultPosition = {
    lat: Number(props.values.lat),
    lng: Number(props.values.lng)
  };

  return (
    <div id="create-listing-location">
      <ListingCrudNav progress='33%' />
      <div className="container">
        <div className="row">
          <div className="listings create">
            <div className="col-md-3">
              <BasicsAside routes={props.routes} />
            </div>
            <div className="col-md-9">
              <div className="form-group">
                <h2>Where&rsquo;s your place located?</h2>
                <hr />
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="street">Street address</label>
                    <Autocomplete
                      value={street}
                      onChange={onAddressChange}
                      name="street"
                      onPlaceSelected={handleStreetSelected}
                      types={['address']}
                      placeholder="e.g. 123 Easy Street"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country/Region</label>
                    <input id="country" name="country" onChange={props.onChange} value={country} placeholder="-- Select country/region --" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input id="city" name="city" onChange={props.onChange} value={city} />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">State</label>
                    <input id="state" name="state" onChange={props.onChange} value={state} />
                  </div>
                  <div className="protection-message">
                    <p><i className="fa fa-2x fa-lightbulb-o" aria-hidden="true"></i>Your exact address will only be shared with confirmed guests.</p>
                  </div>
                  {props.values.lat && props.values.lng && <LocationPicker
                    containerElement={<div style={{ height: '100%' }} />}
                    mapElement={<div style={{ height: '400px' }} />}
                    defaultPosition={defaultPosition}
                    onChange={props.handleLocationChange}
                    radius={-1}
                    zoom={16}
                  />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterNav next={next} prev={props.prev} handleClickNext={handleClickNext} step={5} />
    </div>
  );
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
