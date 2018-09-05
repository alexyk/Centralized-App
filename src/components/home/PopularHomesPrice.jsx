import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class PopularHomesPrice extends Component {

  shouldComponentUpdate(nextProps) {
    if (nextProps.paymentInfo.currency !== this.props.paymentInfo.currency) {
      return true;
    }
    return false;
  }

  render() {
    const { paymentInfo, item } = this.props;
    const price = (item.prices) && paymentInfo.currency === item.currencyCode ? parseInt(item.defaultDailyPrice, 10).toFixed(2) : parseInt(item.prices[paymentInfo.currency], 10).toFixed(2);

    return (
      <div className="list-property-price">{paymentInfo.currencySign}{price} <span>(LOC {(price / paymentInfo.locRate).toFixed(2)})</span> per night</div>
    );
  }
}

PopularHomesPrice.propTypes = {
  item: PropTypes.object,

  // start Redux props
  paymentInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { paymentInfo } = state;
  return {
    paymentInfo
  };
}

export default connect(mapStateToProps)(PopularHomesPrice);