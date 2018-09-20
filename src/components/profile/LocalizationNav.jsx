import React, { PureComponent, Fragment } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setCurrency } from '../../actions/paymentInfo';
import { CurrencyConverter } from '../../services/utilities/currencyConverter';
import { LocRateWebSocket } from '../../services/socket/locRateWebSocket';

import '../../styles/css/components/tabs-component.css';

const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class LocalizationNav extends PureComponent {
  constructor(props) {
    super(props);

    this.isSendMessage = false;
  }

  componentDidMount() {
    if (localStorage['currency']) {
      this.props.dispatch(setCurrency(localStorage['currency']));
    } else {
      localStorage['currency'] = this.props.paymentInfo.currency;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.exchangerSocketInfo.isLocRateWebsocketConnected && this.isSendMessage) {
      this.isSendMessage = false;
    }
    if (nextProps.exchangerSocketInfo.isLocRateWebsocketConnected && !this.isSendMessage) {
      this.isSendMessage = true;
      LocRateWebSocket.sendMessage(null, null, { currency: this.props.paymentInfo.currency, fiatAmount: this.props.locRateFiatAmount });
    }
    if (nextProps.locRateFiatAmount !== this.props.locRateFiatAmount) {
      LocRateWebSocket.sendMessage(null, 'unsubscribe');
      LocRateWebSocket.sendMessage(null, null, { currency: this.props.paymentInfo.currency, fiatAmount: nextProps.locRateFiatAmount });
    }
    if (nextProps.paymentInfo.currency !== this.props.paymentInfo.currency) {
      localStorage['currency'] = nextProps.paymentInfo.currency;
      LocRateWebSocket.sendMessage(null, null, { currency: nextProps.paymentInfo.currency, fiatAmount: this.props.locRateFiatAmount });
    }
  }

  componentWillUnmount() {
    LocRateWebSocket.sendMessage(null, 'unsubscribe');    
  }

  render() {
    const { currency } = this.props.paymentInfo;
    let { locRate } = this.props;
    const { locBalance, ethBalance, isLogged } = this.props.userInfo;

    return (
      <div className="container">
        <div className="source-data">
          <div className="info">
            {this.props.location.pathname !== '/hotels'
              && this.props.location.pathname !== '/homes'
              && (this.props.location.pathname.indexOf('/hotels/listings/book') === -1
              && this.props.location.pathname.indexOf('/homes/listings/book') === -1
              && this.props.location.pathname.indexOf('/profile') === -1)
              && this.props.location.pathname.indexOf('/airdrop') === -1
              && this.props.location.pathname.indexOf('/buyloc') === -1
              ? <ul className="tabset">
                <li><NavLink to='/hotels' activeClassName="active">HOTELS</NavLink></li>
                <li><NavLink to='/homes' activeClassName="active">HOMES</NavLink></li>
                <li><NavLink to='/buyloc' activeClassName="active">BUY LOC</NavLink></li>
              </ul>
              : <div className="sm-none">&nbsp;</div>
            }

            <div className="info-details">
              <div className="loc-rate">
                {locRate ?
                  <Fragment>
                    <span className="cross-rate">LOC/{currency} </span>
                    <span className="rate">{Number(locRate).toFixed(4)} {currency}</span>
                  </Fragment> : <div className="loader sm-none" style={{ width: '100px' }} ></div>
                }
              </div>

              {isLogged &&
                <div className="balance-info">
                  <div className="balance">
                    <div className="value">
                      <span>LOC Balance:&nbsp;</span>
                      <span>{locBalance}</span>
                    </div>
                  </div>
                  <div className="balance">
                    <div className="value">
                      <span>ETH Balance:&nbsp;</span>
                      <span>{ethBalance}</span>
                    </div>
                  </div>
                  {/* <a href="#" className="icon-plus"></a> */}
                </div>
              }

              <div className="select">
                <select className="language">
                  <option value="EN">EN</option>
                  {/* <option value="RU">RU</option>
                <option value="GE">GE</option> */}
                </select>
              </div>
              <div className="select">
                <select
                  className="currency"
                  value={this.props.paymentInfo.currency}
                  onChange={(e) => this.props.dispatch(setCurrency(e.target.value))}
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LocalizationNav.propTypes = {
  // Router props
  location: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object,
  exchangerSocketInfo: PropTypes.object,
  locRate: PropTypes.string,
  locRateFiatAmount: PropTypes.number,
};

function mapStateToProps(state) {
  const { paymentInfo, userInfo, currenciesRatesInfo, dynamicLocRatesInfo, exchangerSocketInfo, locAmountsInfo } = state;

  let locRate = dynamicLocRatesInfo.locRate && (dynamicLocRatesInfo.locRate).toFixed(4);
  const locRateFiatAmount = dynamicLocRatesInfo.fiatAmount;
  let locAmount;
  let fiat;

  if (exchangerSocketInfo.isLocRateWebsocketConnected) {
    locAmount = locAmountsInfo.locAmounts[locRateFiatAmount];
  } else {
    if (dynamicLocRatesInfo.locEurRate) {
      locAmount = locRateFiatAmount / dynamicLocRatesInfo.locEurRate;
    }
  }

  if (!dynamicLocRatesInfo.locRate || paymentInfo.currency !== localStorage['currency']) {
    fiat = currenciesRatesInfo.rates && CurrencyConverter.convert(currenciesRatesInfo.rates, DEFAULT_CRYPTO_CURRENCY, paymentInfo.currency, locRateFiatAmount);
  }

  if (fiat && locAmount) {
    dynamicLocRatesInfo.locRate = fiat / locAmount;
    locRate = (dynamicLocRatesInfo.locRate).toFixed(4);
  }

  return {
    paymentInfo,
    userInfo,
    exchangerSocketInfo,
    locRate,
    locRateFiatAmount
  };
}

export default withRouter(connect(mapStateToProps)(LocalizationNav));

