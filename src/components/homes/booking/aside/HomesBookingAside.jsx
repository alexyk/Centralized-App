import React from 'react';
import Slider from 'react-slick';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Config } from '../../../../config.js';
import DatePreview from '../datePreview';
import { CurrencyConverter } from '../../../../services/utilities/currencyConverter.js';
import { getPriceForPeriod } from '../../common/detailsPageUtils.js';
import './style.scss';
import Rating from '../../../common/rating/Rating';
import LocPrice from '../../../common/utility/LocPrice';
import { RoomsXMLCurrency } from '../../../../services/utilities/roomsXMLCurrency.js';
import Loader from '../../../common/loader/index.js';

class HomesBookingAside extends React.Component {
  
  render() {
    const { listing, searchParams, calendar } = this.props;
    const { currencyExchangeRates } = this.props.exchangeRatesInfo;

    if (!currencyExchangeRates || !calendar || !listing) {
      return (<Loader />);
    }

    const pictures = listing.pictures.filter(x => x.thumbnail !== null);
    const startDate = moment(searchParams.startDate, 'DD/MM/YYYY');
    const endDate = moment(searchParams.endDate, 'DD/MM/YYYY');

    const SlickButton = ({ currentSlide, slideCount, ...arrowProps }) => {
      return (
        <button {...arrowProps} />
      );
    };

    const settings = {
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <SlickButton />,
      prevArrow: <SlickButton />,
      className: 'picture'
    };

    const calculateNights = (startDate, endDate) => {
      return endDate.diff(startDate, 'days');
    };

    const { currencyCode, cleaningFee } = listing;

    const { currency,
      currencySign } = this.props.paymentInfo;

    const nights = calculateNights(startDate, endDate);

    const price = getPriceForPeriod(startDate, nights, calendar);

    let defaultDailyPrice = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, price);
    let fiatPriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), price);

    let defaultCleaningFee = CurrencyConverter.convert(currencyExchangeRates, currencyCode, currency, cleaningFee);
    let fiatCleaningFeePriceInRoomsXMLCurrency = CurrencyConverter.convert(currencyExchangeRates, currencyCode, RoomsXMLCurrency.get(), cleaningFee);

    let totalPrice = (nights * defaultDailyPrice) + defaultCleaningFee;
    let totalPriceRoomsXMLCurrency = (fiatPriceInRoomsXMLCurrency * nights) + fiatCleaningFeePriceInRoomsXMLCurrency;

    return (
      <div className="left-part">
        {pictures.length > 0 && <Slider
          {...settings}>
          {pictures.map((picture, i) => {
            return (
              <div key={i}>
                <div style={{ backgroundImage: `url("${Config.getValue('imgHost')}${picture.thumbnail.slice(1)}")` }} />
              </div>
            );
          })}
        </Slider>}
        <div className="review-info-container">
          <h2>{listing.name}</h2>
          <Rating rating={listing.averageRating} />
          <div><p className="city">{listing.city.name}, {listing.country.name}</p></div></div>
        <div className="booking-info-container">
          <div className="div-guest">
            <div>
              <img src="/images/icon-guest.png" alt="icon-guest" />
            </div>
            <p> {searchParams.guests} Guests</p>
          </div>
          <DatePreview checkin={startDate} checkout={endDate} />
        </div>
        <div className="price-container">
          <div className="price">
            <span>{currencySign}{(defaultDailyPrice).toFixed(2)} <LocPrice fiat={fiatPriceInRoomsXMLCurrency} brackets={true} /> x {nights} nights</span>
          </div>
          <div className="price">
            <span>{currencySign}{(defaultCleaningFee).toFixed(3)} <LocPrice fiat={fiatCleaningFeePriceInRoomsXMLCurrency} /> cleaning fee</span>
          </div>
          <div className="total">
            <span>total price <span className="value">{currencySign}{(totalPrice).toFixed(3)} <LocPrice fiat={totalPriceRoomsXMLCurrency} /></span></span>
          </div>
        </div>
        <div className="image-dot">
          <img src="/images/dot-bgr.png" alt="dot-bgr" />
        </div>
      </div>
    );
  }
}

HomesBookingAside.propTypes = {
  listing: PropTypes.object,
  searchParams: PropTypes.object,

  // Redux props
  paymentInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo, exchangeRatesInfo } = state;
  return {
    paymentInfo,
    exchangeRatesInfo
  };
}

export default connect(mapStateToProps)(HomesBookingAside);
