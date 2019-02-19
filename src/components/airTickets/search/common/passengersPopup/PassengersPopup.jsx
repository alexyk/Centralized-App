import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { setFlightClass, setAdults, setChildren } from '../../../../../actions/airTicketsSearchInfo';
import { selectFlightClass } from '../../../../../selectors/airTicketsSearchSelector';
import SelectFlex from '../../../../common/select';

import './style.css';

class PassengersPopup extends Component {
  constructor(props) {
    super(props);

    this.passengersTimeOut = null;

    this.state = {
      passengers: {
        adults: 1,
        children: []
      }
    };

    this.applyPassengersChoose = this.applyPassengersChoose.bind(this);
    this.increaseAdults = this.increaseAdults.bind(this);
    this.decreaseAdults = this.decreaseAdults.bind(this);
    this.increaseChildren = this.increaseChildren.bind(this);
    this.decreaseChildren = this.decreaseChildren.bind(this);
    this.populatePassengersPopup = this.populatePassengersPopup.bind(this);
  }

  componentDidMount() {
    this.populatePassengersPopup();
  }

  componentWillUnmount() {
    if (this.passengersTimeOut) {
      clearTimeout(this.passengersTimeOut);
    }
  }

  populatePassengersPopup() {
    const searchParams = queryString.parse(this.props.location.search);

    const adultsCount = searchParams.adults;
    let children = [];
    if (searchParams.children) {
      children = JSON.parse(searchParams.children);
    }
    this.passengersTimeOut = setTimeout(() => {
      const passengers = {
        adults: !adultsCount || adultsCount < 1 ? 1 : Number(adultsCount),
        children: children
      };
      this.setState({
        passengers
      });
    }, 100);
  }

  increaseAdults() {
    this.setState(prevState => ({
      passengers: {
        ...prevState.passengers,
        adults: prevState.passengers.adults + 1
      }
    }));
  }

  decreaseAdults() {
    this.setState(prevState => ({
      passengers: {
        ...prevState.passengers,
        adults: this.state.passengers.adults - 1 < 1 ? 1 : this.state.passengers.adults - 1
      }
    }));
  }

  increaseChildren() {
    this.setState(prevState => ({
      ...prevState,
      passengers: {
        ...prevState.passengers,
        children: [...prevState.passengers.children, { age: 0 }]
      }
    }));
  }

  decreaseChildren() {
    const children = [...this.state.passengers.children];
    children.splice(children.length - 1, 1);
    this.setState(prevState => ({
      ...prevState,
      passengers: {
        ...prevState.passengers,
        children
      }
    }));
  }

  increaseChildAge(childIndex) {
    const children = [...this.state.passengers.children];
    children[childIndex].age = children[childIndex].age + 1 > 12 ? 12 : children[childIndex].age + 1;
    this.setState(prevState => ({
      ...prevState,
      passengers: {
        ...prevState.passengers,
        children
      }
    }));
  }

  decreaseChildAge(childIndex) {
    const children = [...this.state.passengers.children];
    children[childIndex].age = children[childIndex].age - 1 < 0 ? 0 : children[childIndex].age - 1;
    this.setState(prevState => ({
      ...prevState,
      passengers: {
        ...prevState.passengers,
        children
      }
    }));
  }

  applyPassengersChoose() {
    const { passengers } = this.state;

    this.props.dispatch(setAdults(passengers.adults.toString()));
    this.props.dispatch(setChildren(passengers.children));

    this.props.closePassengersPopup();
  }

  render() {
    const { showPassengersPopup, flightClass } = this.props;
    const { passengers } = this.state;

    if (!showPassengersPopup) {
      return null;
    }

    return (
      <div className="passengers-popup">
        <SelectFlex placeholder="Flight class" className="air-tickets-form-flight-class" onChange={(value) => this.props.dispatch(setFlightClass(value))} value={flightClass}>
          <select name="flightClass">
            <option value="0">Any class</option>
            <option value="E">Economy class</option>
            <option value="P">Premium Economy class</option>
            <option value="B">Business class</option>
            <option value="F">First class</option>
          </select>
        </SelectFlex>
        <div className="passengers-popup-item">
          <div className="passengers-popup-item-title">Adults (12+ years)</div>
          <div className="passengers-popup-item-controls">
            <div className="minus" onClick={this.decreaseAdults}>-</div>
            <div className="count">{passengers.adults}</div>
            <div className="plus" onClick={this.increaseAdults}>+</div>
          </div>
        </div>
        <div className="passengers-popup-item">
          <div className="passengers-popup-item-title">Children (0-12 years)</div>
          <div className="passengers-popup-item-controls">
            <div className="minus" onClick={this.decreaseChildren}>-</div>
            <div className="count">{passengers.children.length}</div>
            <div className="plus" onClick={this.increaseChildren}>+</div>
          </div>
        </div>
        {passengers.children.length > 0 &&
          <Fragment>
            <hr />
            {passengers.children.map((child, childIndex) => {
              return (
                <div key={childIndex} className="passengers-popup-item">
                  <div className="passengers-popup-item-title">Age at Departure date (0-12)</div>
                  <div className="passengers-popup-item-controls">
                    <div className="minus" onClick={() => this.decreaseChildAge(childIndex)}>-</div>
                    <div className="count">{child.age}</div>
                    <div className="plus" onClick={() => this.increaseChildAge(childIndex)}>+</div>
                  </div>
                </div>
              );
            })}
          </Fragment>}
        <div class="travel-info-wrapper">
          <p>Your age at time of travel must be valid for the age category booked. Airlines have restrictions on under 18s travelling alone.</p>
          <p>Age limits and policies for travelling with children may vary so please check with the airline before booking.</p>
        </div>
        <div className="button-holder">
          <div className="passengers-apply-button" onClick={this.applyPassengersChoose}>Apply</div>
        </div>
      </div>
    );
  }
}

PassengersPopup.propTypes = {
  showPassengersPopup: PropTypes.bool,
  closePassengersPopup: PropTypes.func,

  // Router props
  location: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  flightClass: PropTypes.string
};

function mapStateToProps(state) {
  const { airTicketsSearchInfo } = state;

  return {
    flightClass: selectFlightClass(airTicketsSearchInfo)
  }
}

export default withRouter(connect(mapStateToProps)(PassengersPopup));
