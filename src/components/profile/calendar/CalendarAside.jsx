import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

class CalendarAside extends React.Component {
  render() {
    return (
      <div className="calendar-aside">
        <div className="calendar-aside-header">
          <h3>Settings - {moment(this.props.date).format('DD MMM')}</h3>
          <button onClick={this.props.onCancel}><i class="fa fa-times"></i></button>
        </div>
        <div className="calendar-aside-body">
          <form onSubmit={(e) => { e.preventDefault(); this.props.onSubmit(); }}>
            <h6 className="slot-title">Reservation Settings</h6>

            <label className="radio-label left" style={this.props.available === 'true' ? { backgroundColor: '#7BAAA2', color: '#FFFFFF' } : {}} htmlFor="available">Available</label>
            <input type="radio" name="available" onChange={this.props.onChange} value="true" checked={this.props.available === 'true'} id="available" />
            <label className="radio-label right" style={this.props.available === 'false' ? { backgroundColor: '#7BAAA2', color: '#FFFFFF' } : {}} htmlFor="blocked">Blocked</label>
            <input type="radio" name="available" onChange={this.props.onChange} value="false" checked={this.props.available === 'false'} id="blocked" />

            <h6 className="slot-subtitle">Price Setting</h6>
            <div className="price-setting">
              <div>{this.props.currencySign}</div>
              <input type="number" name="price" onChange={this.props.onChange} value={this.props.price} />
            </div>
            <p className="slot-sub-subtitle">Adjust your price for the night</p>

            <div className="controls">
              <button className="cancel-control" onClick={this.props.onCancel}>Cancel</button>
              <button className="save-control" type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

CalendarAside.propTypes = {
  date: PropTypes.instanceOf(Date),
  onCancel: PropTypes.func,
  available: PropTypes.string,
  onChange: PropTypes.func,
  currencySign: PropTypes.string,
  price: PropTypes.number,
  onSubmit: PropTypes.func
};

export default CalendarAside;
