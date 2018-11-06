import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import queryString from 'query-string';
import { Config } from '../../../config';
import { setOrigin, setDestination, setAirTicketsSearchInfo } from '../../../actions/airTicketsSearchInfo';
import AirTicketsDetailsInfoSection from './AirTicketsDetailsInfoSection';
import AirTicketsSearchBar from '../search/AirTicketsSearchBar';

import '../../../styles/css/components/carousel-component.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

class AirTicketsDetailsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null
    };

    this.redirectToSearchPage = this.redirectToSearchPage.bind(this);
  }

  componentDidMount() {
    fetch(`http://localhost:8080/flight/selectFlight?flightId=${this.props.match.params.id}`)
      .then(res => {
        res.json().then((data) => {
          console.log(data);
        });
      });
    this.populateSearchBar();
    this.setState({
      result: this.props.location.state.result
    }, () => console.log(this.state.result));
  }

  redirectToSearchPage(queryString) {
    this.props.history.push('/tickets/results' + queryString);
  }

  getAirportInfo(airportCode) {
    return fetch(`http://localhost:8080/flight/city/search/${airportCode}`, {
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => {
      return new Promise((resolve, reject) => {
        if (res.ok) {
          res.json().then((data) => {
            resolve(data);
          });
        } else {
          res.json().then((errors) => {
            reject(errors);
          });
        }
      });
    });
  }

  populateAirports(origin, destination) {
    this.getAirportInfo(origin)
      .then((data) => {
        this.props.dispatch(setOrigin({ code: origin, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${origin} airport` }));
      });


    this.getAirportInfo(destination)
      .then((data) => {
        this.props.dispatch(setDestination({ code: destination, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${destination} airport` }));
      });
  }

  populateSearchBar() {
    if (this.props.location.search) {
      const searchParams = queryString.parse(this.props.location.search);
      const routing = searchParams.routing;
      const flightClass = searchParams.flightClass;
      const stops = searchParams.stops;
      const departureTime = searchParams.departureTime ? searchParams.departureTime : '';
      const origin = { id: searchParams.origin };
      const destination = { id: searchParams.destination };
      const departureDate = moment(searchParams.departureDate, 'DD/MM/YYYY');
      let arrivalDate = null;
      if (routing === '2') {
        arrivalDate = moment(searchParams.arrivalDate, 'DD/MM/YYYY');
      }
      const adultsCount = searchParams.adults;
      const children = JSON.parse(searchParams.children);
      const infants = searchParams.infants;
      const hasChildren = children.length !== 0 || infants > 0;
      const page = searchParams.page;

      this.props.dispatch(setAirTicketsSearchInfo(routing, flightClass, stops, departureTime, origin, destination, departureDate, arrivalDate, adultsCount, children, infants, hasChildren));

      this.populateAirports(searchParams.origin, searchParams.destination);

      this.setState({
        page: page ? Number(page) : 0,
      });
    }
  }

  render() {
    let loading;
    const { result } = this.state;

    if (result) {
      loading = true;
    }

    return (
      <div>
        <div className="container">
          <AirTicketsSearchBar redirectToSearchPage={this.redirectToSearchPage} />
        </div>

        {!loading ?
          <div className="loader"></div> :
          <div className="home-details-container">
            <nav className="hotel-nav" id="hotel-nav">
              <div className="hotel-nav-box">
                <div className="nav-box">
                  <ul className="nav navbar-nav">
                    <li><a href="#overview">Overview</a></li>
                    <li><a href="#facilities">Facilities</a></li>
                    <li><a href="#reviews">User Reviews</a></li>
                    <li><a href="#location">Location</a></li>
                  </ul>
                </div>
              </div>
            </nav>

            <AirTicketsDetailsInfoSection
              isLogged={this.props.userInfo.isLogged}
              openModal={this.openModal}
              result={this.state.result}
            />
          </div>
        }
      </div>
    );
  }
}

AirTicketsDetailsPage.propTypes = {
  match: PropTypes.object,

  // start Router props
  history: PropTypes.object,
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  paymentInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { userInfo, paymentInfo, airTickets } = state;
  return {
    userInfo,
    paymentInfo
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsDetailsPage));
