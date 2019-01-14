import '../../styles/css/components/footer/footer-component.css';

import { setCurrency } from '../../actions/paymentInfo';
import { getCurrency } from '../../selectors/paymentInfo';

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

class Footer extends React.Component {
  componentDidMount() {
    const { currency } = this.props;
    if (localStorage['currency']) setCurrency(localStorage['currency']);
    else localStorage['currency'] = currency;
  }

  componentDidUpdate(prevProps) {
    const prevCurrency = prevProps.currency;
    const { currency } = this.props;
    if (prevCurrency !== currency) {
      localStorage['currency'] = currency;
    }
  }

  render() {
    return (
      <footer id="footer">
        <div className="container">
          <div className="top-footer">
            <nav className="footer-nav">
              <ul>
                <li>
                  <ul>
                    <li>
                      <h5>LockTrip</h5>
                    </li>
                    <li><Link to="/help">Help</Link></li>
                    <li><a href="https://locktrip.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer">FAQ</a></li>
                    <li><a href="https://locktrip.zendesk.com/hc/en-us" target="_blank" rel="noopener noreferrer">Support</a></li>
                    <li><a href="https://locktrip.com/terms.html" target="_blank" rel="noopener noreferrer">Terms and Conditions</a></li>
                    <li><a href="https://locktrip.com/terms.html" target="_blank" rel="noopener noreferrer">Legal Information</a></li>
                    <li><a href="https://locktrip.com/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                    <li><Link to="/about">About Us</Link></li>
                  </ul>
                </li>
                <li>
                  <ul>
                    <li>
                      <h5>Hosting</h5>
                    </li>
                    <li><a href="# ">Why Host</a></li>
                    <li><a href="# ">Hospitality</a></li>
                    <li><a href="# ">Responsible Hosting</a></li>
                    <li><a href="# ">Community Center</a></li>
                  </ul>
                </li>
              </ul>
            </nav>
            <div className="language-and-currency">
              <div className="select">
                <select className="language" defaultValue="English">
                  <option value="English">English</option>
                </select>
              </div>
              <div className="select">
                <select className="currency"
                  value={this.props.currency}
                  onChange={(e) => this.props.dispatch(setCurrency(e.target.value))}
                >
                  <option value="EUR">Euro</option>
                  <option value="USD">US Dollar</option>
                  <option value="GBP">GB Pound</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bottom-footer">
            <span>LockTrip is owned and operated by LockChain Ltd., Bulgaria. </span>
            <span>Copyright &copy; 2018 LockTrip. </span>
            <span>All Rights Reserved. </span>
          </div>
        </div>
      </footer>
    );
  }
}

Footer.propTypes = {
  // Redux props
  dispatch: PropTypes.func,
  currency: PropTypes.string
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    currency: getCurrency(paymentInfo)
  };
}

export default withRouter(connect(mapStateToProps)(Footer));
