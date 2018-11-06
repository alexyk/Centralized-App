import React, { PureComponent } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setCurrency } from '../../actions/paymentInfo';
import LocRate from '../common/utility/LocRate';

import '../../styles/css/components/tabs-component.css';

class LocalizationNav extends PureComponent {
  componentDidMount() {
    if (localStorage['currency']) {
      this.props.dispatch(setCurrency(localStorage['currency']));
    } else {
      localStorage['currency'] = this.props.paymentInfo.currency;
    }
  }

  render() {
    const { locBalance, ethBalance, isLogged } = this.props.userInfo;

    return (
      <div className="container">
        <div className="source-data">
          <div className="info">
            {this.props.location.pathname !== '/hotels'
              && this.props.location.pathname !== '/homes'
              && this.props.location.pathname !== '/tickets'
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
                <LocRate paymentInfo={this.props.paymentInfo} />
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

