import { closeModal, openModal } from '../../../actions/modalsInfo.js';
import { setFlightType, setFlightClass, setFlightStops, setDepartureTime, setFlightOrigin, setFlightDestination, setDates, setAdults, setChildren } from '../../../actions/airTicketsSearchInfo';

import { AIR_TICKETS_CHILDREN } from '../../../constants/modals';
import AirTicketsChildrenModal from '../modals/AirTicketsChildrenModal';
import SearchBarDatePicker from '../../common/search/SearchBarDatePicker';
import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import requester from '../../../requester';
import { withRouter } from 'react-router-dom';

import '../../../styles/css/components/airTickets/search/air-tickets-search-bar.css';

function AirTicketsSearchBar(props) {
  if (props.location.pathname.indexOf('/mobile') !== -1) {
    return null;
  }

  const getRegions = (param) => {
    if (!param) {
      return Promise.resolve({ options: [] });
    }

    return requester.getRegionsBySearchParameter([`query=${param}`]).then(res => {
      return res.body.then(data => {
        return { options: data };
      });
    });
  };

  const getQueryString = () => {
    let queryString = '?';
    // queryString += 'region=' + props.airTicketsSearchInfo.region.id;
    // queryString += '&currency=' + props.paymentInfo.currency;
    // queryString += '&startDate=' + props.searchInfo.startDate.format('DD/MM/YYYY');
    // queryString += '&endDate=' + props.searchInfo.endDate.format('DD/MM/YYYY');
    // queryString += '&rooms=' + encodeURI(JSON.stringify(props.searchInfo.rooms));
    return queryString;
  };

  const handleSubmitModal = () => {
    props.redirectToSearchPage(getQueryString());
  };

  const openChildrenModal = (modal, e) => {
    if (e) {
      e.preventDefault();
    }

    props.dispatch(openModal(modal));
  };

  const closeChildrenModal = (modal, e) => {
    if (e) {
      e.preventDefault();
    }

    props.dispatch(closeModal(modal));
  };

  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (props.airTicketsSearchInfo.hasChildren) {
      openChildrenModal(AIR_TICKETS_CHILDREN);
    } else {
      props.redirectToSearchPage(getQueryString(), e);
    }
  };

  const departureTimes = [];

  const getDepartureTimes = () => {
    for (let i = 0; i < 24; i++) {
      departureTimes.push(i.toString());
    }
  };

  getDepartureTimes();

  return (
    <form className="air-tickets-form" onSubmit={handleSearch}>
      <div className="air-tickets-form-group-first">
        <div className="flight-type air-tickets-form-group-item">
          <input type="radio" id="roundTrip" name="flightType" value="roundTrip" onClick={e => props.dispatch(setFlightType(e.target.value))} checked={props.airTicketsSearchInfo.flightType === 'roundTrip'} />
          <label htmlFor="roundTrip">Round trip</label>
          <input type="radio" id="oneWay" name="flightType" value="oneWay" onClick={e => props.dispatch(setFlightType(e.target.value))} checked={props.airTicketsSearchInfo.flightType === 'oneWay'} />
          <label htmlFor="oneWay">One way</label>
          {/* <input type="radio" id="multiCity" name="flightType" value="multiCity" />
          <label htmlFor="multiCity">Multi city</label> */}
        </div>
        <div className="class-type air-tickets-form-group-item">
          <span>Ticket class: </span>
          <select name="classType" value={props.airTicketsSearchInfo.flightClass} onChange={e => props.dispatch(setFlightClass(e.target.value))}>
            <option value="any">any</option>
            <option value="economy">economy</option>
            <option value="business">business</option>
            <option value="first">first</option>
          </select>
        </div>
        <div className="flight-stops air-tickets-form-group-item">
          <span>Flight stops: </span>
          <select name="classType" value={props.airTicketsSearchInfo.flightStops} onChange={e => props.dispatch(setFlightStops(e.target.value))}>
            <option value="any">any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="departure-time air-tickets-form-group-item">
          <span>Departure time: </span>
          <select name="classType" value={props.airTicketsSearchInfo.departureTime} onChange={e => props.dispatch(setDepartureTime(e.target.value))}>
            <option value="any">any</option>
            {departureTimes.map((time) => {
              return <option value={time} key={time}>{time.padStart(2, 0)}:00</option>;
            })}
          </select>
        </div>
      </div>
      <div className="air-tickets-form-group-second air-tickets">
        <div className="air-tickets-select air-tickets-form-group-item">
          <Select.Async
            placeholder="Choose a origin"
            required
            style={{ boxShadow: 'none', border: 'none' }}
            value={props.airTicketsSearchInfo.flightOrigin}
            onChange={value => props.dispatch(setFlightOrigin(value))}
            valueKey={'id'}
            labelKey={'query'}
            loadOptions={getRegions}
            backspaceRemoves={true}
            arrowRenderer={null}
            onSelectResetsInput={false}
          />
        </div>
        <div className="air-tickets-select air-tickets-form-group-item">
          <Select.Async
            placeholder="Choose a destination"
            required
            style={{ boxShadow: 'none', border: 'none' }}
            value={props.airTicketsSearchInfo.flightDestination}
            onChange={value => props.dispatch(setFlightDestination(value))}
            valueKey={'id'}
            labelKey={'query'}
            loadOptions={getRegions}
            backspaceRemoves={true}
            arrowRenderer={null}
            onSelectResetsInput={false}
          />
        </div>

        <div className="check-wrap air-tickets-form-group-item">
          <AirTicketsChildrenModal
            isActive={props.modalsInfo.isActive[AIR_TICKETS_CHILDREN]}
            closeModal={closeChildrenModal}
            handleSubmit={handleSubmitModal}
          />
          <div className="check">
            <SearchBarDatePicker
              id='search-bar-date-picker'
              startDate={props.airTicketsSearchInfo.startDate}
              endDate={props.airTicketsSearchInfo.endDate}
              onApply={(e, picker) => props.dispatch(setDates(e, picker))}
            />
          </div>
        </div>

        <div className="guest-wrap guests air-tickets-form-group-item">

          <select name={'adults'} value={props.airTicketsSearchInfo.adults} onChange={e => props.dispatch(setAdults(e.target.value))}>
            <option value="1">1 adult</option>
            <option value="2">2 adults</option>
            <option value="3">3 adults</option>
            <option value="4">4 adults</option>
            <option value="5">5 adults</option>
            <option value="6">6 adult</option>
            <option value="7">7 adults</option>
            <option value="8">8 adults</option>
            <option value="9">9 adults</option>
            <option value="10">10 adults</option>
          </select>

          <div className="select-children" onClick={() => props.dispatch(setChildren())}>
            <div>
              {!props.airTicketsSearchInfo.hasChildren
                ? 'No children'
                : 'With children'
              }
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-search">Search</button>
      </div>
    </form>
  );
}

AirTicketsSearchBar.propTypes = {
  redirectToSearchPage: PropTypes.func,

  // start Router props
  location: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  airTicketsSearchInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  modalsInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { airTicketsSearchInfo, paymentInfo, modalsInfo } = state;
  return {
    airTicketsSearchInfo,
    paymentInfo,
    modalsInfo
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsSearchBar));
