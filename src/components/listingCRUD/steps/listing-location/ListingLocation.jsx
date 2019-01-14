import "../../../../styles/css/components/profile/listings/listing-location.css";

import {
  INVALID_ADDRESS,
  MISSING_CITY,
  MISSING_COUNTRY
} from "../../../../constants/warningMessages.js";
import BasicsAside from "../../aside/BasicsAside";
import FooterNav from "../../navigation/FooterNav";
import { LONG } from "../../../../constants/notificationDisplayTimes.js";
import ListingCrudNav from "../../navigation/ListingCrudNav";
import { NotificationManager } from "react-notifications";
import PropTypes from "prop-types";
import React from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import * as R from "ramda";
import Form from "./Form";

export class ListingLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: ""
    };

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
                  onCountryChange={({ countryName, countryCode }) => {
                    this.props.onChange({
                      target: { name: "country", value: countryName }
                    });
                    this.props.onChange({
                      target: { name: "countryCode", value: countryCode }
                    });
                  }}
                  initialCountryValue={{
                    countryName: R.path(["props", "values", "country"], this),
                    countryCode: R.path(
                      ["props", "values", "countryCode"],
                      this
                    )
                  }}
                  onCityChange={cityAndState => {
                    this.props.onChange({
                      target: { name: "city", value: cityAndState }
                    });
                  }}
                  initialCityValue={R.path(["props", "values", "city"], this)}
                  onClearCityField={() => {
                    this.props.onChange({
                      target: { name: "city", value: "" }
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
                  initialStreetValue={R.path(
                    ["props", "values", "street"],
                    this
                  )}
                  onClearStreetField={() => {
                    this.props.onChange({
                      target: {
                        name: "street",
                        value: ""
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
