import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { CurrencyConverter } from '../../../services/utilities/currencyConverter';
import { RoomsXMLCurrency } from '../../../services/utilities/roomsXMLCurrency';
import LocPrice from '../../common/utility/LocPrice';

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

class AirTicketsSearchResult extends React.Component {
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

  render() {
    const { exchangeRatesInfo, paymentInfo, userInfo, price, result, allElements } = this.props;
    const { departureFlightIndex } = this.state;
    let { id } = result;
    console.log(result);

    const isPriceLoaded = !!price;
    const priceForLoc = exchangeRatesInfo.currencyExchangeRates && CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, result.pricesInfo.currency, RoomsXMLCurrency.get(), price);
    const priceInSelectedCurrency = exchangeRatesInfo.currencyExchangeRates && (CurrencyConverter.convert(exchangeRatesInfo.currencyExchangeRates, result.pricesInfo.currency, paymentInfo.currency, price)).toFixed(2);

    const isMobile = this.props.location.pathname.indexOf('mobile') !== -1;

    // TODO: add redirect path for mobile
    const redirectURL = this.props.location.pathname.indexOf('mobile') === -1
      ? '/tickets/results'
      : '/tickets/results';

    const search = this.props.location.search;
    const endOfSearch = search.indexOf('&filters=') !== -1 ? search.indexOf('&filters=') : search.length;

    return (
      <div className="result" >
        <div className="result-content">
          <form>
            {result.solutions.map((segment, index) => {
              return (
                <div key={index} className="flight">
                  <input className="item" type="radio" name="flight" value="0" onClick={this.handleFlightChange} defaultChecked={departureFlightIndex === 0} />
                  <div className="item">dates {segment.dayChange > 0 ? <div className="item">{segment.dayChange}</div> : ''}</div>
                  <div className="item">duration</div>
                  <div className="item">{segment.carrierName}</div>
                  <div className="item">airports</div>
                </div>
              );
            })}
          </form>
          <div className="result-mobile-pricing">
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
        </div>

        <div className="result-pricing">
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
