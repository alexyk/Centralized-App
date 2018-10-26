import React from 'react';
import Slider from 'react-slick';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Config } from '../../../config.js';
import SearchBarDatePickerHidePreview from '../../common/search/SearchBarDatePickerHidePreview';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter.js';
import { getPriceForPeriod } from '../common/detailsPageUtils.js';
import '../../../styles/css/components/homes/booking/homes-booking-listing-details-info.css';
import Rating from '../../common/rating/Rating';
import LocPrice from '../../common/utility/LocPrice';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency.js';
class HomesBookingListingDetailsInfo extends React.Component {
  render() {
    const { listing, searchParams, calendar } = this.props;
    const { currencyExchangeRates } = this.props.exchangeRatesInfo;

    if (!currencyExchangeRates || !calendar || !listing) {
      return <div className="loader"></div>;
    }

    const pictures = listing.pictures.filter(x => x.thumbnail !== null);
    const startDate = moment(searchParams.startDate, 'DD/MM/YYYY');
    const endDate = moment(searchParams.endDate, 'DD/MM/YYYY');

    const datesDetails = {
      startDateDay: startDate.format('DD'),
      startDateMonth: startDate.format('MMM').toUpperCase(),
      startDateDayOfWeek: startDate.format('ddd').toUpperCase(),
      endDateDay: endDate.format('DD'),
      endDateMonth: endDate.format('MMM').toUpperCase(),
      endDateDayOfWeek: endDate.format('ddd').toUpperCase()
    };

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
          <SearchBarDatePickerHidePreview datesDetails={datesDetails} />
          <div className="border-nights-container">
            <div className="border-nights">
              <img src="/images/icon-moon.png" alt="icon-moon" />
              <p>{nights} nights</p>
            </div>
          </div>
        </div>
        <div className="price-container">
          <div className="price">{currencySign}{(defaultDailyPrice).toFixed(3)} x {nights} nights</div>
          <div className="price">{currencySign}{(defaultCleaningFee).toFixed(3)} cleaning fee</div>
          <div className="total">total price <span>{currencySign}{((nights * defaultDailyPrice) + defaultCleaningFee).toFixed(3)}</span></div>

          <div className="price"><p><LocPrice fiat={fiatPriceInRoomsXMLCurrency} brackets={false} /> x {nights} nights</p></div>
          <div className="price"><p><LocPrice fiat={fiatCleaningFeePriceInRoomsXMLCurrency} brackets={false} /> cleaning fee</p></div>
          <div className="total">total price <LocPrice fiat={(fiatPriceInRoomsXMLCurrency * nights) + fiatCleaningFeePriceInRoomsXMLCurrency} brackets={false} /></div>
        </div>
        <div className="image-dot">
          <img src="/images/dot-bgr.png" alt="dot-bgr" />
        </div>
      </div>
    );
  }
}

HomesBookingListingDetailsInfo.propTypes = {
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

export default connect(mapStateToProps)(HomesBookingListingDetailsInfo);
