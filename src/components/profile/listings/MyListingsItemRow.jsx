import { Link } from 'react-router-dom';
import ListingItemRatingBox from '../../../components/common/listing/ListingItemRatingBox';
import PropTypes from 'prop-types';
import React from 'react';
import { Config } from '../../../config';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';
import DefaultBackground from '../../../styles/images/silver_background.png';

import '../../../styles/css/components/profile/listings/my-listings-page.css';

function MyListingsItemRow(props) {
  return (
    <ProfileFlexContainer key={props.listing.id} styleClass={`flex-container-row ${props.styleClass} finished`}>
      <div className="flex-row-child toggle"></div>
      <div className="flex-row-child thumb finished">
        {props.listing.thumbnail ?
          <img className="thumb-image" src={Config.getValue('imgHost') + props.listing.thumbnail} alt="listing-thumb" /> :
          <img className="thumb-image" src={DefaultBackground} alt="default-thumb" />}
      </div>
      <div className="flex-row-child details finished">
        <div className="content-row">
          <div className="name">
            <Link to={'/homes/listings/' + props.listing.id}>{props.listing.name}</Link>
          </div>
          <ListingItemRatingBox
            rating={props.listing.averageRating}
            reviewsCount={props.listing.reviewsCount}
          />
        </div>
      </div>
      <div className="flex-row-child price finished">
        <span>{props.listing.defaultDailyPrice} {props.listing.currencyCode}</span>
      </div>
      <div className="flex-row-child edit finished">
        <Link to={`/profile/listings/edit/landing/${props.listing.id}`}>Edit Listing</Link>
      </div>
      <div className="flex-row-child calendar finished">
        <Link to={'/profile/listings/calendar/' + props.listing.id}>View Calendar</Link>
      </div>
      <div className="flex-row-child remove finished" onClick={(e) => props.handleOpenDeleteListingModal(e, props.listing.id, props.listing.name, props.listing.state)}>
        <span />
        <div className="delete">Remove Listing</div>
      </div>
    </ProfileFlexContainer>
  );
}

MyListingsItemRow.propTypes = {
  listing: PropTypes.object,
  styleClass: PropTypes.string,
  handleOpenDeleteListingModal: PropTypes.func
};

export default MyListingsItemRow;