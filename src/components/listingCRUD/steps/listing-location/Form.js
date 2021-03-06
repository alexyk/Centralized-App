import React from "react";
import * as R from "ramda";

import CityField from "./city-field/CityField";
import CountryField from "./country-field/CountryField";
import StreetField from "./street-field/StreetField";

type Props = {
  initialCountryValue: {
    countryCode: string,
    countryName: string
  },
  onCountryChange: ({ countryCode: string, countryName: string }) => void,

  onCityChange: (city: string) => void,
  initialCityValue?: string,
  onClearCityField: () => void,

  onStreetChange: Function,
  initialStreetValue?: string,
  onClearStreetField: Function
};
type State = {
  countryCode: string
};

export default class Form extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      countryCode: "",
      initialMount: true
    };
  }

  static getDerivedStateFromProps(props, state) {
    const initialCountryCode = R.path(
      ["initialCountryValue", "countryCode"],
      props
    );
    if (state.initialMount && initialCountryCode) {
      return { countryCode: initialCountryCode, initialMount: false };
    }
    return state;
  }

  render() {
    const Country = this.props.CountryField || CountryField;
    const City = this.props.CityField || CityField;
    const Street = this.props.StreetField || StreetField;

    return (
      <React.Fragment>
        <div className="col-md-12">
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <Country
              onCountrySelected={({ countryCode, countryName }) => {
                this.setState({ countryCode });
                this.props.onCountryChange({ countryCode, countryName });
              }}
              initialCountryValue={this.props.initialCountryValue}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City/State</label>
            <City
              countryCode={this.state.countryCode}
              onCityChange={this.props.onCityChange}
              initialCityValue={this.props.initialCityValue}
              onClearCityField={this.props.onClearCityField}
            />
          </div>
          <div className="form-group" data-testid={"street-address"}>
            <label htmlFor="street">Street address</label>
            <Street
              countryCode={this.state.countryCode}
              onStreetChange={this.props.onStreetChange}
              initialStreetValue={this.props.initialStreetValue}
              onClearStreetField={this.props.onClearStreetField}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
