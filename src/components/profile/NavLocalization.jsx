import '../../styles/css/components/tabs-component.css';
import '../../styles/css/components/tabs-component.css';

import { NavLink, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { setCurrency, setLocRate, setLocRateInEur } from '../../actions/paymentInfo';

import { Config } from '../../config.js';
import { CurrencyConverter } from '../../services/utilities/currencyConverter';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import requester from '../../initDependencies';

const DEFAULT_EUR_AMOUNT = 1000;
const DEFAULT_CRYPTO_CURRENCY = 'EUR';

class NavLocalization extends Component {
  constructor(props) {
    super(props);

    this.socket = null;

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
  }

  componentDidMount() {
    const { currency, locRate } = this.props.paymentInfo;
    if (localStorage['currency']) setCurrency(localStorage['currency']);
    else localStorage['currency'] = currency;

    if (!locRate) this.initializeSocket();

    requester.getCurrencyRates().then(res => {
      res.body.then(data => {
        this.setState({ rates: data }, () => {
          this.props.dispatch(setLocRateInEur(DEFAULT_EUR_AMOUNT / this.state.locAmount, false, 'Nav'));
          this.props.dispatch(setLocRate(this.calculateLocRate(this.state.locAmount, currency), false, 'Nav'));
        });
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { currency } = nextProps.paymentInfo;
    if (currency !== this.props.paymentInfo.currency) {
      localStorage['currency'] = currency;

      this.props.dispatch(setLocRateInEur(DEFAULT_EUR_AMOUNT / this.state.locAmount, false, 'Nav'));
      this.props.dispatch(setLocRate(this.calculateLocRate(this.state.locAmount, currency), false, 'Nav'));
    }
  }

  componentWillUnmount() {
    this.disconnectSocket();
  }

  calculateLocRate(locAmount, currency) {
    const fiatAmount = this.state.rates && CurrencyConverter.convert(this.state.rates, DEFAULT_CRYPTO_CURRENCY, currency, DEFAULT_EUR_AMOUNT);
    return fiatAmount / locAmount;
  }

  initializeSocket() {
    this.socket = new WebSocket(Config.getValue('SOCKET_HOST_PRICE'));
    this.socket.onmessage = this.handleReceiveMessage;
    this.socket.onopen = this.connectSocket;
  }

  connectSocket() {
    this.socket.send(JSON.stringify({ fiatAmount: DEFAULT_EUR_AMOUNT }));
  }

  handleReceiveMessage(event) {
    const locAmount = (JSON.parse(event.data)).locAmount;
    this.setState({ locAmount });
    const locRateInEUR = this.calculateLocRate(locAmount, DEFAULT_CRYPTO_CURRENCY);
    const locRateInCurrentCurrency = this.calculateLocRate(locAmount, this.props.paymentInfo.currency);

    this.props.dispatch(setLocRate(locRateInCurrentCurrency, false, 'Nav'));
    this.props.dispatch(setLocRateInEur(locRateInEUR, false, 'Nav'));
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.close();
    }
  }

  render() {
    const { currency, locRate } = this.props.paymentInfo;
    const { locBalance, ethBalance, isLogged } = this.props.userInfo;
    if (!locRate) {
      return <div className="loader sm-none"></div>;
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
              ? <ul className="tabset">
                <li><NavLink to='/hotels' activeClassName="active">HOTELS</NavLink></li>
                <li><NavLink to='/homes' activeClassName="active">HOMES</NavLink></li>
                <li><NavLink to='/buyloc' activeClassName="active">BUY LOC</NavLink></li>
              </ul>
              : <div className="sm-none">&nbsp;</div>
            }

            <div className="info-details">
              <p className="loc-rate">
                <span className="cross-rate">LOC/{currency} </span>
                <span className="rate">{Number(locRate).toFixed(4)} {currency}</span>
              </p>

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
                  onChange={(e) => {
                    this.props.dispatch(setCurrency(e.target.value));
                    this.props.dispatch(setLocRate(this.calculateLocRate(this.state.locAmount, e.target.value), false, 'Nav'));
                  }}
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

NavLocalization.propTypes = {
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

export default withRouter(connect(mapStateToProps)(NavLocalization));

