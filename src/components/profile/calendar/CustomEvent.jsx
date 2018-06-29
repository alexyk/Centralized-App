import { OverlayTrigger, Popover } from 'react-bootstrap';

import { Config } from '../../../config';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

function CustomEvent(props) {
  const popoverClickRootClose = (
    <Popover id="popover-trigger-click-root-close" style={{ zIndex: 10000, color: '#000000' }}>
      <div className="event-popup">
        <div className="col-md-12 event-popup-header">
          <div className="col-md-3">
            <img src={Config.getValue('basePath') + 'images/user_img_small.png'} alt="guest-profile" />
          </div>
          <div className="col-md-9">
            <span>Guest: <span className="bold">{props.event.title}</span></span>
          </div>
        </div>
        <div className="col-md-12 event-popup-body">
          <p><span className="cnt block"><span className="text-green">{moment(props.event.start).format('DD')}</span> {moment(props.event.start).format('MMM')}, {moment(props.event.start).format('YYYY')} → <span className="text-d87a61">{moment(props.event.end).format('DD')}</span> {moment(props.event.end).format('MMM')}, {moment(props.event.start).format('YYYY')}</span></p>
          <br />
          <p className="text-align-left">{moment(props.event.end).diff(moment(props.event.start), 'days')} nights, {props.event.guests} guests</p>
          <p className="text-align-left price">{props.event.price} <span>payout</span></p>
        </div>
      </div>
    </Popover>
  );
  if (!props.event.isReservation) {
    return <div>{props.event.title}</div>;
  }
  return (
    <div>
      <OverlayTrigger id="help" trigger="click" rootClose container={this} placement="top" overlay={popoverClickRootClose}>
        <div>{props.event.title}</div>
      </OverlayTrigger>
    </div>
  );
}

CustomEvent.propTypes = {
  event: PropTypes.object
};

export default CustomEvent;