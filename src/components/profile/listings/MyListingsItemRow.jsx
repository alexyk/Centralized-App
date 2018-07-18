import { Link } from 'react-router-dom';
import ListingItemRatingBox from '../../../components/common/listing/ListingItemRatingBox';
import PropTypes from 'prop-types';
import React from 'react';
import { Config } from '../../../config';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';

function MyListingsItemRow(props) {
  return (
    <ProfileFlexContainer key={props.listing.id} styleClass={`flex-container-row ${props.styleClass}`}>
      <div className="flex-row-child toggle" />
      <div className="flex-row-child thumb">
        <span style={{ backgroundImage: `url(${Config.getValue('imgHost') + props.listing.thumbnail})` }}></span>
      </div>
      <div className="flex-row-child details">
        <Link to={'/homes/listings/' + props.listing.id}>{props.listing.name}</Link>
        <ListingItemRatingBox
          rating={props.listing.averageRating}
          reviewsCount={props.listing.reviewsCount}
        />
      </div>
      <div className="flex-row-child price">
        <span>{props.listing.defaultDailyPrice} {props.listing.currencyCode}</span>
      </div>
      <div className="flex-row-child edit">
        <Link to={`/profile/listings/edit/landing/${props.listing.id}`}>Edit Listing</Link>
      </div>
      <div className="flex-row-child calendar">
        {/* <input type="button" className="button" value="View Calendar"/> */}
        <Link to={'/profile/listings/calendar/' + props.listing.id}>View Calendar</Link>
      </div>
      <div className="flex-row-child remove" onClick={(e) => props.handleOpenDeleteListingModal(e, props.listing.id, props.listing.name, props.listing.state)}>
        <span />
      </div>
    </ProfileFlexContainer>
  );
}

MyListingsItemRow.propTypes = {
  listing: PropTypes.object,
  state: PropTypes.string,
  styleClass: PropTypes.string,
  filterListings: PropTypes.func,
  handleOpenDeleteListingModal: PropTypes.func
};

export default MyListingsItemRow;