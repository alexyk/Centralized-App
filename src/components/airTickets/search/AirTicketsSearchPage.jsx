import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import moment from 'moment';
import AirTicketsSearchBar from './AirTicketsSearchBar';
import { setAirTicketsSearchInfo } from '../../../actions/airTicketsSearchInfo';

class AirTicketsSearchPage extends Component {
  constructor(props) {
    super(props);

    this.populateSearchBar();

    this.state = {

    };
  }

  populateSearchBar() {
    if (this.props.location.search) {
      const searchParams = queryString.parse(this.props.location.search);
      console.log(searchParams);
      const routing = searchParams.routing;
      const clazz = searchParams.class;
      const stops = searchParams.stops;
      const departureTime = searchParams.departureTime ? searchParams.departureTime : '';
      const origin = searchParams.origin;
      const destination = searchParams.destination;
      const startDate = moment().add(1, 'day');
      const endDate = moment().add(2, 'day');
      const adultsCount = searchParams.adults;
      const children = searchParams.children;
      const infants = searchParams.infants;
      const hasChildren = searchParams.children.length;
      const page = searchParams.page;

      this.props.dispatch(setAirTicketsSearchInfo(routing, clazz, stops, departureTime, origin, destination, startDate, endDate, adultsCount, children, infants, hasChildren));

      // this.setState({
      //   nights: endDate.diff(startDate, 'days'),
      //   page: page ? Number(page) : 0,
      // });

      // this.getCityLocation(regionId);
    }
  }

  render() {
    return (
      <div className="container">
        <AirTicketsSearchBar />
      </div>
    );
  }
}

AirTicketsSearchPage.propTypes = {
  // Router props
  location: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func
};

// const mapStateToProps = (state) => {

// };

export default withRouter(connect()(AirTicketsSearchPage));