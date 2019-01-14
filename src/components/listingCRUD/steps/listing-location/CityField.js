import React from "react";
import AsyncSelect from "react-select/lib/Async";
import customStyles from "./react-select-styles";

export default class CityField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      input: ""
    };

    this.adaptCitiesForReactSelect = this.adaptCitiesForReactSelect.bind(this);
    this.filterCountries = this.filterCountries.bind(this);
    this.tryToSetStateToInitialValue = this.tryToSetStateToInitialValue.bind(
      this
    );
    this.clearStateIfCountryHasChanged = this.clearStateIfCountryHasChanged.bind(
      this
    );
    this.loadOptions = this.loadOptions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getDetails = this.getDetails.bind(this);
  }

  componentDidMount() {
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
    this.placesService = new window.google.maps.places.PlacesService(
      this.hiddenMapInputField
    );

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
