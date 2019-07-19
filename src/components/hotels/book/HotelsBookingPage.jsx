import "../../../styles/css/components/hotels/book/hotel-booking-page.css";

import {LONG} from "../../../constants/notificationDisplayTimes.js";
import {
  INVALID_CHILD_AGE,
  INVALID_GUEST_NAME,
  REPEATING_NAMES
} from "../../../constants/warningMessages.js";

import {Config} from "../../../config";
import {CurrencyConverter} from "../../../services/utilities/currencyConverter";
import {NotificationManager} from "react-notifications";
import PropTypes from "prop-types";
import React from "react";
import {connect} from "react-redux";
import moment from "moment";
import queryString from "query-string";
import {withRouter} from "react-router-dom";
import BookingSteps from "../../common/utility/BookingSteps";
import {RoomsXMLCurrency} from "../../../services/utilities/roomsXMLCurrency";
import LocPrice from "../../common/utility/LocPrice";
import xregexp from "xregexp";
import {DEFAULT_LISTING_IMAGE_URL} from "../../../constants/images";
import AsideContentPage from "../../common/asideContentPage";
import {getCurrency, getCurrencySign} from "../../../selectors/paymentInfo";
import {getCurrencyExchangeRates} from "../../../selectors/exchangeRatesInfo";
import {getCountries} from "../../../selectors/countriesInfo";
import {ROOM_NO_LONGER_AVAILABLE} from "../../../constants/warningMessages";

class HotelsBookingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      country: ""
    };


    this.updateCountry = this.updateCountry.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getQueryString = this.getQueryString.bind(this);
    this.redirectToHotelDetailsPage = this.redirectToHotelDetailsPage.bind(this);
    this.getCleanQueryString = this.getCleanQueryString.bind(this);
    this.stringifyRoomsExcludingGuestNames = this.stringifyRoomsExcludingGuestNames.bind(this);
  }

  calculateRoomsTotalPrice(rooms) {
    let total = 0;
    for (let i = 0; i < rooms.length; i++) {
      total += rooms[i].price;
    }

    return total;
  }

  calculateReservationTotalNights(search) {
    const searchParams = queryString.parse(search);
    const start = moment(searchParams.startDate, "DD/MM/YYYY");
    const end = moment(searchParams.endDate, "DD/MM/YYYY");
    return end.diff(start, "days");
  }

  processSubmit() {
    const queryParams = queryString.parse(this.props.location.search);
    const id = this.props.match.params.id;
    const query = this.getQueryString(queryParams);
    const isWebView = this.props.location.pathname.indexOf("/mobile") !== -1;
    const rootURL = !isWebView
      ? `/hotels/listings/book/${id}/confirm`
      : `/mobile/hotels/listings/book/${id}/confirm`;
    this.props.history.push(`${rootURL}${query}`);
  }

  handleSubmit() {
    let proceed = true;
    if (!this.isValidNames()) {
      proceed = false;
      NotificationManager.warning(INVALID_GUEST_NAME, "", LONG);
    }
    if (!this.isValidAges()) {
      proceed = false;
      NotificationManager.warning(INVALID_CHILD_AGE, "", LONG);
    }
    if (this.isRepeatingNames()) {
      proceed = false;
      NotificationManager.error(REPEATING_NAMES, "", LONG * 2, () => {
        this.processSubmit();
      });
    }
    // if (!this.state.country) {
    //   proceed = false;
    //   NotificationManager.error("Please select nationality!", "", LONG * 2);
    // }
    if (proceed) {
      // let obj = {
      //   "quoteId": this.props.quoteId,
      //   "rooms": this.props.guests,
      //   "nat": this.state.country.id
      // };
      // console.log(obj);
      // requester.getQuoteIdExpirationFlag(this.state.quoteId).then(res => res.body).then(data => {
      //   // if (false) {
      //     if (!data.is_quote_valid) {
      //       this.processSubmit();
      //   } else {
      //     this.redirectToHotelDetailsPage();
      //   }
      // });
      this.processSubmit();
    }
  }

  redirectToHotelDetailsPage() {
    NotificationManager.warning(ROOM_NO_LONGER_AVAILABLE, '', LONG);
    const id = this.props.match.params.id;
    const pathname = this.props.location.pathname.indexOf('/mobile') !== -1 ? '/mobile/hotels/listings' : '/hotels/listings';
    const search = this.getCleanQueryString(queryString.parse(this.props.location.search));
    this.props.history.push(`${pathname}/${id}${search}`);
  }

  getCleanQueryString() {
    const queryStringParameters = queryString.parse(this.props.location.search);

    let result = '?';
    result += 'region=' + encodeURI(queryStringParameters.region);
    result += '&currency=' + encodeURI(queryStringParameters.currency);
    result += '&startDate=' + encodeURI(queryStringParameters.startDate);
    result += '&endDate=' + encodeURI(queryStringParameters.endDate);
    result += '&rooms=' + encodeURI(this.stringifyRoomsExcludingGuestNames(queryStringParameters.rooms));
    result += '&nat=' + encodeURI(queryStringParameters.nat);

    return result;
  }

  stringifyRoomsExcludingGuestNames(rooms) {
    rooms = JSON.parse(rooms);
    rooms.forEach((room) => {
      room.adults = room.adults.length ? room.adults.length : room.adults;
      room.children = room.children.length ? room.children.map( c => { return {"age" : c.age}; }) : room.children;
    });

    return JSON.stringify(rooms);
  }

  getQueryString(queryStringParameters) {
    let queryString = "?";
    queryString += "region=" + encodeURI(queryStringParameters.region);
    queryString += "&currency=" + encodeURI(queryStringParameters.currency);
    queryString += "&startDate=" + encodeURI(queryStringParameters.startDate);
    queryString += "&endDate=" + encodeURI(queryStringParameters.endDate);
    queryString += "&rooms=" + encodeURI(JSON.stringify(this.props.guests));
    queryString += "&quoteId=" + encodeURI(queryStringParameters.quoteId);
    queryString += "&nat=" + encodeURI(queryStringParameters.nat);
    return queryString;
  }

  isValidNames() {
    const rooms = this.props.guests;
    const regexp = xregexp("^\\pL+([- ']?\\pL*)?([- ']?\\pL*)$");
    for (let i = 0; i < rooms.length; i++) {
      const adults = rooms[i].adults;
      for (let j = 0; j < adults.length; j++) {
        const first = adults[j].firstName;
        const last = adults[j].lastName;
        if (!(regexp.test(first) && regexp.test(last))) {
          return false;
        }
      }

      const children = rooms[i].children;
      for(let c = 0; c < children.length; c++){
        const first = children[c].firstName;
        const last = children[c].lastName;
        if (!(regexp.test(first) && regexp.test(last))) {
          return false;
        }
      }
    }

    return true;
  }

  isRepeatingNames() {
    const rooms = this.props.guests;
    for (let i = 0; i < rooms.length; i++) {
      const adults = rooms[i].adults;
      for (let j = 0; j < adults.length; j++) {
        const first = adults[j].firstName;
        const last = adults[j].lastName;
        for (let z = i + 1; z < rooms.length; z++) {
          const _adults = rooms[z].adults;
          for (let m = 0; m < _adults.length; m++) {
            if (_adults[m].firstName == first && _adults[m].lastName == last) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  isValidAges() {
    const rooms = this.props.guests;
    for (let i = 0; i < rooms.length; i++) {
      const children = rooms[i].children;
      for (let j = 0; j < children.length; j++) {
        const age = children[j].age;
        if (age < 1 || 17 < age) {
          return false;
        }
      }
    }

    return true;
  }

  updateCountry(e) {
    let value = JSON.parse(e.target.value);

    this.setState({
      country: value,
      city: ''
    });
  }

  render() {
    if (!this.props.hotel) {
      return <div className="loader"/>;
    }

    if (!this.props.rooms) {
      return <div className="loader"/>;
    }

    if (!this.props.currencyExchangeRates) {
      return <div className="loader"/>;
    }

    if (!this.props.guests) {
      return <div className="loader"/>;
    }

    const {
      hotel,
      rooms,
      guests,
      currency,
      currencySign,
      currencyExchangeRates,
      handleAdultChange,
      handleChildAgeChange,
      location
    } = this.props;
    const city = hotel.city;
    const address = hotel.additionalInfo.mainAddress;
    const roomsTotalPrice = this.calculateRoomsTotalPrice(rooms);
    const hotelPicUrl =
      hotel.hotelPhotos && hotel.hotelPhotos.length > 0
        ? hotel.hotelPhotos[0].url
        : DEFAULT_LISTING_IMAGE_URL;
    const priceInSelectedCurrency = Number(
      CurrencyConverter.convert(
        currencyExchangeRates,
        RoomsXMLCurrency.get(),
        currency,
        roomsTotalPrice
      )
    ).toFixed(2);
    const nights = this.calculateReservationTotalNights(location.search);

    return (
      <div>
        <BookingSteps
          steps={[
            "Provide Guest Information",
            "Review Room Details",
            "Confirm and Pay"
          ]}
          currentStepIndex={1}
        />
        <section id="room-book">
          <div className="container">
            <AsideContentPage>
              <AsideContentPage.Aside width={"30%"}>
                <div className="hotel-info">
                  <div className="hotel-picture">
                    <img
                      src={`${Config.getValue("imgHost")}${hotelPicUrl}`}
                      alt="Hotel"
                    />
                  </div>
                  <h6>{hotel.name}</h6>
                  <h6>
                    {address}
                    &nbsp;
                    {city}
                  </h6>
                  <hr/>
                  {rooms.map((room, index) => {
                    return (
                      <h6 key={index}>
                        {room.name}, {nights} nights: {currencySign}
                        {currencyExchangeRates &&
                        CurrencyConverter.convert(
                          currencyExchangeRates,
                          RoomsXMLCurrency.get(),
                          currency,
                          room.price
                        ).toFixed(2)}{" "}
                        <LocPrice fiat={room.price}/>
                      </h6>
                    );
                  })}
                  <hr/>
                  <h6 className="total-price">
                    Total: {currencySign}
                    {priceInSelectedCurrency}{" "}
                    {roomsTotalPrice && <LocPrice fiat={roomsTotalPrice}/>}
                  </h6>
                  <div className="clearfix"/>
                </div>
              </AsideContentPage.Aside>
              <AsideContentPage.Content width={"65%"}>
                <div className="rooms">
                  {guests.map((room, roomIndex) => {
                    return (
                      <div className="room" key={roomIndex}>
                        <h4>Room</h4>
                        <hr className="sm-none"/>
                        {/*<div className="nationality">*/}
                          {/*<label htmlFor="nationality">Nationality <span className="mandatory"></span></label>*/}
                          {/*<div className='select'>*/}
                            {/*<select name="country" id="country" onChange={this.updateCountry}*/}
                                    {/*value={JSON.stringify(this.state.country)}>*/}
                              {/*<option value="">Nationality</option>*/}
                              {/*{this.props.countries && this.props.countries.map((item, i) => {*/}
                                {/*return <option key={i} value={JSON.stringify(item)}>{item.name}</option>;*/}
                              {/*})}*/}
                            {/*</select>*/}
                          {/*</div>*/}
                        {/*</div>*/}
                        {room &&
                        room.adults.map((adult, adultIndex) => {
                          return (
                            <div className="guest" key={adultIndex}>
                              <label htmlFor="title">Guest</label>
                              <select
                                className="title-select"
                                name="title"
                                value={
                                  guests[roomIndex].adults[adultIndex].title
                                }
                                onChange={e => {
                                  handleAdultChange(e, roomIndex, adultIndex);
                                }}
                              >
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                              </select>

                              <input
                                className="guest-name"
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                value={
                                  guests[roomIndex].adults[adultIndex]
                                    .firstName || ""
                                }
                                onChange={e => {
                                  handleAdultChange(e, roomIndex, adultIndex);
                                }}
                              />
                              <input
                                className="guest-name"
                                type="text"
                                placeholder="Last Name"
                                value={
                                  guests[roomIndex].adults[adultIndex]
                                    .lastName || ""
                                }
                                name="lastName"
                                onChange={e => {
                                  handleAdultChange(e, roomIndex, adultIndex);
                                }}
                              />
                            </div>
                          );
                        })}

                        {room &&
                        room.children.map((child, childIndex) => {
                          return (
                            <div className="guest" key={childIndex}>
                              <label htmlFor="age">Child (age)</label>
                              <input
                                className="child-age"
                                type="number"
                                value={
                                  guests[roomIndex].children[childIndex].age
                                }
                                placeholder="Age"
                                name="age"
                                onChange={e => {
                                  handleChildAgeChange(
                                    e,
                                    roomIndex,
                                    childIndex
                                  );
                                }}
                              />

                              <input
                                className="guest-name"
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                value={
                                  guests[roomIndex].children[childIndex]
                                    .firstName || ""
                                }
                                onChange={e => {
                                  handleChildAgeChange(e, roomIndex, childIndex);
                                }}
                              />
                              <input
                                className="guest-name"
                                type="text"
                                placeholder="Last Name"
                                value={
                                  guests[roomIndex].children[childIndex]
                                    .lastName || ""
                                }
                                name="lastName"
                                onChange={e => {
                                  handleChildAgeChange(e, roomIndex, childIndex);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
                <button className="button btn-book" onClick={this.handleSubmit}>
                  Proceed
                </button>
              </AsideContentPage.Content>
            </AsideContentPage>
          </div>
        </section>
      </div>
    );
  }
}

HotelsBookingPage.propTypes = {
  hotel: PropTypes.object,
  rooms: PropTypes.array,
  guests: PropTypes.array,
  handleAdultChange: PropTypes.func,
  handleChildAgeChange: PropTypes.func,

  // start Router props
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  currency: PropTypes.string,
  currencySign: PropTypes.string,
  currencyExchangeRates: PropTypes.object
};

function mapStateToProps(state) {
  const {paymentInfo, exchangeRatesInfo, countriesInfo} = state;
  return {
    currency: getCurrency(paymentInfo),
    currencySign: getCurrencySign(paymentInfo),
    currencyExchangeRates: getCurrencyExchangeRates(exchangeRatesInfo),
    countries: getCountries(countriesInfo)
  };
}

export default withRouter(connect(mapStateToProps)(HotelsBookingPage));
