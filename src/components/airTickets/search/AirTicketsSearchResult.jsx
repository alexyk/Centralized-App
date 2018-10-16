import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import LocPrice from '../../common/utility/LocPrice';
import BagIcon from '../../../styles/images/bag-icon.png';
import MealIcon from '../../../styles/images/meal-icon.png';
import WirelessIcon from '../../../styles/images/icon-wireless_internet.png';
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
      departureFlightIndex: 0,
      titleLength: this.getTitleLength(screenSize),
      descriptionLength: this.getDescriptionLength(screenSize)
    };

    this.updateWindowDimensions = _.debounce(this.updateWindowDimensions.bind(this), 500);
    this.handleFlightChange = this.handleFlightChange.bind(this);
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

  handleFlightChange(e) {
    this.setState({
      departureFlightIndex: Number(e.target.value)
    });
  }

  extractFlightFullDurationFromMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}min`;
  }

  render() {
    const { exchangeRatesInfo, paymentInfo, userInfo, price, result, allElements } = this.props;
    const { departureFlightIndex } = this.state;
    let { id } = result;

    const isPriceLoaded = !!price;
    const priceForLoc = exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, 'EUR', RoomsXMLCurrency.get(), price);
    const priceInSelectedCurrency = exchangeRatesInfo.currencyExchangeRates && (CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, 'EUR', paymentInfo.currency, price)).toFixed(2);

    const isMobile = this.props.location.pathname.indexOf('mobile') !== -1;

    // TODO: add redirect path for mobile
    const redirectURL = this.props.location.pathname.indexOf('mobile') === -1
      ? '/tickets/results'
      : '/tickets/results';

    const search = this.props.location.search;
    const endOfSearch = search.indexOf('&filters=') !== -1 ? search.indexOf('&filters=') : search.length;

    return (
      <div className="air-tickets-result" >
        <form className="air-tickets-result-content">
          {result.solutions.map((solution, solutionIndex) => {
            const departureTime = solution.segments[0].origin.time;
            const arrivalTime = solution.segments[solution.segments.length - 1].destination.time;
            const carrierName = solution.segments[0].carrierName;
            let middleStopsBulets = [];
            for (let i = 0; i < solution.segments.length - 1; i++) {
              middleStopsBulets.push(
                <Fragment key={i}>
                  <div key={i} className="bulet-container"><span className="bulet"></span></div>
                  <hr className="line" />
                </Fragment>
              );
            }

            return (
              <Fragment key={solutionIndex}>
                <div className="solution-main-info">
                  <h5 className="departure">Departure</h5>
                  <h5 className="carrier">{carrierName}</h5>
                  <div className="duration">
                    <img width="20" src={TimeIcon} alt="time" />
                    {this.extractFlightFullDurationFromMinutes(solution.journeyTime)}
                  </div>
                  <div className="stops-count">{solution.segments.length - 1} stops</div>
                </div>
                <div className="solution-flight">
                  <div className="flight">
                    <input className="item" type="radio" name="flight" value="0" onClick={this.handleFlightChange} defaultChecked={departureFlightIndex === solutionIndex} />
                    <div className="item">
                      {departureTime}
                      <div className="arrow-icon-container">
                        <img src="/images/icon-arrow.png" alt="icon-arrow" />
                      </div>
                      {arrivalTime}
                    </div>
                    <div className="item">
                      <div className="stop">{solution.segments[0].origin.name}</div>
                      <div className="stops-container horizontal">
                        <div className="bulet-container"><span className="bulet"></span></div>
                        <hr className="line" />
                        {solution.segments.length === 1 ? null : middleStopsBulets}
                        <div className="bulet-container"><span className="bulet"></span></div>
                      </div>
                      <div className="middle-stop">Amsterdam</div>
                      <div className="stop">{solution.segments[solution.segments.length - 1].destination.name}</div>
                    </div>
                    <div className="item icons">
                      <div className="icon">
                        <img src={MealIcon} alt="meal" />
                      </div>
                      <div className="icon">
                        <img src={BagIcon} alt="bag" />
                      </div>
                      <div className="icon wi-fi">
                        <img src={WirelessIcon} alt="bag" />
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}
          <div className="air-tickets-result-mobile-pricing">
            {!isPriceLoaded
              ? (!allElements ? <div className="price">Loading price...</div> : <div></div>)
              : <div className="price">{userInfo.isLogged && `${paymentInfo.currencySign} ${priceInSelectedCurrency}`}</div>
            }
            {isPriceLoaded && <div className="price">Total price: <LocPrice fiat={priceForLoc} /></div>}
            <div>
              {!isPriceLoaded && allElements
                ? <button disabled className="mobile-pricing-button">Unavailable</button>
                : <Link target={isMobile === false ? '_blank' : '_self'} className="mobile-pricing-button" to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>Book now</Link>
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
            : <Link target={isMobile === false ? '_blank' : '_self'} className="btn" to={`${redirectURL}/${id}${search.substr(0, endOfSearch)}`}>Book now</Link>
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
  exchangeRatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object,

  // Router props
  location: PropTypes.object,
};

export default withRouter(AirTicketsSearchResult);
