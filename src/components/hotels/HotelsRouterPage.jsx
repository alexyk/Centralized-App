import { Route, Switch, withRouter } from 'react-router-dom';

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import HotelDetailsPage from './details/HotelDetailsPage';
import HotelsBookingRouterPage from './book/HotelsBookingRouterPage';
import StaticHotelsSearchPage from './search/StaticHotelsSearchPage';

import { setCurrency } from '../../actions/paymentInfo';
import { getCurrency } from '../../selectors/paymentInfo';
import { connect } from 'react-redux';

function HotelsRouterPage(props) {
  const { location, history, currency } = props;
  const isMobile = location.pathname.indexOf('/mobile') !== -1;
  const showBackButton = location.pathname !== '/mobile/hotels/listings';

  return (
    <Fragment>
      <Switch>
        <Route exact path="/hotels/listings" render={() => <StaticHotelsSearchPage />} />
        <Route exact path="/hotels/listings/:id" render={() => <HotelDetailsPage />} />
        <Route path="/hotels/listings/book/:id" render={() => <HotelsBookingRouterPage />} />

        {/* MOBILE ONLY START */}
        <Route exact path="/mobile/hotels/listings" render={() => <StaticHotelsSearchPage />} />
        <Route exact path="/mobile/hotels/listings/:id" render={() => <HotelDetailsPage />} />
        <Route path="/mobile/hotels/listings/book/:id" render={() => <HotelsBookingRouterPage />} />
        {/* MOBILE ONLY END */}
      </Switch>

      {/* MOBILE ONLY START */}
      {isMobile &&
        <div className="container">
          {showBackButton && <button className="btn" style={{ 'width': '100%', 'marginBottom': '20px' }} onClick={() => history.goBack()}>Back</button>}
          <div className="select">
            <select
              className="currency"
              value={currency}
              style={{ 'height': '40px', 'margin': '10px 0', 'textAlignLast': 'right', 'paddingRight': '45%', 'direction': 'rtl' }}
              onChange={(e) => props.dispatch(setCurrency(e.target.value))}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
      }
      {/* MOBILE ONLY END */}
    </Fragment>
  );
}

HotelsRouterPage.propTypes = {
  // Router props
  location: PropTypes.object,
  history: PropTypes.object,

  // Redux props
  currency: PropTypes.string,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => {
  const { paymentInfo } = state;

  return {
    currency: getCurrency(paymentInfo)
  };
};

export default withRouter(connect(mapStateToProps)(HotelsRouterPage));
