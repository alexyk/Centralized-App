import React from 'react';
import PropTypes from 'prop-types';

import '../../../styles/css/components/homes/booking/homes-booking-room-details-info.css';

function HomesBookingRoomDetailsInfo(props) {

  const { listing, checkInStart, checkInEnd, checkOutStart, checkOutEnd } = props;

  return (
    <div className="right-part">
      <h2>Review Room Details</h2>
      <h3>The Space</h3>
      <div className="icons-container-space">
        <div>        <img src="/images/icon-review/icon-home.png" alt="icon-home" />
          <p>Entire Home/Apt</p></div>
        <div>
          <img src="/images/icon-review/icon-guest.png" alt="icon-guest" />
          <p>Guests x4</p></div>
        <div>
          <img src="/images/icon-review/icon-size.png" alt="icon-size" />
          <p>85 m2</p></div>
        <div>
          <img src="/images/icon-review/icon-bathroom.png" alt="icon-bathroom" />
          <p>1 Bathroom</p>
        </div>
        <div>
          <img src="/images/icon-review/icon-bedrooms.png" alt="icon-bedrooms" />
          <p>2 Bedrooms</p>
        </div>
      </div>
      <h3>Sleeping Arrangements</h3>
      <div className="arrangements-container">
        <div>
          <p><span>Bedroom 1 </span>One double bed</p>
          <img src="/images/icon-review/icon-bedroom.png" alt="icon-bedroom" />
        </div>
        <div>
          <p><span>Bedroom 2 </span>Two twin beds</p>
          <img src="/images/icon-review/icon-bed-room.png" alt="icon-bedroom" />
        </div>
        <div>
          <p><span>Living Room </span>One sofa bed</p>
          <img src="/images/icon-review/icon-sofa-bed.png" alt="icon-sofa-bed" />
        </div>
      </div>
      <div className="hotel-rules-container">
        <h3>Hotel Rules</h3>
        <p>No smoking</p>
        <p>Not suitable fot pets</p>
        <p>No parties or events</p>
        <div className="check-in">
          <p className="check-in-text">Check-in</p>
          <div className="check-in-line">
            <div id="check_in_hour">
              {checkInEnd === 24 ? `${checkInStart}:00 pm` : `${checkInStart}:00 - ${checkInEnd}:00 pm`}
            </div>
            <div className="lines">
              <div id="check_in_line_1" />
              <div id="check_in_line_2" />
              <div id="check_in_line_3" />
            </div>
            <div id="check_in_tooltip">
              <div className="tooltip-content">
                {checkInEnd === 24 ? `From ${checkInStart}:00 pm` : `Between ${checkInStart}:00 - ${checkInEnd}:00 pm`}
              </div>
            </div>
          </div>
        </div>
        <div className="check-out">
          <p className="check-out-text">Check-out</p>
          <div className="check-out-line">
            <div id="check_out_hour">
              {checkOutStart === 0 ? `${checkOutEnd}:00 pm` : `${checkOutStart}:00 - ${checkOutEnd}:00 pm`}
            </div>
            <div className="lines">
              <div id="check_out_line_1" />
              <div id="check_out_line_2" />
              <div id="check_out_line_3" />
            </div>
            <div id="check_out_tooltip">
              <div className="tooltip-content">
                {checkOutStart === 0 ? `Until ${checkOutEnd}:00 pm` : `Between ${checkOutStart}:00 - ${checkOutEnd}:00 pm`}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="children-and-extra-beds">
        <h3>Children & Extra Beds</h3>
        <p>All children are welcome.</p>
        <p>FREE! One child under 2 years stays free of charge in a crib.</p>
        <p>There is no capacity for extra beds in the room.</p>
      </div>
      <button className="btn" onClick={() => props.handleSubmit()}>Agree &amp; Continue</button>
    </div>
  );
}

HomesBookingRoomDetailsInfo.propTypes = {
  listing: PropTypes.object,
  checkInStart: PropTypes.number,
  checkInEnd: PropTypes.number,
  checkOutStart: PropTypes.number,
  checkOutEnd: PropTypes.number,
  handleSubmit: PropTypes.func,
};

export default HomesBookingRoomDetailsInfo;