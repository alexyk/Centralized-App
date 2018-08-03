import React from 'react';


import '../../../styles/css/components/homes/booking/homes-booking-page.css';

class HomesBookingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      from: 14,
      to: 12
    };
  }

  componentDidMount() {
    const { from, to } = this.state;
    const fromWidth = ((100 / 24) * from);
    const toWidth = (100 / 24) * to;

    this.timerCheckInOut = setTimeout(() => {
      document.getElementById('check_in_hour').style.width = `calc(${fromWidth}% + 40px)`;
      document.getElementById('check_out_hour').style.width = `calc(${toWidth}% + 40px)`;

      document.getElementById('check_in_line_1').style.width = `${fromWidth}%`;
      document.getElementById('check_in_line_tooltip').style.width = '3%';
      document.getElementById('check_in_line_2').style.width = `${100 - fromWidth - 3}%`;
      document.getElementById('check_out_line_1').style.width = `${toWidth - 3}%`;
      document.getElementById('check_out_line_tooltip').style.width = '3%';
      document.getElementById('check_out_line_2').style.width = `${100 - toWidth}%`;

      document.getElementById('check_in_tooltip').style.width = `calc(${fromWidth}% + 95px)`;
      document.getElementById('check_out_tooltip').style.width = `calc(${toWidth}% + 15px)`;
    }, 100);
  }

  componentWillUnmount() {
    clearTimeout(this.timerCheckInOut);
  }

  render() {
    return (

      <div id="homes-booking-page-container">
        <div className="container">
          <div className="left-part">
            <img className="hotel-img" src="/images/wish-hotel-img.jpg" alt="wish-hotel" />
            <div className="review-info-container">
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
              <div><p className="city">Sozopol, Bulgaria</p></div></div>

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
            </div>
            <div className="image-dot">
              <img src="/images/dot-bgr.png" alt="dot-bgr" />
            </div>
          </div>
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
                  <div id="check_in_hour">{this.state.from}:00 pm</div>
                  <div className="lines">
                    <div id="check_in_line_1" />
                    <div id="check_in_line_tooltip" />
                    <div id="check_in_line_2" />
                  </div>
                  <div id="check_in_tooltip"><div className="tooltip-content">From {this.state.from}:00 pm</div></div>
                </div>
              </div>
              <div className="check-out">
                <p className="check-out-text">Check-out</p>
                <div className="check-out-line">
                  <div id="check_out_hour">{this.state.to}:00 pm</div>
                  <div className="lines">
                    <div id="check_out_line_1" />
                    <div id="check_out_line_tooltip" />
                    <div id="check_out_line_2" />
                  </div>
                  <div id="check_out_tooltip"><div className="tooltip-content">Until {this.state.to}:00 pm</div></div>
                </div>
              </div>
            </div>
            <div className="children-and-extra-beds">
              <h3>Children & Extra Beds</h3>
              <p>All children are welcome.</p>
              <p>FREE! One child under 2 years stays free of charge in a crib.</p>
              <p>There is no capacity for extra beds in the room.</p>
            </div>
            <button className="btn">Agree & Continue</button>
          </div>
        </div>
      </div>

    );
  }
}

export default HomesBookingPage;
