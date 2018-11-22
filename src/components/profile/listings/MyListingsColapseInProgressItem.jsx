import { Config } from '../../../config';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import DefaultBackground from '../../../styles/images/silver_background.png';

import '../../../styles/css/components/profile/listings/my-listings-page.scss';

function MyListingsColapseInProgressItem(props) {
  return (
    <ProfileFlexContainer key={props.listing.id} styleClass={`flex-container-row ${props.styleClass} in-progress`}>
      {props.isExpand ? <div className="flex-row-child toggle in-progress" onClick={() => props.collapse()}><span className="fa fa-angle-down" /></div> : <div className="flex-row-child toggle in-progress" onClick={() => props.expand()}><span className="fa fa-angle-right" /></div>}
      <div className="flex-row-child thumb in-progress">
        {props.listing.thumbnail ?
          <img className="thumb-image" src={Config.getValue('imgHost') + props.listing.thumbnail} alt="listing-thumb" /> :
          <img className="thumb-image" src={DefaultBackground} alt="default-thumb" />}
      </div>
      <div className="flex-row-child details in-progress">
        <div className="content-row">
          <div className="name">
            {props.listing.name}
          </div>
          {/* <div className="last-update-date">Last updated on Oct 21, 2017</div> */}
        </div>
      </div>
      <div className="flex-row-child publish in-progress">
      </div>
      <div className="flex-row-child preview in-progress">
        <Link to={`/profile/listings/edit/landing/${props.id}?progress=${props.step}`}>Preview</Link>
      </div>
      <div className="flex-row-child remove in-progress" onClick={() => props.deleteInProgressListing(props.id)}>
        <span />
        <div className="delete">Remove</div>
      </div>
    </ProfileFlexContainer>
  );
}

MyListingsColapseInProgressItem.propTypes = {
  step: PropTypes.number,
  id: PropTypes.number,
  isExpand: PropTypes.bool,
  listing: PropTypes.object,
  styleClass: PropTypes.string,
  deleteInProgressListing: PropTypes.func,
  expand: PropTypes.func,
  collapse: PropTypes.func
};

export default MyListingsColapseInProgressItem;