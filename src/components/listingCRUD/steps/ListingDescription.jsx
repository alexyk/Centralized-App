import React from 'react';
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';

import PlaceDescriptionAside from '../aside/PlaceDescriptionAside';
import ListingCrudNav from '../navigation/ListingCrudNav';
import Textarea from '../textbox/Textarea';
import FooterNav from '../navigation/FooterNav';

import '../../../styles/css/components/profile/listings/listing-description.scss';

import { INVALID_SUMMARY } from '../../../constants/warningMessages.js';
import { LONG } from '../../../constants/notificationDisplayTimes.js';

function ListingDescription(props) {
  const { text, interaction } = props.values;
  const next = validateInput(props.values) ? props.next : props.location.pathname;
  const handleClickNext = validateInput(props.values)
    ? () => { props.updateProgress(1); }
    : () => { showErrors(props.values); };
  return (
    <div>
      <ListingCrudNav progress='66%' />
      <div className="container">
        <div className="row">
          <div className="listings create">
            <div className="col-md-3">
              <PlaceDescriptionAside routes={props.routes} />
            </div>
            <div id="reservation-hotel-review-room" className="col-md-9">
              <h2>Tell your guests about your place</h2>
              <hr />

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Summary</label>
                    <Textarea
                      name="text"
                      value={text}
                      placeholder="Describe your place..."
                      rows={5}
                      onChange={props.onChange}
                    />
                  </div>
                </div>
                <div className="clearfix"></div>
              </div>

              <h2>Tell your guests about the neighborhood</h2>
              <hr />

              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>The neighborhood (optional)</label>
                    <Textarea
                      name="interaction"
                      value={interaction}
                      placeholder="Describe what's near by, how to get around, etc..."
                      rows={5}
                      onChange={props.onChange}
                    />
                  </div>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterNav next={next} prev={props.prev} handleClickNext={handleClickNext} step={6} />
    </div>
  );
}

function validateInput(values) {
  const { text } = values;
  if (text.length < 6) {
    return false;
  }

  return true;
}

function showErrors(values) {
  const { text } = values;
  if (text.length < 6) {
    NotificationManager.warning(INVALID_SUMMARY, '', LONG);
  }
}

ListingDescription.propTypes = {
  values: PropTypes.any,
  onChange: PropTypes.func,
  updateProgress: PropTypes.func,
  prev: PropTypes.string,
  next: PropTypes.string,
  routes: PropTypes.object,

  // Router props
  location: PropTypes.object,
};

export default withRouter(ListingDescription);
