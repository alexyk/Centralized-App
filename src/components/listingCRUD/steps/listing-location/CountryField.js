import React from "react";
import * as R from "ramda";
import AsyncSelect from "react-select/lib/Async";
import customStyles from "./react-select-styles";

export default class CountryField extends React.Component {
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
    let cn = R.path(["props", "initialCountryValue", "countryName"], this);
    if (cn) {
      console.log(this.props);
      this.setState({
        selectedOption: { label: cn }
      });
    }
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
