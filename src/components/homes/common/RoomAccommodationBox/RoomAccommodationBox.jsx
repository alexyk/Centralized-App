import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

function RoomAccommodationBox({ checkInStart, checkInEnd, checkOutStart, checkOutEnd }) {
  (function setCheckInOutHours(checkInStart, checkInEnd, checkOutStart, checkOutEnd) {
    const checkInBeforeStartWidth = ((100 / 24) * (checkInStart));
    const checkInAfterEndWidth = ((100 / 24) * (24 - checkInEnd));
    const checkInLength = ((100 / 24) * (checkInEnd - checkInStart));
    const checkOutBeforeStartWidth = ((100 / 24) * (checkOutStart));
    const checkOutAfterEndWidth = ((100 / 24) * (24 - checkOutEnd));
    const checkOutLength = (100 / 24) * (checkOutEnd - checkOutStart);
  
    setTimeout(() => {
      document.getElementById('check_in_hour').style.width = `calc(${checkInBeforeStartWidth}% + 40px)`;
      document.getElementById('check_out_hour').style.width = `calc(${checkOutBeforeStartWidth + checkOutLength}% + 20px)`;
  
      document.getElementById('check_in_line_1').style.width = `${checkInBeforeStartWidth}%`;
      document.getElementById('check_in_line_2').style.width = `${checkInLength}%`;
      document.getElementById('check_in_line_3').style.width = `${checkInAfterEndWidth}%`;
      document.getElementById('check_out_line_1').style.width = `${checkOutBeforeStartWidth}%`;
      document.getElementById('check_out_line_2').style.width = `${checkOutLength}%`;
      document.getElementById('check_out_line_3').style.width = `${checkOutAfterEndWidth}%`;
  
      document.getElementById('check_in_tooltip').style.marginLeft = `calc(${checkInBeforeStartWidth}% - 95px)`;
      document.getElementById('check_out_tooltip').style.marginLeft = `calc(${checkOutBeforeStartWidth + checkOutLength}% - 95px)`;
    }, 100);
  })(checkInStart, checkInEnd, checkOutStart, checkOutEnd);

  return (
    <div className="accommodation-container">
      <h3>Accommodation</h3>
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
  );
}


RoomAccommodationBox.propTypes = {
  checkInStart: PropTypes.any,
  checkInEnd: PropTypes.any,
  checkOutStart: PropTypes.any,
  checkOutEnd: PropTypes.any,
};

export default RoomAccommodationBox;