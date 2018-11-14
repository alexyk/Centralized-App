import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import '../../../../styles/css/components/airTickets/initBook/book/air-tickets-booking-profile-services-form.css';

class AirTicketsBookingProfilePassengersForm extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.name, e.target.value);
  }

  render() {
    return (
      <div className="air-tickets-passengers-form">
        <h2>Passengers</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); this.props.initBooking(); }}>
          
          <div className="buttons-wrapper">
            <button type="submit" className="btn">Proceed</button>
          </div>
        </form>
      </div>
    );
  }
}

AirTicketsBookingProfilePassengersForm.propTypes = {
  passengersInfo: PropTypes.object,
  countries: PropTypes.array,
  onChange: PropTypes.func,
  initBooking: PropTypes.func
};

export default AirTicketsBookingProfilePassengersForm;
