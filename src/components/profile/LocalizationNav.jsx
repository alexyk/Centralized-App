import '../../styles/css/components/tabs-component.css';
import '../../styles/css/components/tabs-component.css';

import { NavLink, withRouter } from 'react-router-dom';
import React, { Component, Fragment } from 'react';
import { setCurrency, setLocRate, setLocRateInEur } from '../../actions/paymentInfo';

import { Config } from '../../config.js';
import { CurrencyConverter } from '../../services/utilities/currencyConverter';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import requester from '../../initDependencies';

const DEFAULT_EUR_AMOUNT = 1000;
const DEFAULT_CRYPTO_CURRENCY = 'EUR';
const SOCKET_RECONNECT_DELAY = 5000;

class LocalizationNav extends Component {
  constructor(props) {
    super(props);

    this.socket = null;
    this.shoudSocketReconnect = true;

    this.state = {
      rates: null,
      locAmount: null
    };

    this.calculateLocRate = this.calculateLocRate.bind(this);

    // SOCKET BINDINGS
    this.initializeSocket = this.initializeSocket.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
    this.handleReceiveMessage = this.handleReceiveMessage.bind(this);
    this.disconnectSocket = this.disconnectSocket.bind(this);
    this.socketClose = this.socketClose.bind(this);
  }

  componentDidMount() {
    const { currency } = this.props.paymentInfo;
    if (localStorage['currency']) setCurrency(localStorage['currency']);
    else localStorage['currency'] = currency;

    this.getRates();
    this.initializeSocket();
  }

  componentWillReceiveProps(nextProps) {
    const { currency } = nextProps.paymentInfo;
    if (currency !== this.props.paymentInfo.currency) {
      localStorage['currency'] = currency;

      const { locAmount } = this.state;
      if (locAmount && locAmount > 0) {
        this.setLocRateInRedux(DEFAULT_EUR_AMOUNT / locAmount, this.calculateLocRate(this.state.locAmount, currency));
      }
    }
  }

  componentWillUnmount() {
    this.disconnectSocket();
  }

  getRates() {
    requester.getCurrencyRates().then(res => {
      res.body.then(data => {
        this.setState({ rates: data });
      });
    });
  }

  getLocEurRate() {
    const { currency } = this.props.paymentInfo;

    requester.getLocRateByCurrency(DEFAULT_CRYPTO_CURRENCY).then(res => {
      res.body.then(data => {
        const locEurRate = data[0]['price_eur'];
        if (locEurRate && locEurRate !== 0) {
          this.setState({ locAmount: DEFAULT_EUR_AMOUNT / locEurRate }, () => {
            this.setLocRateInRedux(locEurRate, this.calculateLocRate(this.state.locAmount, currency));
          });
        }
      });
    });
  }

  calculateLocRate(locAmount, currency) {
    if (currency === 'EUR') {
      return DEFAULT_EUR_AMOUNT / locAmount;
    }
    const fiatAmount = this.state.rates && CurrencyConverter.convert(this.state.rates, DEFAULT_CRYPTO_CURRENCY, currency, DEFAULT_EUR_AMOUNT);
    return fiatAmount / locAmount;
  }

  setLocRateInRedux(locEurRate, locCurrentCurrencyRate) {
    this.props.dispatch(setLocRateInEur(locEurRate, false, 'Nav'));
    this.props.dispatch(setLocRate(locCurrentCurrencyRate, false, 'Nav'));
  }

  initializeSocket() {
    this.socket = new WebSocket(Config.getValue('SOCKET_HOST_PRICE'));
    this.socket.onmessage = this.handleReceiveMessage;
    this.socket.onopen = this.connectSocket;
    this.socket.onclose = this.socketClose;
  }

  connectSocket() {
    this.socket.send(JSON.stringify({ id: 'loc-rate', method: 'getLocPrice', params: { fiatAmount: DEFAULT_EUR_AMOUNT }}));
  }

  handleReceiveMessage(event) {
    const locAmount = (JSON.parse(event.data)).params.locAmount;

    if (locAmount && locAmount > 0) {
      this.setState({ locAmount });

      const locRateInEUR = this.calculateLocRate(locAmount, DEFAULT_CRYPTO_CURRENCY);
      const locCurrentCurrencyRate = this.calculateLocRate(locAmount, this.props.paymentInfo.currency);

      this.setLocRateInRedux(locRateInEUR, locCurrentCurrencyRate);
    }
  }

  disconnectSocket() {
    this.shoudSocketReconnect = false;
    if (this.socket) {
      this.socket.close();
    }
  }

  socketClose() {
    if (this.shoudSocketReconnect) {
      this.getLocEurRate();
      setTimeout(() => {
        this.initializeSocket();
      }, SOCKET_RECONNECT_DELAY);
    }
  }

  render() {
    const { currency } = this.props.paymentInfo;
    let { locRate } = this.props.paymentInfo;
    const { rates, locAmount } = this.state;
    const { locBalance, ethBalance, isLogged } = this.props.userInfo;

    if (!locRate && rates && locAmount && locAmount !== 0) {
      locRate = this.calculateLocRate(locAmount, currency);
    }

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
  userInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo, userInfo } = state;
  return {
    paymentInfo,
    userInfo
  };
}

export default withRouter(connect(mapStateToProps)(LocalizationNav));

