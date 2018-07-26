import React from 'react';
import { Config } from '../../../config';

import '../../../styles/css/components/homes/booking/homes-booking-page.css';


class HomesBookingPage extends React.Component {

  render() {
    return (

      <div id="homes-booking-page-container">
        <div className="container">
          <div className="left-part">
            <img className="hotel-img" src="/images/wish-hotel-img.jpg" alt="wish-hotel" />
            <h2>Heaven - Junior Suite with view</h2>
            <div className="rating">
              <p>Excellent 4.1/5 </p>
              <div>
                <img src="/images/icon-star-filter.png" alt="star" />
                <img src="/images/icon-star-filter.png" alt="star" />
                <img src="/images/icon-star-filter.png" alt="star" />
                <img src="/images/icon-star-filter.png" alt="star" />
                <img src="/images/icon-star-filter-g.png" alt="star" />
              </div>
              <p> 73 Reviews</p></div>
            <p className="city">Sozopol, Bulgaria</p>
            <div className="booking-info-container">
              <div className="div-guest">
                <div>
                  <img src="/images/icon-guest.png" alt="icon-guest" />
                </div>
                <p> 2 Adults, 2 Children</p>
              </div>
              <div className="check-in-out">
                <div>
                  <img src="/images/icon-calendar.png" alt="icon-calendar" />
                </div>
                  <div className="row-container">
                  <p>Check-in</p>
                  <div className="date-mon-day">
                    <p><span>18 </span>SEP, MON</p>
                  </div>
                  </div>
                  <div className="arrow-icon-container">
                    <img src="/images/icon-arrow.png" alt="icon-arrow" />
                    </div>
                    <div>
                    <img src="/images/icon-calendar.png" alt="icon-calendar" />
                  </div>
                  <div className="row-container">
                    <p>Check-out</p>
                    <div className="date-mon-day">
                      <p><span className="date-color">22 </span>SEP, FRI</p>
                    </div>
                    </div>
                  <div className="border-nights-container">
                    <div>
                      <img src="/images/icon-moon.png" alt="icon-moon" />
                    </div>
                    <p>4 nights</p>
                </div>

            </div>
            </div>
            <div>
              <p>$85 x 4 nights</p>
              <p>total price <span>$340</span></p>
            </div>


      </div>
      </div>
      </div>

    );
  }
}

export default HomesBookingPage;
