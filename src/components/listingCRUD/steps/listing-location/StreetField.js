import React from "react";
import LocationPicker from "react-location-picker";

export interface StreetGoogleClient {
  getLocationOfAddress(
    address: string,
    countryCode?: string
  ): undefined | { lat: number, lng: number };

  getLocationForStreetPlaceId(
    placeId: string
  ): undefined | { lat: number, lng: number };
}

class GoogleClient implements StreetGoogleClient {
  constructor(field) {
    this.placesService = new window.google.maps.places.PlacesService(field);
    this.autocompleteService = new window.google.maps.places.AutocompleteService();
  }

  async getLocationOfAddress(address, countryCode) {
    var predictions = await this.fetchPredictionsForAddress(
      address,
      countryCode
    );
    let idOfFirstStreet = GoogleClient.getPlaceIdOfFirstStreetPrediction(
      predictions
    );
    if (idOfFirstStreet) {
      let locationOfStreet = await this.getLocationForStreetPlaceId(
        idOfFirstStreet,
        countryCode
      );
      return locationOfStreet;
    }
    return undefined;
  }

  fetchPredictionsForAddress(address, countryCode) {
    return new Promise(resolve => {
      this.autocompleteService.getPlacePredictions(
        {
          input: address,
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

  static getPlaceIdOfFirstStreetPrediction(predictions) {
    let firstStreet = (predictions || []).find(
      p => p.types.includes("street_address") || p.types.includes("route")
    );
    if (firstStreet) {
      return firstStreet.place_id;
    }
    return undefined;
  }
}

type Props = {
  initialStreetValue?: string,
  onStreetChange: Function,
  onClearStreetField: Function
};

type State = {
  mapLocation: null | {
    lat: number,
    lng: number
  },
  inputValue: string
};

export default class StreetField extends React.Component<Props, State> {
  googleClient: StreetGoogleClient;

  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      mapLocation: null
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.updateMapBasedOnInputValue = this.updateMapBasedOnInputValue.bind(
      this
    );
    this.tryToSetInitialInputValue = this.tryToSetInitialInputValue.bind(this);
    this.clearStateIfCountryHasChanged = this.clearStateIfCountryHasChanged.bind(
      this
    );

    this.getLocationForStreetPlaceId = this.getLocationForStreetPlaceId.bind(
      this
    );
  }

  componentDidMount() {
    this.googleClient = new GoogleClient(this.mapInputField);
    this.tryToSetInitialInputValue();
  }

  componentDidUpdate(prevProps) {
    this.clearStateIfCountryHasChanged(prevProps);
  }

  tryToSetInitialInputValue() {
    if (this.props.initialStreetValue) {
      this.setState(
        {
          inputValue: this.props.initialStreetValue
        },
        () => {
          this.updateMapBasedOnInputValue(this.state.inputValue);
        }
      );
    }
  }

  clearStateIfCountryHasChanged(prevProps) {
    if (prevProps.countryCode) {
      if (this.props.countryCode !== prevProps.countryCode) {
        this.setState(
          {
            mapLocation: null,
            inputValue: ""
          },
          () => {
            this.props.onClearStreetField();
          }
        );
      }
    }
  }

  onInputChange(e) {
    this.setState({ inputValue: e.target.value }, async () => {
      this.updateMapBasedOnInputValue(this.state.inputValue);
      this.props.onStreetChange(this.state.inputValue);
    });
  }

  async updateMapBasedOnInputValue() {
    let locationOfStreet = await this.googleClient.getLocationOfAddress(
      this.state.inputValue,
      this.props.countryCode
    );
    this.setState({
      mapLocation: locationOfStreet || null
    });
  }

  getLocationForStreetPlaceId(placeId) {
    return this.googleClient.getLocationForStreetPlaceId(
      placeId,
      this.props.countryCode
    );
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
          value={this.state.inputValue}
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
