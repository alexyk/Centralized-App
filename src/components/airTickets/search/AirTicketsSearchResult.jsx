import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import LocPrice from '../../common/utility/LocPrice';
import TimeIcon from '../../../styles/images/time-icon.png';

import '../../../styles/css/components/airTickets/search/air-tickets-search-result.css';

const SCREEN_SIZE_SMALL = 'SMALL';
const SCREEN_SIZE_MEDIUM = 'MEDIUM';
const SCREEN_SIZE_LARGE = 'LARGE';

const BREAKPOINTS = {
  SMALL: 370,
  MEDIUM: 768,
  LARGE: 2160
};

const DESCRIPTION_LENGTH = {
  SMALL: 50,
  MEDIUM: 100,
  LARGE: 500,
};

const TITLE_LENGTH = {
  SMALL: 20,
  MEDIUM: 40,
  LARGE: 200,
};

class AirTicketsSearchResult extends Component {
  constructor(props) {
    super(props);

    const screenWidth = window.innerWidth;
    const screenSize = this.getScreenSize(screenWidth);

    this.state = {
      screenWidth: screenWidth,
      titleLength: this.getTitleLength(screenSize),
      descriptionLength: this.getDescriptionLength(screenSize)
    };

    this.updateWindowDimensions = _.debounce(this.updateWindowDimensions.bind(this), 500);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    const width = window.innerWidth;
    const screenSize = this.getScreenSize(width);
    const titleLength = this.getTitleLength(screenSize);
    const descriptionLength = this.getDescriptionLength(screenSize);
    this.setState({ screenWidth: window.innerWidth, titleLength, descriptionLength });
  }

  getScreenSize(screenWidth) {
    if (screenWidth < BREAKPOINTS.SMALL) {
      return SCREEN_SIZE_SMALL;
    } else if (screenWidth < BREAKPOINTS.MEDIUM) {
      return SCREEN_SIZE_MEDIUM;
    } else {
      return SCREEN_SIZE_LARGE;
    }
  }

  getDescriptionLength(screenSize) {
    return DESCRIPTION_LENGTH[screenSize];
  }

  getTitleLength(screenSize) {
    return TITLE_LENGTH[screenSize];
  }

  extractFlightFullDurationFromMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}min`;
  }

  extractDatesData(segments) {
    const startDateMoment = moment(segments[0].origin.date).utc();
    const endDateMoment = moment(segments[segments.length - 1].destination.date).utc();

    const departure = {
      day: startDateMoment.format('D'),
      year: startDateMoment.format('YYYY'),
      month: startDateMoment.format('MMM'),
      time: segments[0].origin.time,
      timezone: segments[0].origin.timeZone
    };

    const arrival = {
      day: endDateMoment.format('D'),
      year: endDateMoment.format('YYYY'),
      month: endDateMoment.format('MMM'),
      time: segments[segments.length - 1].origin.time,
      timezone: segments[segments.length - 1].origin.timeZone
    };

    return { departure, arrival };
  }

  getDepartureInfo(departureInfo) {
    if (departureInfo.length === 0) {
      return;
    }

    const departureDate = this.extractDatesData(departureInfo);

    let middleStopsBulets = [];

    const buletIndex = 180 / departureInfo.length;

    for (let i = 0; i < departureInfo.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container" style={{ left: `${((i + 1) * buletIndex) + 8}px` }}><span className="bulet"></span></div>
          <div className="middle-stop" style={{ left: `${(((i + 1) * buletIndex) + 8) - 11}px` }}>
            {departureInfo[i].destination.code}
            <div className="tooltip-content">
              <div>Transfer</div>
              <hr />
              <div>{departureInfo[i].destination.name} ({departureInfo[i].destination.code})</div>
            </div>
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className="solution-main-info">
          <h5 className="departure">Departure</h5>
          <h5 className="carrier">{departureInfo[0].carrier.name}</h5>
          <div className="duration">
            <img width="20" src={TimeIcon} alt="time" />
            {this.extractFlightFullDurationFromMinutes(departureInfo[departureInfo.length - 1].journeyTime)}
          </div>
          <div className="stops-count">{departureInfo.length - 1 === 0 ? 'direct flight' : `${departureInfo.length - 1} stops`}</div>
        </div>
        <div className="solution-flight">
          <div className="flight">
            <div className="item flight-date-times">
              <div className="flight-date-time">
                <span className="date-in-day">{departureDate.departure.day}</span> {departureDate.departure.month}, {departureDate.departure.year}
                <div className="time">{departureDate.departure.time} {departureDate.departure.timezone}</div>
              </div>
              <div className="arrow-icon-container">
                <img src="/images/icon-arrow.png" alt="icon-arrow" />
              </div>
              <div className="flight-date-time">
                <span className="date-out-day">{departureDate.arrival.day}</span> {departureDate.arrival.month}, {departureDate.arrival.year}
                <div className="time">{departureDate.arrival.time} {departureDate.arrival.timezone}</div>
              </div>
            </div>
            <div className="item flight-stops">
              <div className="stop">
                {departureInfo[0].origin.code}
                <div className="tooltip-content">
                  <div>Departure</div>
                  <hr />
                  <div>{departureInfo[0].origin.name} ({departureInfo[0].origin.code})</div>
                </div>
              </div>
              <div className="stops-container horizontal">
                <div className="bulet-container"><span className="bulet"></span></div>
                <hr className="line" />
                {departureInfo.length === 1 ? null : middleStopsBulets}
                <div className="bulet-container" style={{ left: '180px' }}><span className="bulet"></span></div>
              </div>
              <div className="stop">
                {departureInfo[departureInfo.length - 1].destination.code}
                <div className="tooltip-content">
                  <div>Arrival</div>
                  <hr />
                  <div>{departureInfo[departureInfo.length - 1].destination.name} ({departureInfo[departureInfo.length - 1].destination.code})</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment >
    );
  }

  getReturnInfo(returnInfo) {
    if (returnInfo.length === 0) {
      return;
    }
    
    const returnDate = this.extractDatesData(returnInfo);

    let middleStopsBulets = [];

    const buletIndex = 180 / returnInfo.length;

    for (let i = 0; i < returnInfo.length - 1; i++) {
      middleStopsBulets.push(
        <Fragment key={i}>
          <div key={i} className="bulet-container" style={{ left: `${((i + 1) * buletIndex) + 8}px` }}><span className="bulet"></span></div>
          <div className="middle-stop" style={{ left: `${(((i + 1) * buletIndex) + 8) - 11}px` }}>
            {returnInfo[i].destination.code}
            <div className="tooltip-content">
              <div>Transfer</div>
              <hr />
              <div>{returnInfo[i].destination.name} ({returnInfo[i].destination.code})</div>
            </div>
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className="solution-main-info">
          <h5 className="departure">Return</h5>
          <h5 className="carrier">{returnInfo[0].carrier.name}</h5>
          <div className="duration">
            <img width="20" src={TimeIcon} alt="time" />
            {this.extractFlightFullDurationFromMinutes(returnInfo[returnInfo.length - 1].journeyTime)}
          </div>
          <div className="stops-count">{returnInfo.length - 1 === 0 ? 'direct flight' : `${returnInfo.length - 1} stops`}</div>
        </div>
        <div className="solution-flight">
          <div className="flight">
            <div className="item flight-date-times">
              <div className="flight-date-time">
                <span className="date-in-day">{returnDate.departure.day}</span> {returnDate.departure.month}, {returnDate.departure.year}
                <div className="time">{returnDate.departure.time} {returnDate.departure.timezone}</div>
              </div>
              <div className="arrow-icon-container">
                <img src="/images/icon-arrow.png" alt="icon-arrow" />
              </div>
              <div className="flight-date-time">
                <span className="date-out-day">{returnDate.arrival.day}</span> {returnDate.arrival.month}, {returnDate.arrival.year}
                <div className="time">{returnDate.arrival.time} {returnDate.arrival.timezone}</div>
              </div>
            </div>
            <div className="item flight-stops">
              <div className="stop">
                {returnInfo[0].origin.code}
                <div className="tooltip-content">
                  <div>Departure</div>
                  <hr />
                  <div>{returnInfo[0].origin.name} ({returnInfo[0].origin.code})</div>
                </div>
              </div>
              <div className="stops-container horizontal">
                <div className="bulet-container"><span className="bulet"></span></div>
                <hr className="line" />
                {returnInfo.length === 1 ? null : middleStopsBulets}
                <div className="bulet-container" style={{ left: '180px' }}><span className="bulet"></span></div>
              </div>
              <div className="stop">
                {returnInfo[returnInfo.length - 1].destination.code}
                <div className="tooltip-content">
                  <div>Arrival</div>
                  <hr />
                  <div>{returnInfo[returnInfo.length - 1].destination.name} ({returnInfo[returnInfo.length - 1].destination.code})</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment >
    );
  }

  render() {
    const { exchangeRatesInfo, paymentInfo, userInfo, result, allElements, flightRouting } = this.props;

    const departureInfo = result.segments.filter(s => s.group === '0');
    const returnInfo = result.segments.filter(s => s.group === '1');

    const priceInfo = result.price;
    const price = priceInfo.total;

    const isPriceLoaded = !!price;
    const priceForLoc = exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, priceInfo.currency, RoomsXMLCurrency.get(), price);
    const priceInSelectedCurrency = exchangeRatesInfo.currencyExchangeRates && (CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, priceInfo.currency, paymentInfo.currency, price)).toFixed(2);

    const isMobile = this.props.location.pathname.indexOf('mobile') !== -1;

    // TODO: add redirect path for mobile
    const redirectURL = isMobile
      ? '/tickets/results/initBook'
      : '/tickets/results/initBook';

    const search = this.props.location.search;
    const endOfSearch = search.indexOf('&filters=') !== -1 ? search.indexOf('&filters=') : search.length;

    return (
      <div className="air-tickets-result" >
        <form className="air-tickets-result-content">
          {flightRouting !== '3' ?
            <Fragment>
              {this.getDepartureInfo(departureInfo)}
              {this.getReturnInfo(returnInfo)}
            </Fragment> :
            <Fragment>
              {this.getDepartureInfo(departureInfo)}
              {this.getReturnInfo(returnInfo)}
            </Fragment>}
          <div className="air-tickets-result-mobile-pricing">
            {!isPriceLoaded
              ? (!allElements ? <div className="price">Loading price...</div> : <div></div>)
              : <div className="price">{userInfo.isLogged && `${paymentInfo.currencySign} ${priceInSelectedCurrency}`}</div>
            }
            {isPriceLoaded && <div className="price">Total price: <LocPrice fiat={priceForLoc} /></div>}
            <div>
              {!isPriceLoaded && allElements
                ? <button disabled className="mobile-pricing-button">Unavailable</button>
                : <Link className="mobile-pricing-button" to={`${redirectURL}/${result.id}/details${search.substr(0, endOfSearch)}`}>Book now</Link>
              }
            </div>
          </div>
        </form>

        <div className="air-tickets-result-pricing">
          <div className="price-for">
            <div>Price for 1 adult</div>
            {result.routing === 1 ? <div>one way</div> : <div>round trip</div>}
          </div>
          {!isPriceLoaded
            ? (!allElements ? <div className="loader" style={{ width: '100%' }}></div> : <span style={{ padding: '20px 10px 10px 10px' }}>Unavailable</span>)
            : <span className="price">{userInfo.isLogged && priceInSelectedCurrency && `${paymentInfo.currencySign} ${priceInSelectedCurrency}`}</span>
          }
          {isPriceLoaded && <LocPrice fiat={priceForLoc} />}
          {!isPriceLoaded && allElements
            ? <button disabled className="btn">Unavailable</button>
            : <Link className="btn" to={`${redirectURL}/${result.id}/details${search.substr(0, endOfSearch)}`}>Book now</Link>
          }
        </div>
      </div>
    );
  }
}

AirTicketsSearchResult.propTypes = {
  result: PropTypes.object,
  price: PropTypes.any,
  allElements: PropTypes.bool,

  // Router props
  location: PropTypes.object,

  // Redux props
  exchangeRatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object,
  flightRouting: PropTypes.string
};

const mapStateToProps = (state) => {
  const { exchangeRatesInfo, paymentInfo, userInfo, airTicketsSearchInfo } = state;

  return {
    exchangeRatesInfo,
    paymentInfo,
    userInfo,
    flightRouting: airTicketsSearchInfo.flightRouting
  };
};

export default withRouter(connect(mapStateToProps)(AirTicketsSearchResult));
