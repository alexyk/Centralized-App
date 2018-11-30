import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAdults, setChildren } from '../../../../../actions/airTicketsSearchInfo';

import './style.css';

class PassengersPopup extends Component {
  constructor(props) {
    super(props);

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

    this.setState({
      showPassengersPopup: false
    });

    this.props.dispatch(setAdults(passengers.adults));
    this.props.dispatch(setChildren(passengers.children));
  }

  render() {
    const { showPassengersPopup } = this.props;
    const { passengers } = this.state;

    if (!showPassengersPopup) {
      return null;
    }

    return (
      <div className="passengers-popup">
        <div className="passengers-popup-item">
          <div className="passengers-popup-item-title">Adults</div>
          <div className="passengers-popup-item-controls">
            <div className="minus" onClick={this.decreaseAdults}>-</div>
            <div className="count">{passengers.adults}</div>
            <div className="plus" onClick={this.increaseAdults}>+</div>
          </div>
        </div>
        <div className="passengers-popup-item">
          <div className="passengers-popup-item-title">Children</div>
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
        <div className="button-holder">
          <div className="passengers-apply-button" onClick={this.applyPassengersChoose}>Apply</div>
        </div>
      </div>
    );
  }
}

PassengersPopup.propTypes = {
  showPassengersPopup: PropTypes.bool,

  // Redux props
  dispatch: PropTypes.func
};

export default connect()(PassengersPopup);