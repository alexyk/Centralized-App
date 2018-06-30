import { Link } from 'react-router-dom';
import ListingItemRatingBox from '../../../components/common/listing/ListingItemRatingBox';
import PropTypes from 'prop-types';
import React from 'react';
import { Config } from '../../../config';

function MyListingsActiveItem(props) {
  return (
    <div>
      <ul className='profile-mylistings-active'>
        <li className="toggle off"></li>
        <li className="thumb"><span
          style={{ backgroundImage: `url(${Config.getValue('imgHost') + props.listing.thumbnail})` }}></span></li>
        <li className="details">
          <Link to={'/homes/listings/' + props.listing.id}>{props.listing.name}</Link>
          <ListingItemRatingBox
            rating={props.listing.averageRating}
            reviewsCount={props.listing.reviewsCount}
          />
        </li>
        <li className="price">
          <span>{props.listing.defaultDailyPrice} {props.listing.currencyCode}</span>
        </li>
        <li className="edit">
          <Link to={`/profile/listings/edit/landing/${props.listing.id}`}>Edit Listing</Link>
        </li>
        <li className="calendar">
          {/* <input type="button" className="button" value="View Calendar"/> */}
          <Link to={'/profile/listings/calendar/' + props.listing.id}>View Calendar</Link>
        </li>
        <li className="remove" onClick={(e) => props.handleOpenDeleteListingModal(e, props.listing.id, props.listing.name, props.listing.state)}>
          <span></span>
        </li>
      </ul>
    </div>
  );
}

MyListingsActiveItem.propTypes = {
  listing: PropTypes.object,
  state: PropTypes.string,
  filterListings: PropTypes.func
};

export default MyListingsActiveItem;