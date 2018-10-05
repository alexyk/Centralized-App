import React from 'react';
import PropTypes from 'prop-types';
import RoomSpaceInformationBox from '../common/RoomSpaceInformationBox';

import '../../../styles/css/components/homes/booking/homes-booking-room-details-info.css';
import RoomAccommodationBox from '../common/RoomAccommodationBox';

function HomesBookingRoomDetailsInfo(props) {

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
        icon = <img src="/images/icon-review/icon-kingbed.jpg" alt="icon-kingbed" title="King Bed" />;
        break;
      default:
        icon = <img src="" alt="" title="" />;
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

  const { roomDetails, checkInStart, checkInEnd, checkOutStart, checkOutEnd } = props;
  const { property_type, guests, size, bathroom, bedrooms, rooms } = roomDetails;
  const { eventsAllowed, smokingAllowed, suitableForPets, suitableForInfants, house_rules } = roomDetails;
  const houseRules = house_rules && house_rules.split('\r\n');

  const hasSpaceDetails = property_type || guests || size || bathroom || bedrooms;
  const hasHouseRules = eventsAllowed || smokingAllowed || suitableForPets || suitableForInfants || house_rules;

  return (
    <div className="right-part">
      <h2>Review Room Details</h2>
      {hasSpaceDetails &&
        <div>
          <h3>The Space</h3>
          <RoomSpaceInformationBox
            property_type={property_type}
            guests={guests}
            size={size}
            bathroom={bathroom}
            bedrooms={bedrooms} />

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

      {hasHouseRules &&
        <div className="hotel-rules-container">
          <h3>House Rules</h3>
          {eventsAllowed && <p>Events allowed</p>}
          {smokingAllowed && <p>Smoking allowed</p>}
          {suitableForInfants && <p>Suitable for infants</p>}
          {suitableForPets && <p>Suitable for pets</p>}
          {houseRules && houseRules.map((rule, index) => {
            return (<p key={index}>{rule}</p>);
          })}
        </div>
      }

      <RoomAccommodationBox
        checkInStart={checkInStart}
        checkInEnd={checkInEnd}
        checkOutStart={checkOutStart}
        checkOutEnd={checkOutEnd} />

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