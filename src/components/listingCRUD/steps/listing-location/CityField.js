import React from "react";
import AsyncSelect from "react-select/lib/Async";
import customStyles from "./react-select-styles";

interface CityGoogleClient {
  fetchCitiesForInput(
    input: string,
    countryCode: string
  ): [
    {
      place_id: string,
      description: string
    }
  ];

  getCityAndStateOfPlaceWithId(placeId: string): string;
}

export class GoogleClient implements CityGoogleClient {
  constructor(field) {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.placesService = new window.google.maps.places.PlacesService(field);
  }

  async fetchCitiesForInput(input, countryCode) {
    var predictions = await this.fetchPredictionsForInput(input, countryCode);
    let predictedCountries = GoogleClient.filterCountries(predictions);
    return predictedCountries;
  }

  fetchPredictionsForInput(input, countryCode) {
    return new Promise(resolve => {
      this.autocompleteService.getPlacePredictions(
        {
          input: input,
          componentRestrictions: {
            country: countryCode
          }
        },
        (predictions, status) => {
          resolve(predictions);
        }
      );
    });
  }

  static filterCountries(predictions) {
    return (predictions || []).filter(p => p.types.includes("locality"));
  }

  getCityAndStateOfPlaceWithId(placeId) {
    return new Promise((resolve, reject) => {
      this.placesService.getDetails(
        {
          placeId
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
}

type Props = {
  onCityChange: Function,
  onClearCityField: Function,
  initialCityValue?: string,
  countryCode?: string
};
type State = {
  selectedOption: null | ReactSelectOption,
  input: string
};

type ReactSelectOption = {
  label: string,
  value: string
};

export default class CityField extends React.Component<Props, State> {
  googleClient: CityGoogleClient;

  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      input: ""
    };

    this.adaptCitiesForReactSelect = this.adaptCitiesForReactSelect.bind(this);
    this.tryToSetStateToInitialValue = this.tryToSetStateToInitialValue.bind(
      this
    );
    this.clearStateIfCountryHasChanged = this.clearStateIfCountryHasChanged.bind(
      this
    );
    this.loadOptions = this.loadOptions.bind(this);
    this.onSelectedCityChange = this.onSelectedCityChange.bind(this);
  }

  componentDidMount() {
    this.googleClient = new GoogleClient(this.hiddenMapInputField);
    this.tryToSetStateToInitialValue();
  }

  tryToSetStateToInitialValue() {
    if (this.props.initialCityValue) {
      this.setState({
        selectedOption: {
          label: this.props.initialCityValue
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    this.clearStateIfCountryHasChanged(prevProps);
  }

  clearStateIfCountryHasChanged(prevProps) {
    if (prevProps.countryCode) {
      if (this.props.countryCode !== prevProps.countryCode) {
        this.setState(
          {
            selectedOption: null,
            input: ""
          },
          () => {
            this.props.onClearCityField();
          }
        );
      }
    }
  }

  async loadOptions(input, callback) {
    if (!input) return;

    let predictedCities = await this.googleClient.fetchCitiesForInput(
      input,
      this.props.countryCode
    );

    let adaptedPredictedCities = this.adaptCitiesForReactSelect(
      predictedCities
    );
    callback(adaptedPredictedCities);
  }

  adaptCitiesForReactSelect(cities) {
    return (cities || []).map(city => ({
      value: city.place_id,
      label: city.description
    }));
  }

  onSelectedCityChange(selectedOption) {
    if (!selectedOption || !selectedOption.value) return;
    this.googleClient
      .getCityAndStateOfPlaceWithId(selectedOption.value)
      .then(label => {
        this.setState({ selectedOption: { ...selectedOption, label } });
        this.props.onCityChange(label);
      });
  }

  render() {
    return (
      <React.Fragment>
        <AsyncSelect
          value={this.state.selectedOption}
          styles={customStyles}
          loadOptions={this.loadOptions}
          onChange={this.onSelectedCityChange}
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
