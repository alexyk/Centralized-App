// import { DropdownButton, MenuItem } from 'react-bootstrap';

import { setCurrency } from '../../actions/paymentInfo';
import { getCurrency } from '../../selectors/paymentInfo';

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

class AttachedFooter extends React.Component {
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
      <footer id="attached-footer" className="navbar navbar-fixed-bottom">
        <div className="container">
          <div className="row">

            <div className="col-md-3"></div>

            <div className="col-md-3"></div>

            <div className="col-md-2"></div>

            <div className="col-md-2">
              <div className="dropdown select-language">
                <a className="dropdown-toggle" data-toggle="dropdown">English newest</a>
                <ul className="navbar-dropdown dropdown-menu">
                  <li><a >English</a></li>
                  <li><a >English</a></li>
                </ul>
              </div>
            </div>

            <div className="col-md-2">
              <select
                onChange={(e) => this.props.dispatch(setCurrency(e.target.value))}
                value={this.props.currency}
                className="currency-switcher">
                <option value="GBP">£ GBP</option>
                <option value="EUR">€ EUR</option>
                <option value="USD">$ USD</option>
              </select>

              {/* <DropdownButton block={true} title={localStorage['currency'] ? localStorage['currency'] : 'USD'} id="bg-nested-dropdown">
                                <MenuItem onClick={() => this.toggleCurrency('GBP')}>£ GBP</MenuItem>
                                <MenuItem onClick={() => this.toggleCurrency('EUR')}>€ EUR</MenuItem>
                                <MenuItem onClick={() => this.toggleCurrency('USD')}>$ USD</MenuItem>
                            </DropdownButton> */}
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

AttachedFooter.propTypes = {
  // start Redux props
  dispatch: PropTypes.func,
  currency: PropTypes.string
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    currency: getCurrency(paymentInfo)
  };
}

export default connect(mapStateToProps)(AttachedFooter);