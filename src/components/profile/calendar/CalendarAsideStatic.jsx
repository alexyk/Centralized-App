import { Config } from '../../../config';
import PropTypes from 'prop-types';
import React from 'react';

import '../../../styles/css/components/profile/listings/calendar-aside-static/calendar-aside-static.css';

class CalendarAsideStatic extends React.Component {
  render() {
    return (
      <div className="calendar-aside-static">
        <h2>Adjust Your Prices</h2>
        <img src={Config.getValue('basePath') + 'images/price-statistic.png'} alt="price-statistic" />
        <p class="slot-sub-subtitle">Click on specific dates on the calendar to set custom rates and increase your revenue.</p>
        <div>
          <form onSubmit={(e) => { e.preventDefault(); this.props.updateDailyPrice(); }}>
            <h6 className="slot-subtitle">Default Daily Price</h6>
            <div className="price-setting">
              <div>{this.props.currencySign}</div>
              <input type="number" name="defaultDailyPrice" onChange={this.props.onChange} value={this.props.defaultDailyPrice} />
            </div>
            
            <div className="controls">
              <button className="save-control" type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

CalendarAsideStatic.propTypes = {
  currencySign: PropTypes.string,
  onChange: PropTypes.func,
  defaultDailyPrice: PropTypes.number,
  updateDailyPrice: PropTypes.func
};

export default CalendarAsideStatic;
