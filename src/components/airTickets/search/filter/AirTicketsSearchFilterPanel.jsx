import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import NumberRangeSlider from "../../../common/numberRangeSlider";
import TimeRangeSlider from "react-time-range-slider";
import { getStopName } from "../../../common/flights/util";
import FilterCheckbox from "./FilterCheckbox";
import FilterSelect from "./FilterSelect";
import FiltersRangeSlider from "./FiltersRangeSlider";
import "../../../../styles/css/components/airTickets/search/filter/air-tickets-search-filter-panel.css";
import option from "eslint-plugin-jsx-a11y/src/util/implicitRoles/option";
import { timingSafeEqual } from "crypto";

class AirTicketsSearchFilterPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arrivalAirports: [],
      departureAirports: [],
      transferAirports: [],
      airlines: [],
      stops: [],
      arrivalAirports: [],
      priceRange: { min: 0, max: 10000 },
      waitingTimeRange: {
        start: '00:00',
        end: '23:59'
      },
      journeyTimeRange: {start: "00:00", end: "23:59"},
      arrivalTime: {start: "00:00", end: "23:59"},
      departureTime: {start: "00:00", end: "23:59"}
    };

    this.handleArrivalRange = this.handleArrivalRange.bind(this);
    this.handleDepartureRange = this.handleDepartureRange.bind(this);
    this.handleJourneyRange = this.handleJourneyRange.bind(this);
    this.handleWaitingTimeRange = this.handleWaitingTimeRange.bind(this);
    this.handlePriceRange = this.handlePriceRange.bind(this);
    this.clearFilters = this.clearFilters.bind(this);
  }

  componentDidMount() {

  }

  handleArrivalRange(arrivalTime) {
    this.setState({
      arrivalTime: arrivalTime
    });
  }

  handleDepartureRange(departureTime) {
    this.setState({
      departureTime: departureTime
    });
  }

  handleJourneyRange(journeyTimeRange) {
    this.setState({
      journeyTimeRange: journeyTimeRange
    });
  }

  handleWaitingTimeRange(waitingTimeRange) {
    this.setState({
      waitingTimeRange: waitingTimeRange
    });
  }

  handlePriceRange(priceRange) {
    this.setState({
      priceRange: priceRange
    });
  }

  clearFilters() {
    this.setState({

    });
  }

  render() {
    const { loading, filters, windowWidth, showFiltersMobile } = this.props;
    const {  priceRange, waitingTimeRange, arrivalTime, departureTime } = this.state;
    if (loading) {
      return (
        <div className="filter-box">
          <div className="form-group">
            <h6 className="filter-info">
              Search in progress, filtering will be possible after it is
              completed
            </h6>
          </div>
        </div>
      );
    }

    if (!filters) {
      return (
        <div className="filter-box">
          <div className="form-group">
            <h6 className="filter-info">
              No availbale filters for this search.
            </h6>
          </div>
        </div>
      );
    }

    if (windowWidth <= 1024 && !showFiltersMobile) {
      return (
        <div className="filter-box">
          <div onClick={this.props.handleShowFilters} className="show-filters">
            Show Filters
          </div>
        </div>
      );
    }
      return (
        <Fragment>
          <FilterCheckbox stops={filters.changes} applyFilters={this.props.applyFilters}/>
          <FilterSelect
            airlines={filters.airlines}
            transferAirports={filters.airports.arrivals}
            arrivalAirports={filters.airports.transfers}
            departureAirports={filters.airports.departures}
            applyFilters={this.props.applyFilters}
          />
          <FiltersRangeSlider
            priceRange={priceRange}
            waitingTimeRange={waitingTimeRange}
            departureTime={departureTime}
            arrivalTime={arrivalTime}
            applyFilters={this.props.applyFilters}
            handleArrivalRange={this.handleArrivalRange}
            handleDepartureRange={this.handleDepartureRange}
            handleJourneyRange={this.handleJourneyRange}
            handleWaitingTimeRange={this.handleWaitingTimeRange}
            handlePriceRange={this.handlePriceRange}
          />
        </Fragment>
      );
  }
}

AirTicketsSearchFilterPanel.propTypes = {
  loading: PropTypes.bool,
  filters: PropTypes.object,
  windowWidth: PropTypes.number,
  showFiltersMobile: PropTypes.bool,
  handleShowFilters: PropTypes.func,
  applyFilters: PropTypes.func
};

export default AirTicketsSearchFilterPanel;
