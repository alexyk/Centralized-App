import React from 'react';
import { NavLink } from 'react-router-dom';

import EditListingPlaceDescriptionAside from './EditListingPlaceDescriptionAside';
import NavEditListing from '../NavEditListing';

export default class EditListingTitle extends React.Component {
    render() {
        const { name } = this.props.values;
        return (
            <div>
                <NavEditListing progress='66%' />
                <div className="container">
                    <div className="row">
                        <div className="listings create">
                            <div className="col-md-3">
                                <EditListingPlaceDescriptionAside />
                            </div>
                            <div className="reservation-hotel-review-room col-md-9">
                                <h2>Give your place a name</h2>
                                <hr />

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <input onChange={this.props.updateTextbox}  placeholder="Listing title" className="form-control" name="name" value={name} />
                                    </div>
                                </div>

                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="navigation col-md-12">
                    <div className="col-md-3">
                    </div>
                    <div className="col-md-7">
                        <NavLink to="/profile/listings/edit/location" className="btn btn-default btn-back" id="btn-continue">
                            <i className="fa fa-long-arrow-left" aria-hidden="true"></i>
                            &nbsp;Back</NavLink>
                        <NavLink to="/profile/listings/edit/description" className="btn btn-primary btn-next" id="btn-continue">Next</NavLink>
                    </div>
                </div>
            </div>
        );
    }
}