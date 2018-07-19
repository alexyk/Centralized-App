import React from 'react';
import PropTypes from 'prop-types';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import { Config } from '../../../config';
import HotelIcon from '../../../styles/images/icon-hotel.png';

function DashboardRow(props) {
  return (
    <ProfileFlexContainer key={props.trip.id} styleClass={`flex-container-row ${props.styleClass}`}>
      <div className="flex-row-child dashboard-image-width">
        <img className="dashboard-image-host" src={`${Config.getValue('imgHost')}${props.trip.userImage}`} alt="user-profile" />
      </div>
      <div className="flex-row-child dashboard-host-width">
        <img className="icon-hotel" src={HotelIcon} alt="hotel" />
        <div className="hotel-name">{props.trip.hostName}
          {props.trip.listingName}</div>
      </div>
      <div className="flex-row-child dashboard-dates-width">
        <span className="icon-calendar" />
        {props.trip.displayStartDate} <i aria-hidden="true" className="fa fa-long-arrow-right"></i> {props.trip.displayEndDate}
      </div>
      <div className="flex-row-child dashboard-status-width">
        {
          props.capitalize(props.trip.status != null && props.trip.status.length > 0 ? props.trip.status : 'PENDING')
        }
        <span>&nbsp;</span>
        {props.trip.status && props.trip.status.toUpperCase() === 'FAILED' &&
          <span className="icon-question" title={props.trip.error ? props.trip.error : 'Transaction failed.'}></span>
        }
        {props.trip.status && props.trip.status.toUpperCase() === 'DONE' &&
          <div>Reference No.: {props.trip.booking_id}</div>
        }
      </div>
    </ProfileFlexContainer>
  );
}

DashboardRow.propTypes = {
  trip: PropTypes.object,
  capitalize: PropTypes.func,
  styleClass: PropTypes.string
};

export default DashboardRow;