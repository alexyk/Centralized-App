import React from "react";
import * as R from "ramda";

import CityField from "./CityField";
import CountryField from "./CountryField";
import StreetField from "./StreetField";

export default class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      countryCode: ""
    };

    this.setCountryCodeToInitialValue = this.setCountryCodeToInitialValue.bind(
      this
    );
  }

  componentDidMount() {
    this.setCountryCodeToInitialValue();
  }

  setCountryCodeToInitialValue() {
    let cc = R.path(["props", "initialCountryValue", "countryCode"], this);
    if (cc) {
      this.setState({
        countryCode: cc
      });
    }
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
                this.props.onCountryChange({ countryCode, countryName });
              }}
              initialCountryValue={this.props.initialCountryValue}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City/State</label>
            <CityField
              countryCode={this.state.countryCode}
              onCityChange={this.props.onCityChange}
              initialCityValue={this.props.initialCityValue}
              onClearCityField={this.props.onClearCityField}
            />
          </div>
          <div className="form-group" data-testid={"street-address"}>
            <label htmlFor="street">Street address</label>
            <StreetField
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
