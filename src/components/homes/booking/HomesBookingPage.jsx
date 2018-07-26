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
            <div className="price-container">
              <p>$85 x 4 nights</p>
              <p>total price <span>$340</span></p>
              {/* <hr/> */}
            </div>
            <img src="/images/dot-bgr.png" alt="dot-bgr" />
          </div>
          <div className="right-part">
            <h2>Review Room Details</h2>
            <h3>The Space</h3>
            {/* <hr /> */}
            <div className="icons-container-space">
              <div>        <img src="/images/icon-review/icon-1.png" alt="icon-home-w" />
                <p>Entire Home/Apt</p></div>
              <div>
                <img src="/images/icon-review/icon-2.png" alt="icon-guest" />
                <p>Guests x4</p></div>
              <div>
                <img src="/images/icon-review/icon-3.png" alt="icon-size" />
                <p>85 m2</p></div>
              <div>
                <img src="/images/icon-review/icon-4.png" alt="icon-bathroom" />
                <p>1 Bathroom</p>
              </div>
              <div>
                <img src="/images/icon-review/icon-5.png" alt="icon-bedrooms" />
                <p>2 Bedrooms</p>
              </div>
            </div>
            <h3>Sleeping Arrangements</h3>
            <div className="arrangements-container">
            <div>
              <p><span>Bedroom 1</span>One double bed</p>
              <img src="/images/icon-review/icon-6.png" alt="icon-bedroom" />
            </div>
            <div>
              <p><span>Bedroom 2</span>Two twin beds</p>
              <img src="/images/icon-review/icon-7.png" alt="icon-bedroom" />
            </div>
            <div>
              <p><span>Living Room</span>One sofa bed</p>
              <img src="/images/icon-review/icon-8.png" alt="icon-sofa-bed" />
            </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default HomesBookingPage;
