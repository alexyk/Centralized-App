import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import queryString from 'query-string';
import { Config } from '../../../../config';
import { setOrigin, setDestination, setAirTicketsSearchInfo } from '../../../../actions/airTicketsSearchInfo';
import { asyncSetStartDate, asyncSetEndDate } from '../../../../actions/searchDatesInfo';
import AirTicketsDetailsInfoSection from './AirTicketsDetailsInfoSection';
import AirTicketsSearchBar from '../../search/AirTicketsSearchBar';
import BookingSteps from '../../../common/bookingSteps';
import { isLogged } from '../../../../selectors/userInfo';

class AirTicketsDetailsPage extends Component {
  constructor(props) {
    super(props);

    this.searchAirTickets = this.searchAirTickets.bind(this);
  }

  componentDidMount() {
    this.populateSearchBar();
  }

  requestAirportInfo(airportCode) {
    return fetch(`${Config.getValue('apiHost')}flight/city/airports/${airportCode}`, {
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
    this.requestAirportInfo(origin)
      .then((data) => {
        this.props.dispatch(setOrigin({ code: origin, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${origin} airport` }));
      });

    this.requestAirportInfo(destination)
      .then((data) => {
        this.props.dispatch(setDestination({ code: destination, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${destination} airport` }));
      });
  }

  populateSearchBar() {
    if (this.props.location.search) {
      const searchParams = queryString.parse(this.props.location.search);

      const destinations = JSON.parse(searchParams.destinations);
      const flightRouting = searchParams.routing;
      const origin = { id: destinations[0].origin };
      const destination = { id: destinations[0].destination };
      const departureDate = moment(destinations[0].date, 'DD/MM/YYYY');
      let returnDate = moment(departureDate, 'DD/MM/YYYY');
      if (flightRouting === '2') {
        returnDate = moment(destinations[1].date, 'DD/MM/YYYY');
      } else if (flightRouting === '3') {
        returnDate = moment(destinations[1].date, 'DD/MM/YYYY');
        destinations.shift();
      }
      destinations.forEach((destination) => {
        this.requestAirportInfo(destination.origin)
          .then((data) => {
            destination.origin = { code: data.code, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${data.code} airport` };
          });
        this.requestAirportInfo(destination.destination)
          .then((data) => {
            destination.destination = { code: data.code, name: `${data.cityName}, ${data.cityState ? data.cityState + ', ' : ''}${data.countryName}, ${data.code} airport` };
          });
        destination.date = moment(destination.date, 'DD/MM/YYYY');
      });
      const flightClass = searchParams.flightClass;
      const stops = searchParams.stops;
      const departureTime = searchParams.departureTime ? searchParams.departureTime : '';
      const adultsCount = searchParams.adults;
      const children = JSON.parse(searchParams.children);
      const page = searchParams.page;
      const flexSearch = searchParams.flexSearch === true;

      this.props.dispatch(asyncSetStartDate(departureDate));
      this.props.dispatch(asyncSetEndDate(returnDate));
      this.props.dispatch(setAirTicketsSearchInfo(flightRouting, flightClass, stops, departureTime, origin, destination, adultsCount, children, flexSearch, destinations));

      this.populateAirports(origin.id, destination.id);

      this.setState({
        page: page ? Number(page) : 0,
      });
    }
  }

  searchAirTickets(queryString) {
    this.props.history.push('/tickets/results' + queryString);
  }

  render() {
    const { result, fareRules, brandInfo, supplierInfo, isUserLogged } = this.props;

    return (
      <div>
        <div className="container">
          <AirTicketsSearchBar search={this.searchAirTickets} />
        </div>
        <BookingSteps steps={['Search', 'Details', 'Prepare Booking', 'Confirm & Pay']} currentStepIndex={1} />
        <div className="home-details-container">
          <AirTicketsDetailsInfoSection
            isLogged={isUserLogged}
            openModal={this.openModal}
            result={result}
            fareRules={fareRules}
            brandInfo={brandInfo}
            supplierInfo={supplierInfo}
          />
        </div>
      </div>
    );
  }
}

AirTicketsDetailsPage.propTypes = {
  result: PropTypes.object,
  fareRules: PropTypes.array,
  brandInfo: PropTypes.array,
  supplierInfo: PropTypes.array,

  // start Router props
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,

  // start Redux props
  dispatch: PropTypes.func,
  isUserLogged: PropTypes.bool
};

function mapStateToProps(state) {
  const { userInfo } = state;

  return {
    isUserLogged: isLogged(userInfo)
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsDetailsPage));
