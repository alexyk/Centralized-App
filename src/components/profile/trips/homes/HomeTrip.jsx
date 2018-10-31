import '../../../../styles/css/components/profile/trips/hotel-trips-table.css';

import { Config } from '../../../../config';
import HotelIcon from '../../../../styles/images/icon-hotel.png';
import { Link } from 'react-router-dom';
import ProfileFlexContainer from '../../flexContainer/ProfileFlexContainer';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const STATUS_TOOLTIP = {
  'ACCEPTED': 'Your reservation is accepted',
  'PENDING': 'Contact us if status is still Pending after 30 minutes'
};

function HomeTrip(props) {
  const extractDatesData = (trip) => {
    const startDateMoment = moment(trip.startDate, 'DD/MM/YYYY').utc();
    const endDateMoment = moment(trip.endDate, 'DD/MM/YYYY').utc();

    const checkIn = {
      day: startDateMoment.format('D'),
      year: startDateMoment.format('YYYY'),
      month: startDateMoment.format('MMM').toLowerCase()
    };

    const checkOut = {
      day: endDateMoment.format('D'),
      year: endDateMoment.format('YYYY'),
      month: endDateMoment.format('MMM').toLowerCase()
    };

    return { checkIn, checkOut };
  };

  const getHostName = (name) => {
    if (name.length <= 50) {
      return name;
    }
    return `${name.substring(0, 50)}...`;
  };

  const { id, userImage, hostName, hostPhone, accepted, booking_id, listingId, listingName, hostLocAddress, locPrice } = props.trip;

  const tripStatus = accepted ? 'ACCEPTED' : 'PENDING';
  const statusMessage = STATUS_TOOLTIP[tripStatus];

  const dates = extractDatesData(props.trip);

  return (
    <React.Fragment>
      <ProfileFlexContainer styleClass={`flex-container-row ${props.styleClass}`}>
        <div className="tablet-col-1">
          <div className="flex-row-child trips-image">
            {userImage &&
              <img className="image-host" src={`${Config.getValue('imgHost')}${userImage}`} alt="user" />
            }
          </div>
          <div className="flex-row-child trips-host">
            <img className="icon" src={HotelIcon} alt="hotel" />
            <div className="content-row">
              <div className="hostName">{getHostName(hostName)}</div>
              <div className="phoneNumber">{hostPhone}</div>
            </div>
          </div>
        </div>
        <div className="tablet-col-2">
          <div className="flex-row-child trips-location">
            <i className="fa fa-info-circle icon" />
            <Link className="trips-location-link content-row" to={`/homes/listings/${listingId}`}><u>{listingName}</u></Link>
          </div>
          <div className="flex-row-child trips-dates">
            <span className="icon-calendar icon" />
            <div className="content-row">
              <span className="date-in-day">{dates.checkIn.day}</span> {dates.checkIn.month}, {dates.checkIn.year} <i aria-hidden="true" className="fa fa-long-arrow-right" /> <span className="date-out-day">{dates.checkOut.day}</span> {dates.checkOut.month}, {dates.checkOut.year}
            </div>
          </div>
          <div className="flex-row-child trips-actions">
            <div className="content-row">
              {!accepted &&
                <button type="submit" onClick={e => { e.preventDefault(); props.onTripSelect(id); props.handleCancelReservation(); }}>Cancel Trip</button>
              }
            </div>
          </div>
          <div className="flex-row-child trips-status">
            <span className="status">{tripStatus}</span>
            <span className="icon-question" tooltip={statusMessage}></span>
            {tripStatus === 'ACCEPTED' && booking_id &&
              <div>Reference No.: {booking_id}</div>
            }
          </div>
        </div>
      </ProfileFlexContainer>
      {hostLocAddress && !accepted &&
        <div className="reservation-box-pending">
          <div>
            Please pay {locPrice} LOC to <a href={`https://etherscan.io/address/${hostLocAddress}`} target="_blank">{hostLocAddress.substr(0, 7)}</a>
            <CopyToClipboard text={hostLocAddress}>
              <button><i className="fa fa-link" aria-hidden="true" title="Copy LOC Address"></i></button>
            </CopyToClipboard>
            Click <a href="https://medium.com/@LockChainCo/how-to-create-a-personal-wallet-with-myetherwallet-com-and-buy-loc-with-eth-for-beginners-c395fd303d1" rel="noopener noreferrer" target="_blank">here</a> for more instructions.
          </div>
        </div>
      }
    </React.Fragment>
  );
}

HomeTrip.propTypes = {
  trip: PropTypes.object,
  tomorrow: PropTypes.string,
  styleClass: PropTypes.string,
  handleCancelReservation: PropTypes.func,
  onTripSelect: PropTypes.func
};

export default HomeTrip;
