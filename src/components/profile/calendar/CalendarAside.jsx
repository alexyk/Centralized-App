import { Config } from '../../../config';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';
import moment from 'moment';

function CalendarAside(props) {
  return (
    <div className="col-md-4">
      <div className="calendar-aside">
        <div className="col-md-12 calendar-aside-header">
          <div className="col-md-10">
            <h3 className="bold">Settings - {moment(props.date).format('DD MMM')}</h3>
          </div>
          <div className="col-md-2">
            <button className="close" onClick={props.onCancel}>x</button>
          </div>
        </div>
        <div className="col-md-12 calendar-aside-body">
          <form onSubmit={(e) => { e.preventDefault(); this.captcha.execute(); }}>
            <div className="col-md-12">
              <h3 className="bold">Reservation Settings</h3>
            </div>
            <div className="col-md-12">
              <label className="radio-label" style={props.available === 'true' ? { backgroundColor: '#7BAAA2', color: '#FFFFFF' } : {}} htmlFor="available">Available</label>
              <input type="radio" name="available" onChange={props.onChange} value="true" checked={props.available === 'true'} id="available" />
              <label className="radio-label" style={props.available === 'false' ? { backgroundColor: '#7BAAA2', color: '#FFFFFF' } : {}} htmlFor="blocked">Blocked</label>
              <input type="radio" name="available" onChange={props.onChange} value="false" checked={props.available === 'false'} id="blocked" />
            </div>

            <div className="col-md-12">
              <h3 className="bold">Price Setting</h3>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon bold">{props.currencySign}</span>
                  <input type="number" className="form-control" name="price" onChange={props.onChange} value={props.price} />
                </div>
              </div>
              <p>Adjust your price for the night</p>
            </div>

            <ReCAPTCHA
              ref={el => this.captcha = el}
              size="invisible"
              sitekey={Config.getValue('recaptchaKey')}
              onChange={token => props.onSubmit(token)}
            />

            <div className="col-md-12 controls">
              <button className="btn btn-default btn-back bold" onClick={props.onCancel}>Cancel</button>
              <button className="btn btn-primary btn-next bold" type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
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