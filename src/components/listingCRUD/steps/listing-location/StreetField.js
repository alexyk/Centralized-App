import React from "react";
import LocationPicker from "react-location-picker";

export default class StreetField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      mapLocation: null
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.updateMapData = this.updateMapData.bind(this);
    this.clearStateIfCountryHasChanged = this.clearStateIfCountryHasChanged.bind(
      this
    );
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

    if (this.props.initialStreetValue) {
      this.setState(
        {
          input: this.props.initialStreetValue
        },
        () => {
          this.updateMapData(this.state.input);
        }
      );
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
            mapLocation: null,
            input: ""
          },
          () => {
            this.props.onClearStreetField();
          }
        ); //
      }
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
