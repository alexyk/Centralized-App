import { Route, Switch, withRouter } from 'react-router-dom';

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import HotelDetailsPage from './details/HotelDetailsPage';
import HotelsBookingRouterPage from './book/HotelsBookingRouterPage';
import StaticHotelsSearchPage from './search/StaticHotelsSearchPage';

import { getCurrency } from '../../selectors/paymentInfo';
import { connect } from 'react-redux';
import { renderMobileFooter } from '../../services/utilities/mobileWebView';


function HotelsRouterPage(props) {
  return (
    <Fragment>
      <Switch>
        <Route exact path="/hotels/listings" render={() => <StaticHotelsSearchPage />} />
        <Route exact path="/hotels/listings/:id" render={() => <HotelDetailsPage />} />
        <Route path="/hotels/listings/book/:id" render={() => <HotelsBookingRouterPage />} />

        {/* MOBILE ONLY START - routes */}
        <Route exact path="/mobile/hotels/listings" render={() => <StaticHotelsSearchPage />} />
        <Route exact path="/mobile/hotels/listings/:id" render={() => <HotelDetailsPage />} />
        <Route path="/mobile/hotels/listings/book/:id" render={() => <HotelsBookingRouterPage />} />
        {/* MOBILE ONLY END - routes */}
      </Switch>

      {/* MOBILE ONLY START - footer */}
      { renderMobileFooter(props) }
      {/* MOBILE ONLY END - footer */}
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
