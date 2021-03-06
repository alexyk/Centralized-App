import React from "react";
import * as R from "ramda";
import AsyncSelect from "react-select/lib/Async";
import customStyles from "../react-select-styles";

interface CountryGoogleClient {
  fetchPredictedCountriesForInput(
    input: string
  ): [
    {
      place_id: string,
      description: string
    }
  ];

  getCountryCodeAndCountryNameForPlaceId(
    placeId: string
  ): { countryCode: string, countryName: string };
}

class GoogleClient implements CityGoogleClient {
  constructor(field) {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.placesService = new window.google.maps.places.PlacesService(field);
  }

  async fetchPredictedCountriesForInput(input) {
    var predictionsForInput = await this.fetchPredictionsForInput(input);
    let predictedCountries = GoogleClient.filterCountries(predictionsForInput);
    return predictedCountries;
  }

  fetchPredictionsForInput(input) {
    return new Promise(resolve => {
      this.autocompleteService.getPlacePredictions(
        {
          input: input
        },
        (predictions, status) => {
          if (status !== "OK") {
            return resolve([]);
          }
          resolve(predictions);
        }
      );
    });
  }

  static filterCountries(predictions) {
    return (predictions || []).filter(p => p.types.includes("country"));
  }

  getCountryCodeAndCountryNameForPlaceId(placeId) {
    return new Promise((resolve, reject) => {
      this.placesService.getDetails(
        {
          placeId: placeId
        },
        (data, status) => {
          if (status !== "OK" || !data) {
            return resolve({
              countryCode: "",
              countryName: ""
            });
          }
          const countryCode = R.pathOr(
            "",
            ["address_components", 0, "short_name"],
            data
          );
          // const countryCode = data.address_components[0].short_name;
          // const countryName = data.address_components[0].long_name;
          const countryName = R.pathOr(
            "",
            ["address_components", 0, "long_name"],
            data
          );
          resolve({ countryCode, countryName });
        }
      );
    });
  }
}

type Props = {
  initialCountryValue?: {
    countryName: string
  },
  onCountrySelected: ({
    countryCode: string,
    countryName: string
  }) => void
};
type State = {};

export default class CountryField extends React.Component<Props, State> {
  googleClient: CountryGoogleClient;

  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      input: ""
    };

    this.adaptCountriesForReactSelect = this.adaptCountriesForReactSelect.bind(
      this
    );
    this.loadOptionsInDropdown = this.loadOptionsInDropdown.bind(this);
    this.onSelectedCountryChange = this.onSelectedCountryChange.bind(this);
    this.tryToSetCountryNameToInitialValue = this.tryToSetCountryNameToInitialValue.bind(
      this
    );
  }

  componentDidMount() {
    this.googleClient =
      this.props.googleClient || new GoogleClient(this.hiddenMapInputField);
    this.tryToSetCountryNameToInitialValue();
  }

  tryToSetCountryNameToInitialValue() {
    let countryName = R.path(
      ["props", "initialCountryValue", "countryName"],
      this
    );
    if (countryName) {
      this.setState({
        selectedOption: { label: countryName }
      });
    }
  }

  adaptCountriesForReactSelect(countries) {
    return (countries || []).map(country => ({
      value: country.place_id,
      label: country.description
    }));
  }

  onSelectedCountryChange(selectedOption) {
    if (!selectedOption) return;
    this.googleClient
      .getCountryCodeAndCountryNameForPlaceId(selectedOption.value)
      .then(({ countryCode, countryName }) => {
        if (this.props.onCountrySelected) {
          this.props.onCountrySelected({
            countryCode,
            countryName
          });
        }
      });
    this.setState({ selectedOption });
  }

  async loadOptionsInDropdown(input, callback) {
    if (!input) return;
    let predictedCountries = await this.googleClient.fetchPredictedCountriesForInput(
      input
    );
    let adaptedPredictedCountries = this.adaptCountriesForReactSelect(
      predictedCountries
    );
    callback(adaptedPredictedCountries);
  }

  render() {
    let { selectedOption } = this.state;
    const SelectComponent = this.props.SelectComponent || AsyncSelect;
    return (
      <React.Fragment>
        <SelectComponent
          value={selectedOption}
          styles={customStyles}
          loadOptions={this.loadOptionsInDropdown}
          onChange={this.onSelectedCountryChange}
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
