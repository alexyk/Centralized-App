import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

function RoomAccommodationBox(props) {
    const { checkInStart, checkInEnd, checkOutStart, checkOutEnd} = props;
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