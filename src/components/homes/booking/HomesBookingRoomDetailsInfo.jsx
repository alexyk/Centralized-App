import React from 'react';
import PropTypes from 'prop-types';

import '../../../styles/css/components/homes/booking/homes-booking-room-details-info.css';

function HomesBookingRoomDetailsInfo(props) {

  const { listing, roomDetails, checkInStart, checkInEnd, checkOutStart, checkOutEnd } = props;
  const { property_type, guests, size, bathroom, bedrooms, rooms } = roomDetails;
  const { eventsAllowed, smokingAllowed, suitableForPets, suitableForInfants, house_rules } = roomDetails;
  const houseRules = house_rules.split('\r\n');

  const hasSpaceDetails = property_type || guests || size || bathroom || bedrooms;

  const renderBedIcons = (bedCount, bedType) => {
    const bedIcons = [];
    let icon = null;
    switch (bedType) {
      case 'single':
        icon = <img src="/images/icon-review/icon-bedroom.png" alt="icon-bedroom" title="Single Bed" />;
        break;
      case 'double':
        icon = <img src="/images/icon-review/icon-bed-room.png" alt="icon-bedroom" title="Double Bed" />;
        break;
      case 'king':
        icon = <img src="/images/icon-review/icon-bed-room.png" alt="icon-bedroom" title="King Bed" />;
        break;
    }

    for (let i = 0; i < bedCount; i++) {
      bedIcons.push(icon);
    }

    return bedIcons;
  };

  const hasSleepingArangementDetails = (rooms) => {
    if (rooms && rooms.length > 0) {
      for (let i = 0; i < rooms.length; i++) {
        const { single_bed_count, double_bed_count, king_bed_count } = rooms[i];
        if (single_bed_count || double_bed_count || king_bed_count) {
          return true;
        }
      }
    }

    return false;
  };

  console.log(checkInStart);

  return (
    <div className="right-part">
      <h2>Review Room Details</h2>
      {hasSpaceDetails &&
        <div>
          <h3>The Space</h3>
          <div className="icons-container-space">
            {property_type &&
              <div>
                <img src="/images/icon-review/icon-home.png" alt="icon-home" />
                <p>{property_type}</p>
              </div>
            }

            {guests &&
              <div>
                <img src="/images/icon-review/icon-guest.png" alt="icon-guest" />
                <p>Guests x{guests}</p>
              </div>
            }

            {size &&
              <div>
                <img src="/images/icon-review/icon-size.png" alt="icon-size" />
                <p>{size} m2</p>
              </div>
            }

            {bathroom &&
              <div>
                <img src="/images/icon-review/icon-bathroom.png" alt="icon-bathroom" />
                <p>{bathroom} {bathroom === 1 ? 'Bathroom' : 'Bathrooms'}</p>
              </div>
            }

            {bedrooms &&
              <div>
                <img src="/images/icon-review/icon-bedrooms.png" alt="icon-bedrooms" />
                <p>{bedrooms} {bathroom === 1 ? 'Bedrooms' : 'Bedrooms'}</p>
              </div>
            }
          </div>
        </div>
      }

      {hasSleepingArangementDetails() &&
        <div>
          <h3>Sleeping Arrangements</h3>
          <div className="arrangements-container">
            {rooms.map((room, index) => {
              const { single_bed_count, double_bed_count, king_bed_count } = room;
              const hasBedInfo = single_bed_count || double_bed_count || king_bed_count;
              if (hasBedInfo) {
                return (
                  <div key={index + 1}>
                    <p><span>Bedroom {index + 1} </span></p>
                    {single_bed_count && renderBedIcons(single_bed_count, 'single')}
                    {double_bed_count && renderBedIcons(single_bed_count, 'double')}
                    {king_bed_count && renderBedIcons(single_bed_count, 'king')}
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      }

      <div className="hotel-rules-container">
        <h3>House Rules</h3>
        {eventsAllowed && <p>Events allowed</p>}
        {smokingAllowed && <p>Smoking allowed</p>}
        {suitableForInfants && <p>Suitable for infants</p>}
        {suitableForPets && <p>Suitable for pets</p>}
        {houseRules && houseRules.map((rule, index) => {
          return (<p key={index}>{rule}</p>);
        })}

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
      {/* <div className="children-and-extra-beds">
        <h3>Children & Extra Beds</h3>
        <p>All children are welcome.</p>
        <p>FREE! One child under 2 years stays free of charge in a crib.</p>
        <p>There is no capacity for extra beds in the room.</p>
      </div> */}
      <button className="btn" onClick={() => props.handleSubmit()}>Agree &amp; Continue</button>
    </div>
  );
}

HomesBookingRoomDetailsInfo.propTypes = {
  listing: PropTypes.object,
  roomDetails: PropTypes.object,
  checkInStart: PropTypes.number,
  checkInEnd: PropTypes.number,
  checkOutStart: PropTypes.number,
  checkOutEnd: PropTypes.number,
  handleSubmit: PropTypes.func,
};

export default HomesBookingRoomDetailsInfo;