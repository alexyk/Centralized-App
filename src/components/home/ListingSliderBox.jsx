import { Link } from 'react-router-dom';
import ListingPictures from '../listings/ListingPictures';
import ListingRating from '../listings/ListingRating';
import PropTypes from 'prop-types';
import React from 'react';

export default class ListingSliderBox extends React.Component {
    render() {
        const listingPrice = (this.props.listing.prices) && this.props.currency === this.props.listing.currencyCode ? parseInt(this.props.listing.defaultDailyPrice, 10).toFixed(2) : parseInt(this.props.listing.prices[this.props.currency], 10).toFixed(2);

        return (
            <div className="item active">
                <div className="list-property-small">
                    <div className="list-property-pictures">
                        <ListingPictures pictures={this.props.listing.pictures} id={this.props.listing.id} />
                    </div>
                    <div className="popular-list-data">
                        <h3><Link to={`/listings/${this.props.listing.id}`}>{this.props.listing.name}</Link></h3>
                        <ListingRating rating={this.props.listing.averageRating} reviewsCount={this.props.listing.reviewsCount} />
                    </div>
                    <div className="list-property-price">{this.props.currencySign}{listingPrice} <span>(LOC {(this.props.listing.defaultDailyPrice / this.props.locRate).toFixed(2)})</span></div>
                    <div className="clearfix">
                    </div>
                </div>
            </div>);
    }
}

ListingSliderBox.propTypes = {
    listing: PropTypes.object,
    currency: PropTypes.string,
    currencySign: PropTypes.string,
    locRate: PropTypes.number
};