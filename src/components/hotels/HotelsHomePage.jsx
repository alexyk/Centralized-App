import { getListings } from '../../requester';

import React from 'react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import HotelsSearchBar from './search/HotelsSearchBar';
import PopularListingsCarousel from '../common/listing/PopularListingsCarousel';
import ListingTypeNav from '../common/listingTypeNav/ListingTypeNav';

import { getTestHotels } from '../../requester';
import { testSearch } from '../../requester';
import { connect } from 'react-redux';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        let startDate = moment();
        let endDate = moment().add(1, 'day');

        this.state = {
            startDate: startDate,
            endDate: endDate,
            rooms: [{ adults: 1, children: [] }],
            listings: undefined,
            // region: { id: undefined, query: undefined },
            // country: '',
            // city: '',
            // state: '',
            // countryCode: '',
        };

        this.onChange = this.onChange.bind(this);
        this.handleRoomsChange = this.handleRoomsChange.bind(this);
        this.handleAdultsChange = this.handleAdultsChange.bind(this);
        this.handleChildrenChange = this.handleChildrenChange.bind(this);
        this.handleChildAgeChange = this.handleChildAgeChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDatePick = this.handleDatePick.bind(this);

        this.handleSelectRegion = this.handleSelectRegion.bind(this);
    }

    componentDidMount() {
        getTestHotels().then((data) => {
            this.setState({ listings: data.content });
        });
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSelectRegion(value) {
        this.setState({ region: value });
    }
    
    handleSearch(e) {
        e.preventDefault();

        let queryString = '?';

        queryString += 'region=' + this.state.region.id;
        queryString += '&startDate=' + this.state.startDate.format('DD/MM/YYYY');
        queryString += '&endDate=' + this.state.endDate.format('DD/MM/YYYY');
        queryString += '&rooms=' + encodeURI(JSON.stringify(this.state.rooms));

        this.props.history.push('hotels/listings' + queryString);
    }

    testCallBackend() {
        const currency = this.props.paymentInfo.currency;
        const rooms = this.state.rooms.map((room) => { 
            return {
                adults: room.adults,
                children: room.children.map((child) => {
                    return { age: child };
                })
            };
        });
        const location = `${this.state.country}, ${this.state.city}, ${this.state.state}, ${this.state.countryCode}`;
        const startDate = this.state.startDate.format('YYYY-MM-DD');
        const nights = this.state.endDate.diff(this.state.startDate, 'days');
        const search = {
            currency: currency,
            rooms: rooms,
            regionId: this.state.region.id,
            startDate: startDate,
            nights: nights
        };
    }
    
    handleDatePick(event, picker) {
        this.setState({
            startDate: picker.startDate,
            endDate: picker.endDate,
        });
    }

    handleRoomsChange(event) {
        let value = event.target.value;
        if (value < 1) {
            value = 1;
        } else if (value > 5) {
            value = 5;
        }
        let rooms = this.state.rooms.slice();
        if (rooms.length < value) {
            while (rooms.length < value) {
                rooms.push({ adults: 1, children: [] });
            }
        } else if (rooms.length > value) {
            rooms = rooms.slice(0, value);
        }
        
        this.setState({ rooms: rooms });
    }

    handleAdultsChange(event, roomIndex) {
        let value = event.target.value;
        let rooms = this.state.rooms.slice();
        rooms[roomIndex].adults = value;
        this.setState({ rooms: rooms });
    }

    handleChildrenChange(event, roomIndex) {
        let value = event.target.value;
        if (value > 10) {
            value = 10;
        }
        let rooms = this.state.rooms.slice();
        let children = rooms[roomIndex].children;
        if (children.length < value) {
            while (children.length < value) {
                children.push('');
            }
        } else if (children.length > value) {
            children = children.slice(0, value);
        }
        
        rooms[roomIndex].children = children;
        this.setState({ rooms: rooms });
    }

    handleChildAgeChange(event, roomIndex, childIndex) {
        const value = event.target.value;
        const rooms = this.state.rooms.slice();
        rooms[roomIndex].children[childIndex] = value;
        this.setState({ rooms: rooms });
    }
    
    render() {
        return (
            <div>
                <header id='main-nav' className="navbar home_page">
                    <div className="container">
                        <h1 className="home_title">Discover your next experience</h1>
                        <h2 className="home_title">Browse for homes &amp; hotels worldwide</h2>
                        <div className="container absolute_box">
                            <ListingTypeNav />
                            <HotelsSearchBar
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                region={this.state.region}
                                rooms={this.state.rooms}
                                guests={this.state.guests}
                                childrenCount={this.state.childrenCount}
                                childrenAges={this.state.childrenAges}
                                onChange={this.onChange}
                                handleAdultsChange={this.handleAdultsChange}
                                handleRoomsChange={this.handleRoomsChange}
                                handleChildrenChange={this.handleChildrenChange}
                                handleChildAgeChange={this.handleChildAgeChange}
                                handleSearch={this.handleSearch}
                                handleDatePick={this.handleDatePick}
                                handleSelectRegion={this.handleSelectRegion}
                            />
                        </div>
                    </div>
                </header>

                <section id="popular-hotels-box">
                    <h2>Popular Properties</h2>
                    {!this.state.listings ? <div className="loader"></div> : 
                        this.state.listings && this.state.listings.length > 1 &&
                        <PopularListingsCarousel 
                            listings={this.state.listings} 
                            listingsType="hotels" 
                        />
                    }
                    <div className="clearfix"></div>
                </section>
            </div>
        );
    }
}

export default withRouter(connect(mapStateToProps)(HomePage));

function mapStateToProps(state) {
    const { paymentInfo } = state;
    return {
        paymentInfo
    };
}