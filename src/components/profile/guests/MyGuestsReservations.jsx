import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';

function MyGuestsReservations(props) {
  const extractDatesData = (reservation) => {
    const startDateMoment = moment(reservation.startDate, 'DD/MM/YYYY');
    const endDateMoment = moment(reservation.endDate, 'DD/MM/YYYY');

    const checkIn = {
      day: startDateMoment.format('D'),
      year: startDateMoment.format('YYYY'),
      month: startDateMoment.format('MMM')
    };

    const checkOut = {
      day: endDateMoment.format('D'),
      year: endDateMoment.format('YYYY'),
      month: endDateMoment.format('MMM')
    };

    return { checkIn, checkOut };
  };

  const getCurrencySign = (currency) => {
    let currencySign = '$';
    if (currency === 'GBP') currencySign = '£';
    if (currency === 'EUR') currencySign = '€';
    return currencySign;
  };

  const dates = extractDatesData(props.reservation);
  const { id, userImage, guestName, guestEmail, guestPhone, guestLocAddress, listingName, currencyCode, price, accepted } = props.reservation;

  return (
    <ProfileFlexContainer styleClass={`flex-container-row ${props.styleClass}`}>
      <div className="tablet-col-1">
        <div className="flex-row-child guests-image">
          {userImage &&
            <img className="image-host" src={userImage} alt="host-profile" />
          }
        </div>
        <div className="flex-row-child guests-guest">
          <div className="content-row">
            <div className="host-name">{guestName}</div>
            <div className="email">{guestEmail}</div>
            <div className="phone-number">{guestPhone}</div>
            {guestLocAddress ? <div className="loc-address"><a href={`https://etherscan.io/address/${guestLocAddress}`} target="_blank" rel="noopener noreferrer">Loc Address</a></div> : ''}
            {guestEmail ? <div className="send-message"><span className="send-message-icon"></span><a href={`mailto:${guestEmail}`}>Send Message</a></div> : ''}
          </div>
        </div>
      </div>
      <div className="tablet-col-2">
        <div className="flex-row-child guests-date-location">
          <i className="fa fa-info-circle icon" />
          <div className="content-row">
            <div className="dates"><span className="date-in-day">{dates.checkIn.day}</span> {dates.checkIn.month}, {dates.checkIn.year} <i aria-hidden="true" className="fa fa-long-arrow-right" /> <span className="date-out-day">{dates.checkOut.day}</span> {dates.checkOut.month}, {dates.checkOut.year}</div>
            <div className="trips-location-link content-row">{listingName}</div>
          </div>
        </div>
        <div className="flex-row-child guests-price">
          <i className="fa fa-money icon"></i>
          <div className="content-row">
            <div>{getCurrencySign(currencyCode)} {price} total</div>
          </div>
        </div>
        <div className="flex-row-child guests-actions">
          <i className="fa fa-bolt icon" />
          <div className="content-row">
            {!accepted && <button onClick={() => { props.onReservationSelect(id); props.onReservationAccept(); }}>Accept Reservation</button>}
            {!accepted && <button onClick={() => { props.onReservationSelect(id); props.onReservationReject(); }}>Delete Reservation</button>}
            {accepted && <button onClick={() => { props.onReservationSelect(id); props.onReservationCancel(); }}>Cancel Reservation</button>}
          </div>
        </div>
        <div className="flex-row-child guests-status">
          {accepted ? 'Accepted' : 'Pending'}
        </div>
      </div>
    </ProfileFlexContainer >
  );
}

MyGuestsReservations.propTypes = {
  reservation: PropTypes.object,
  //   tomorrow: PropTypes.string, // format (DD/MM/YYYY)
  //   afterTomorrow: PropTypes.string, // format (DD/MM/YYYY)
  styleClass: PropTypes.string,
  //   handleCancelReservation: PropTypes.func,
  //   onTripSelect: PropTypes.func
  onReservationAccept: PropTypes.func,
  onReservationCancel: PropTypes.func,
  onReservationReject: PropTypes.func,
  onReservationSelect: PropTypes.func
};

export default MyGuestsReservations;
