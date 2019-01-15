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
import * as R from "ramda";
import Form from "./Form";

export class ListingLocation extends React.Component {
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

    const FormComponent = this.props.Form || Form;
    const Aside = this.props.BasicAside || BasicsAside;
    const Footer = this.props.FooterNav || FooterNav;
    return (
      <div id="create-listing-location">
        <ListingCrudNav progress="33%" />
        <div className="container">
          <div className="listings create">
            <Aside routes={this.props.routes} />
            <div id="reservation-hotel-review-room">
              <div className="form-group">
                <h2>Where&rsquo;s your place located?</h2>
                <hr />
                <FormComponent
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
        <Footer
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
