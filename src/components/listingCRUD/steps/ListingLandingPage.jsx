import React from 'react';
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import FooterNav from '../navigation/FooterNav';

import ListingCrudNav from '../navigation/ListingCrudNav';

import { Config } from '../../../config';

import '../../../styles/css/components/profile/listings/listing-landing-page.scss';

import { COMMING_SOON, INVALID_TITLE } from '../../../constants/warningMessages.js';
import { LONG } from '../../../constants/notificationDisplayTimes.js';

function ListingLandingPage(props) {

  const { listingType, name } = props.values;
  const next = validateInput(props.values) ? props.next : props.location.pathname;
  const handleClickNext = validateInput(props.values)
    ? () => { props.updateProgress(1); }
    : () => { showErrors(props.values); };

  return (
    <div>
      <ListingCrudNav progress='33%' />
      <div className="container">
        <div id="listing-landing-page" className="row">
          <div className="listings create landing">
            <div className="listing-landing-page-left-part col-md-6">
              <img src={Config.getValue('basePath') + 'images/listing-illustration.png'} alt="listing-creation" className="left-poster" />
            </div>
            <div className="listing-landing-page-right-part col-md-6">
              <div className="column-container">
                <div>
                  <h4>STEP ONE</h4>
                </div>

                <div>
                  <h3>Give your place a name</h3>
                  {/* <hr /> */}
                </div>

                <div className="input-listing-title-container col-md-12">
                  <div className="form-group">
                    <input onChange={props.onChange} placeholder="Listing Title" name="name" value={name} />
                    <br />
                  </div>
                </div>

                <div className="place-listing-container">
                  <h3>What kind of place do you want to list?</h3>
                </div>
                <div className="form-group">
                  <div className="row">
                    <div className="house-laning-page dcol-md-12">
                      <label className="house custom-radio">
                        <input
                          type="radio"
                          onChange={(e) => props.onChange(e)}
                          name="listingType"
                          checked={listingType === '1'}
                          value="1" />
                        <span className="button"><img src={Config.getValue('basePath') + 'images/icon-check-japonica.png'} alt="radio-home" /></span>
                        <span>Home</span>
                      </label>
                      <label className="hotel custom-radio" >
                        <input
                          type="radio"
                          name="listingType"
                          checked={listingType === '2'}
                          value="2"
                          onClick={showComingSoonNotification} />
                        <span className="button"><img src={Config.getValue('basePath') + 'images/icon-check-japonica.png'} alt="radio-hotel" /></span>
                        <span>Hotel</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterNav next={next} handleClickNext={handleClickNext} step={1} />
    </div>
  );
}

function showComingSoonNotification() {
  NotificationManager.warning(COMMING_SOON, '', LONG);
}

function validateInput(values) {
  const { name } = values;
  if (name.length < 2) {
    return false;
  }

  return true;
}

function showErrors(values) {
  const { name } = values;
  if (name.length < 2) {
    NotificationManager.warning(INVALID_TITLE, '', LONG);
  }
}

ListingLandingPage.propTypes = {
  values: PropTypes.any,
  onChange: PropTypes.func,
  updateProgress: PropTypes.func,
  next: PropTypes.string,

  // Router props
  location: PropTypes.object
};

export default withRouter(ListingLandingPage);
