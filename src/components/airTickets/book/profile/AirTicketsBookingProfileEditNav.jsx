import React, { Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../../../../styles/css/components/profile/me/profile-edit-nav.css';

function AirTicketsBookingProfileEditNav(props) {
  return (
    <Fragment>
      <div className="host-step"><NavLink exact activeClassName="active" to={{ pathname: `/tickets/results/initBook/${props.match.params.id}/profile`, search: props.location.search }}>Profile</NavLink></div>
      {(props.confirmInfo.services ?
          <div className="host-step"><NavLink exact activeClassName="active" to={{ pathname: `/tickets/results/initBook/${props.match.params.id}/profile/services`, search: props.location.search }}>Services</NavLink></div> :
          <div className="host-step"><div className="disable-link">Services</div></div>)
      }
      {props.confirmInfo.passengers ?
        <div className="host-step"><NavLink exact activeClassName="active" to={{ pathname: `/tickets/results/initBook/${props.match.params.id}/profile/passengers`, search: props.location.search }}>Passengers</NavLink></div> :
        <div className="host-step"><div className="disable-link">Passengers</div></div>
      }
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
