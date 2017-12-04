import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Breadcrumb from '../Breadcrumb';
import Filters from './Filters';
import Listing from './Listing';
import { getListingsByFilter } from '../../requester';

export default class ListingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listings: []
        }
    }

    componentDidMount() {
        getListingsByFilter().then(data => {
            this.setState({ listings: data.content })
        });
    };

    render() {
        return (
            <div>
                <Header />
                <Breadcrumb />
                <section id="hotel-box">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">
                                <Filters />
                            </div>
                            <div className="col-md-9">
                                <div className="list-hotel-box" id="list-hotel-box">
                                    {this.state.listings.map((item, i) => {
                                        return <Listing key={i} listing={item} />
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }
}