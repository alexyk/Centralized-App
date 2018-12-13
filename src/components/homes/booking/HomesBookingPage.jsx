import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import BookingSteps from '../../common/utility/BookingSteps';
import HomesBookingAside from './aside/HomesBookingAside';
import { parse } from 'query-string';
import PropTypes from 'prop-types';
import { calculateCheckInOuts } from '../common/detailsPageUtils.js';
import '../../../styles/css/components/homes/booking/homes-booking-page.css';
import '../../../styles/css/components/homes/booking/homes-booking-room-details-info.css';
import RoomAccommodationBox from '../common/RoomAccommodationBox';
import RoomSpaceInformationBox from '../common/RoomSpaceInformationBox';

function HomesBookingPage(props) {

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


  const handleSubmit = () => {
    const id = props.match.params.id;
    const rootURL = '/homes/listings';
    props.history.push(`${rootURL}/${id}/confirm${props.location.search}`);
  };

  const { listing, calendar, bookingDetails } = props;
  
  if (!listing || !calendar) {
    return <div className="loader"></div>;
  }
  
  const { property_type, guests, size, bathroom, bedrooms, rooms } = bookingDetails;
  const { eventsAllowed, smokingAllowed, suitableForPets, suitableForInfants, house_rules } = bookingDetails;
  const houseRules = house_rules && house_rules.split('\r\n');
  
  const hasSpaceDetails = property_type || guests || size || bathroom || bedrooms;
  const hasHouseRules = eventsAllowed || smokingAllowed || suitableForPets || suitableForInfants || house_rules;
  const checks = calculateCheckInOuts(listing);
  
  return (
    <Fragment>
      <BookingSteps steps={['Select your Room', 'Review Room Details', 'Confirm & Pay']} currentStepIndex={1} />
      <div id={`${props.location.pathname.indexOf('/confirm') !== -1 ? 'homes-booking-confirm-page-container' : 'homes-booking-page-container'}`}>
        <div className="container">
          <HomesBookingAside
            listing={listing}
            searchParams={parse(props.location.search)}
            calendar={calendar}
          />

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
              checkInStart={checks.checkInStart}
              checkInEnd={checks.checkInEnd}
              checkOutStart={checks.checkOutStart}
              checkOutEnd={checks.checkOutEnd} />

            <button className="button" onClick={handleSubmit}>Agree &amp; Continue</button>
          </div>
        </div>
      </div>

    </Fragment>
  );
}

HomesBookingPage.propTypes = {
  listing: PropTypes.object,
  calendar: PropTypes.array,
  bookingDetails: PropTypes.object,

  // Router props
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(HomesBookingPage);
