import "../../../styles/css/components/profile/listings/listing-location.css";

import {
  INVALID_ADDRESS,
  MISSING_CITY,
  MISSING_COUNTRY
} from "../../../constants/warningMessages.js";
import BasicsAside from "../aside/BasicsAside";
import FooterNav from "../navigation/FooterNav";
import { LONG } from "../../../constants/notificationDisplayTimes.js";
import ListingCrudNav from "../navigation/ListingCrudNav";
import LocationPicker from "react-location-picker";
import { NotificationManager } from "react-notifications";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";
import AsyncSelect from "react-select/lib/Async";
import _ from "lodash";

const customStyles = {
  container: styles => ({
    ...styles,
    outline: "none"
  }),
  input: styles => ({
    ...styles,
    outline: "none"
  }),
  control: styles => ({
    ...styles,
    height: "61px",
    padding: "0 10px"
  }),
  indicatorSeparator: styles => ({
    ...styles,
    display: "none"
  })
};

class CountryField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      input: ""
    };

    this.adaptCountriesForReactSelect = this.adaptCountriesForReactSelect.bind(
      this
    );
    this.filterCountries = this.filterCountries.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getCountryCode = this.getCountryCode.bind(this);
  }

  componentDidMount() {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.placesService = new window.google.maps.places.PlacesService(
      this.hiddenMapInputField
    );
  }

  async loadOptions(input, callback) {
    if (!input) return;
    var a = await this.fetchOptions(input);
    let b = this.filterCountries(a);
    let c = this.adaptCountriesForReactSelect(b);
    console.log("c", c);
    callback(c);
  }

  fetchOptions(input) {
    const as = this.autocompleteService;
    return new Promise(resolve => {
      as.getPlacePredictions(
        {
          input: input
        },
        (predictions, status) => {
          resolve(predictions);
        }
      );
    });
  }

  filterCountries(predictions) {
    return (predictions || []).filter(p => p.types.includes("country"));
  }

  adaptCountriesForReactSelect(countries) {
    return (countries || []).map(country => ({
      value: country.place_id,
      label: country.description
    }));
  }

  onChange(selectedOption) {
    if (!selectedOption) return;
    this.getCountryCode(selectedOption.value).then(
      ({ countryCode, countryName }) => {
        if (this.props.onCountrySelected) {
          this.props.onCountrySelected({
            countryCode,
            countryName
          });
        }
      }
    );
    this.setState({ selectedOption });
  }

  getCountryCode(placeId) {
    return new Promise((resolve, reject) => {
      this.placesService.getDetails(
        {
          placeId: placeId
        },
        (data, status) => {
          const countryCode = data.address_components[0].short_name;
          const countryName = data.address_components[0].long_name;
          resolve({ countryCode, countryName });
        }
      );
    });
  }

  render() {
    let { selectedOption } = this.state;
    return (
      <React.Fragment>
        <AsyncSelect
          value={selectedOption}
          styles={customStyles}
          loadOptions={this.loadOptions}
          // onInputChange={this.onInputChange}
          onChange={this.onChange}
          placeholder={"-- Select Country --"}
          isClearable
          required
        />
        <input
          type={"hidden"}
          ref={el => {
            this.hiddenMapInputField = el;
          }}
        />
      </React.Fragment>
    );
  }
}

class CityField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      input: ""
    };

    this.adaptCitiesForReactSelect = this.adaptCitiesForReactSelect.bind(this);
    this.filterCountries = this.filterCountries.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getDetails = this.getDetails.bind(this);
  }

  componentDidMount() {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.placesService = new window.google.maps.places.PlacesService(
      this.hiddenMapInputField
    );
  }

  async loadOptions(input, callback) {
    if (!input) return;
    var a = await this.fetchOptions(input);
    let b = this.filterCountries(a);
    let c = this.adaptCitiesForReactSelect(b);
    console.log("c", c);
    callback(c);
  }

  fetchOptions(input) {
    const as = this.autocompleteService;
    return new Promise(resolve => {
      as.getPlacePredictions(
        {
          input: input,
          componentRestrictions: {
            country: this.props.countryCode
          }
        },
        (predictions, status) => {
          resolve(predictions);
        }
      );
    });
  }

  filterCountries(predictions) {
    return (predictions || []).filter(p => p.types.includes("locality"));
  }

  adaptCitiesForReactSelect(cities) {
    return (cities || []).map(city => ({
      value: city.place_id,
      label: city.description
    }));
  }

  onChange(selectedOption) {
    if (!selectedOption || !selectedOption.value) return;
    this.getDetails(selectedOption.value).then(label => {
      this.setState({ selectedOption: { ...selectedOption, label } });
      this.props.onCityChange(label);
    });
  }

  getDetails(placeId) {
    return new Promise((resolve, reject) => {
      this.placesService.getDetails(
        {
          placeId: placeId
        },
        (data, status) => {
          const ac = data.address_components;
          const city = ac.find(a => a.types.includes("locality"));
          const state = ac.find(a =>
            a.types.includes("administrative_area_level_1")
          );

          resolve(city.long_name + ", " + state.long_name);
        }
      );
    });
  }

  render() {
    let { selectedOption } = this.state;
    return (
      <React.Fragment>
        <AsyncSelect
          value={selectedOption}
          styles={customStyles}
          loadOptions={this.loadOptions}
          // onInputChange={this.onInputChange}
          onChange={this.onChange}
          placeholder={"-- Select City --"}
          isClearable
          required
        />
        <input
          type={"hidden"}
          ref={el => {
            this.hiddenMapInputField = el;
          }}
        />
      </React.Fragment>
    );
  }
}

class StreetField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      mapLocation: null
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.updateMapData = this.updateMapData.bind(this);
    this.fetchPredictionsForAddress = this.fetchPredictionsForAddress.bind(
      this
    );
    this.getPlaceIdOfFirstStreetPrediction = this.getPlaceIdOfFirstStreetPrediction.bind(
      this
    );
    this.getLocationForStreetPlaceId = this.getLocationForStreetPlaceId.bind(
      this
    );
  }

  componentDidMount() {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.placesService = new window.google.maps.places.PlacesService(
      this.mapInputField
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.countryCode !== prevProps.countryCode) {
      this.updateMapData(this.state.input);
    }
  }

  onInputChange(e) {
    this.setState({ input: e.target.value }, async () => {
      this.updateMapData(this.state.input);
      this.props.onStreetChange(this.state.input);
    });
  }

  async updateMapData() {
    var predictions = await this.fetchPredictionsForAddress(this.state.input);
    let idOfFirstStreet = this.getPlaceIdOfFirstStreetPrediction(predictions);
    if (idOfFirstStreet) {
      let locationOfStreet = await this.getLocationForStreetPlaceId(
        idOfFirstStreet
      );
      this.setState({
        mapLocation: locationOfStreet || null
      });
    } else {
      this.setState({
        mapLocation: null
      });
    }
  }

  fetchPredictionsForAddress(input) {
    const as = this.autocompleteService;
    return new Promise(resolve => {
      as.getPlacePredictions(
        {
          input: input,
          componentRestrictions: {
            country: this.props.countryCode
          }
        },
        (predictions, status) => {
          resolve(predictions);
        }
      );
    });
  }

  getPlaceIdOfFirstStreetPrediction(predictions) {
    let firstStreet = (predictions || []).find(
      p => p.types.includes("street_address") || p.types.includes("route")
    );
    if (firstStreet) {
      return firstStreet.place_id;
    }
    return undefined;
  }

  getLocationForStreetPlaceId(placeId) {
    return new Promise((resolve, reject) => {
      this.placesService.getDetails(
        {
          placeId: placeId
        },
        (data, status) => {
          if (!data) {
            return resolve(undefined);
          }
          let location = {
            lat: data.geometry.location.lat(),
            lng: data.geometry.location.lng()
          };

          resolve(location);
        }
      );
    });
  }

  render() {
    return (
      <React.Fragment>
        <input
          type={"text"}
          ref={el => {
            this.mapInputField = el;
          }}
          onChange={this.onInputChange}
          value={this.state.input}
        />

        {this.state.mapLocation && (
          <LocationPicker
            containerElement={<div style={{ height: "100%" }} />}
            mapElement={<div style={{ height: "400px" }} />}
            defaultPosition={this.state.mapLocation}
            onChange={() => {}}
            radius={-1}
            zoom={16}
          />
        )}
      </React.Fragment>
    );
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countryCode: ""
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <CountryField
              onCountrySelected={({ countryCode, countryName }) => {
                this.setState({ countryCode });
                this.props.onCountryChange(countryName);
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City/State</label>
            <CityField
              countryCode={this.state.countryCode}
              onCityChange={this.props.onCityChange}
            />
          </div>
          <div className="form-group" data-testid={"street-address"}>
            <label htmlFor="street">Street address</label>
            <StreetField
              countryCode={this.state.countryCode}
              onStreetChange={this.props.onStreetChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export class ListingLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: ""
    };

    console.log("CONSTRUCTOR");

    this.onChange = this.onChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.autocompleteCountries = this.autocompleteCountries.bind(this);
    this.findPlaceBasedOnLatAndLong = this.findPlaceBasedOnLatAndLong.bind(
      this
    );
    this.loadOptions = _.debounce(this.loadOptions, 300).bind(this);
  }

  autocompleteCountries() {}

  findPlaceBasedOnLatAndLong(lat, lng) {
    var geocoder = new window.google.maps.Geocoder();

    var latlng = {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    };
    geocoder.geocode({ location: latlng, region: "en" }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          console.log(results[0]);
          console.log(results[0].place_id);
          this.onChange({
            value: results[0].place_id,
            label: results[0].formatted_address
          });
        }
      }
    });
  }

  componentDidMount() {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.placesService = new window.google.maps.places.PlacesService(
      this.mapInputField
    );
  }
  onInputChange(input) {
    if (input) {
      this.setState({ input });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.values.street !== this.props.values.street) {
      console.log("did update", this.props.values.street);
      this.setState({ input: this.props.values.street });
    }

    if (this.props.values.mapAddress !== prevProps.values.mapAddress) {
      this.findPlaceBasedOnLatAndLong(
        this.props.values.lat,
        this.props.values.lng
      );
      // this.setState({
      //   input: this.props.values.mapAddress
      // });
      // this.props.onChange({
      //   target: {
      //     name: "street",
      //     value: this.props.values.mapAddress
      //   }
      // });
    }
  }

  onChange(selectedOption) {
    if (selectedOption) {
      this.props.onChange({
        target: { name: "selectedOption", value: selectedOption }
      });
      this.geocode(selectedOption.value);
    }
  }

  geocode(placeId) {
    return this.placesService.getDetails(
      {
        placeId: placeId
      },
      (data, status) => {
        const { lat, lng } = data.geometry.location;
        const address = this.getAddressComponents(data.address_components);
        this.props.onChange({
          target: {
            name: "street",
            value: this.props.values.selectedOption.label
          }
        });
        this.props.onChange({
          target: { name: "country", value: address.country }
        });
        this.props.onChange({
          target: { name: "state", value: address.state }
        });
        this.props.onChange({
          target: { name: "city", value: address.city }
        });
        this.props.onChange({ target: { name: "lat", value: lat() } });
        this.props.onChange({ target: { name: "lng", value: lng() } });
      }
    );
  }
  fetchOptions() {
    const { input } = this.state;
    return new Promise(resolve => {
      this.autocompleteService.getPlacePredictions(
        {
          input: input
        },
        {
          types: ["country"]
        },
        (predictions, status) => {
          let a = (predictions || []).map(c => ({
            value: c.place_id,
            label: c.description
          }));
          resolve(a);
        }
      );
    });
  }
  loadOptions(input, callback) {
    this.fetchOptions().then(callback);
  }

  getAddressComponents(components) {
    const address = {};

    components.forEach(component => {
      const types = component.types;
      if (types.indexOf("locality") !== -1) {
        address.city = component.long_name;
      }
      if (types.indexOf("country") !== -1) {
        address.country = component.long_name;
      }
      if (types.indexOf("administrative_area_level_1") !== -1) {
        address.state = component.long_name;
      }
    });

    const locality = address.city || address.state;
    if (!address.city) {
      address.city = locality;
    }

    if (!address.state) {
      address.state = locality;
    }

    return address;
  }

  render() {
    const { country, city, selectedOption, state } = this.props.values;
    const next = validateInput(this.props.values)
      ? this.props.next
      : this.props.location.pathname;
    const handleClickNext = validateInput(this.props.values)
      ? () => {
          this.props.updateProgress(1);
        }
      : () => {
          showErrors(this.props.values);
        };

    const defaultPosition = {
      lat: Number(this.props.values.lat),
      lng: Number(this.props.values.lng)
    };

    return (
      <div id="create-listing-location">
        <ListingCrudNav progress="33%" />
        <div className="container">
          <div className="listings create">
            <BasicsAside routes={this.props.routes} />
            <div id="reservation-hotel-review-room">
              <div className="form-group">
                <h2>Where&rsquo;s your place located?</h2>
                <hr />
                <Form
                  onCountryChange={countryName => {
                    this.props.onChange({
                      target: { name: "country", value: countryName }
                    });
                  }}
                  onCityChange={cityAndState => {
                    this.props.onChange({
                      target: { name: "city", value: cityAndState }
                    });
                  }}
                  onStreetChange={streetAddress => {
                    this.props.onChange({
                      target: {
                        name: "street",
                        value: streetAddress
                      }
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <FooterNav
          next={next}
          prev={this.props.prev}
          handleClickNext={handleClickNext}
          step={5}
        />
      </div>
    );
  }
}

function validateInput(values) {
  const { street, city, country } = values;
  if (street.length < 6) {
    return false;
  }

  if (!city || city.trim() === "") {
    return false;
  }

  if (!country || country.trim() === "") {
    return false;
  }

  return true;
}

function showErrors(values) {
  const { street, city, country } = values;

  if (street.length < 6) {
    NotificationManager.warning(INVALID_ADDRESS, "", LONG);
  }

  if (!city || city.trim() === "") {
    NotificationManager.warning(MISSING_CITY, "", LONG);
  }

  if (!country || country.trim() === "") {
    NotificationManager.warning(MISSING_COUNTRY, "", LONG);
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
  location: PropTypes.object
};

export default withRouter(ListingLocation);
