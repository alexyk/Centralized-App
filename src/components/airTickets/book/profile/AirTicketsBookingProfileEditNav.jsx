import React, { Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../../../../styles/css/components/profile/me/profile-edit-nav.css';

function AirTicketsBookingProfileEditNav(props) {
  return (
    <Fragment>
      <div className="host-step"><NavLink exact activeClassName="active" to={{ pathname: `/tickets/results/initBook/${props.match.params.id}/profile`, search: props.location.search }}>Edit Billing Details</NavLink></div>
      {props.hasFlightServices ?
      <div className="host-step"><NavLink exact activeClassName="active" to={{ pathname: `/tickets/results/initBook/${props.match.params.id}/profile/services`, search: props.location.search }}>Review Paid Services</NavLink></div> : ''}
      <div className="host-step"><NavLink exact activeClassName="active" to={{ pathname: `/tickets/results/initBook/${props.match.params.id}/profile/passengers`, search: props.location.search }}>Review Passenger Details</NavLink></div>
      <div className="host-step hide"><NavLink exact activeClassName="active" to={{ pathname: `/tickets/results/initBook/${props.match.params.id}/profile/pay`}}>Payment</NavLink></div>
    </Fragment>
  );
}

AirTicketsBookingProfileEditNav.propTypes = {
  confirmInfo: PropTypes.object,
  hasFlightServices: PropTypes.bool,

  // Router props
  match: PropTypes.object,
  location: PropTypes.object
};

export default withRouter(AirTicketsBookingProfileEditNav);
