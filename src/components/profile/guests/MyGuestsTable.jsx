import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import moment from 'moment';
import { Config } from '../../../config';
import NoEntriesMessage from '../common/NoEntriesMessage';
import MyGuestsReservations from './MyGuestsReservations';

function MyGuestsTable(props) {

  if (!props.reservations) {
    return;
  }

  if (props.reservations.length === 0) {
    return (
      <NoEntriesMessage text="There are no reservation requests. If someone requests to book your property, it will appear here." />
    );
  }

  return (
    <React.Fragment>
      <div className="table-header bold">
        <div className="col-md-1">
        </div>
        <div className="col-md-2">
          <span>Guests</span>
        </div>
        <div className="col-md-3">
          <span>Dates &amp; Location</span>
        </div>
        <div className="col-md-2">
          <span>Price</span>
        </div>
        <div className="col-md-2">
          <span>Actions</span>
        </div>
        <div className="col-md-2">
          <span>Status</span>
        </div>
      </div>
      {props.reservations.map(reservation => {
        return (
          <Fragment key={reservation.id}>
            <div className="row reservation-box">
              <div className="col-md-12">
                <div className="col-md-1">
                  <div className="reservation-image-box">
                    <span className="session-nav-user-thumb"><img src={`${Config.getValue('imgHost')}${reservation.userImage}`} alt="user-profile" /></span>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="bold">{reservation.guestName}</div>
                  <div>{reservation.guestEmail}</div>
                  <div>{reservation.guestPhone}</div>
                  {reservation.guestLocAddress ? <div><a href={`https://etherscan.io/address/${reservation.guestLocAddress}`} target="_blank">Loc Address</a></div> : ''}
                  {reservation.guestEmail ? <div><span className="send-message-icon"></span><a href={`mailto:${reservation.guestEmail}`}>Send Message</a></div> : ''}
                </div>
                <div className="col-md-3">
                  <div>{moment(new Date(reservation.startDate)).format('DD MMM, YYYY')}<i aria-hidden="true" className="fa fa-long-arrow-right"></i>{moment(new Date(reservation.endDate)).format('DD MMM, YYYY')}</div>
                  <div>{reservation.listingName}</div>
                </div>
                <div className="col-md-2">
                  <div>{reservation.currencyCode} {reservation.price} total</div>
                </div>
                <div className="col-md-2">
                  {!reservation.accepted && <div><button onClick={() => { props.onReservationSelect(reservation.id); props.onReservationAccept(); }}>Accept Reservation</button></div>}
                  {!reservation.accepted && <div><button onClick={() => { props.onReservationSelect(reservation.id); props.onReservationReject(); }}>Delete Reservation</button></div>}
                  {reservation.accepted && <div><button onClick={() => { props.onReservationSelect(reservation.id); props.onReservationCancel(); }}>Cancel Reservation</button></div>}
                </div>
                <div className="col-md-2">
                  <div className="reservation-status bold">{reservation.accepted ? 'Accepted' : 'Pending'}</div>
                </div>
              </div>
            </div>
            {/* <MyGuestsReservations
              reservation={reservation}
              styleClass="guests-flex-container"
              onReservationSelect={props.onReservationSelect}
              onReservationAccept={props.onReservationAccept}
              onReservationReject={props.onReservationReject}
              onReservationCancel={props.onReservationCancel}
            /> */}
          </Fragment>
        );
      })}
    </React.Fragment>
  );
}

MyGuestsTable.propTypes = {
  reservations: PropTypes.array,
  onReservationAccept: PropTypes.func,
  onReservationCancel: PropTypes.func,
  onReservationReject: PropTypes.func,
  onReservationSelect: PropTypes.func
};

export default MyGuestsTable;