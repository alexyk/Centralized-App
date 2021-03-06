import { Modal } from "react-bootstrap";
import React from "react";
import { UPDATE_COUNTRY } from "../../../constants/modals.js";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCountries } from "../../../selectors/countriesInfo";
import { isActive } from "../../../selectors/modalsInfo";

function UpdateCountryModal(props) {
  const getShortName = (name, length) => {
    if (name.length <= length) {
      return name;
    }

    return `${name.substring(0, length)}...`;
  };

  const countryHasMandatoryState =
    props.country &&
    ["Canada", "India", "United States of America"].includes(
      props.country.name
    );

  return (
    <React.Fragment>
      <Modal
        show={props.isActiveModal[UPDATE_COUNTRY]}
        onHide={() => props.closeModal(UPDATE_COUNTRY)}
        className="modal fade myModal"
      >
        <Modal.Header>
          <h1>Where are you from?</h1>
          <button
            type="button"
            className="close"
            onClick={() => props.closeModal(UPDATE_COUNTRY)}
          >
            &times;
          </button>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={e => {
              e.preventDefault();
              props.handleUpdateCountry();
            }}
          >
            <label htmlFor="country">Where do you live</label>
            <div className="select">
              <select
                name="country"
                id="country"
                onChange={props.handleChangeCountry}
                value={JSON.stringify(props.country)}
                style={{ padding: "10px", maxWidth: "100%" }}
              >
                <option value="" selected>
                  Country
                </option>
                {props.countries &&
                  props.countries.map((item, i) => {
                    return (
                      <option
                        key={i}
                        value={JSON.stringify(item)}
                        style={{ minWidth: "100%", maxWidth: "0" }}
                      >
                        {getShortName(item.name, 30)}
                      </option>
                    );
                  })}
              </select>
            </div>

            {countryHasMandatoryState === true && (
              <div className="countryState">
                <div className="select">
                  <select
                    name="countryState"
                    id="countryState"
                    onChange={props.onChange}
                    value={props.countryState}
                    style={{ padding: "10px", maxWidth: "100%" }}
                  >
                    <option value="">State</option>
                    {props.states &&
                      props.states.map((item, i) => {
                        return (
                          <option
                            key={i}
                            value={item.id}
                            style={{ minWidth: "100%", maxWidth: "0" }}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
            )}

            <button type="submit" className="button" disabled={props.isLogging}>
              {props.isLogging ? "Logging in..." : "Save"}
            </button>
            <div className="clearfix" />
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

UpdateCountryModal.propTypes = {
  country: PropTypes.object,
  states: PropTypes.array,
  countryState: PropTypes.string,
  onChange: PropTypes.func,
  closeModal: PropTypes.func,
  isActive: PropTypes.bool,
  handleChangeCountry: PropTypes.func,
  handleUpdateCountry: PropTypes.func,
  isLogging: PropTypes.bool,

  // Redux props
  isActiveModal: PropTypes.object,
  countries: PropTypes.array
};

const mapStateToProps = state => ({
  isActiveModal: isActive(state.modalsInfo),
  countries: getCountries(state.countriesInfo)
});

export default connect(mapStateToProps)(UpdateCountryModal);
