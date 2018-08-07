import React from 'react';
import HotelTrip from './HotelTrip.jsx';
import { shallow } from 'enzyme';

describe('<HotelTrip />', () => {
  let mockProps, wrapper;
  beforeEach(() => {
    mockProps = {
      trip: {
        arrival_date: '2018-08-07',
        booking_id: null,
        created_on: 1533568675000,
        error: null,
        has_details: 0,
        hotel_id: 24278,
        hotel_name: 'Vitosha Park Hotel',
        hotel_photo: "{\"id\":\"411442\", \"original\":\"hotels/images/img-2-2900328012053570-153845.png\", \"thumbnail\":\"hotels/images/img-1-2900327971416594-153845.png\"}",
        id: 547,
        nights: 1,
        status: 'PENDING',
        transaction_hash: '0x5b063f05f770a32185641f4b6e3bd33e2500b7aab0d8a5090416af4f2040df2c',

      },
      styleClass: 'trips-flex-container',
      handleCancelReservation: jest.fn(),
      onTripSelect: jest.fn(),
    };

    wrapper = shallow(<HotelTrip {...mockProps} />);
  });

  it('renders without failing', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should extract dates correctly', () => {
    const expectedDate = {
      checkIn: {
        day: '7',
        year: '2018',
        month: 'aug'
      },
      checkOut: {
        day: '8',
        year: '2018',
        month: 'aug'
      }
    };
    expect(wrapper.instance().extractDatesData(mockProps.trip)).toEqual(expectedDate);
  });

  it('should determine if date is in the future', () => {
    expect(wrapper.instance().isFutureDate('2017-09-15', mockProps.trip.arrival_date)).toEqual(true);
    expect(wrapper.instance().isFutureDate('2019-09-15', mockProps.trip.arrival_date)).toEqual(false);
  });
});