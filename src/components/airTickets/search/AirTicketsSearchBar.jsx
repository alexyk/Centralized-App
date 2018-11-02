import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { closeModal, openModal } from '../../../actions/modalsInfo.js';
import { setRouting, setFlightClass, setStops, setDepartureTime, setOrigin, setDestination, setDates, setAdults, setHasChildren } from '../../../actions/airTicketsSearchInfo';
import { AIR_TICKETS_CHILDREN } from '../../../constants/modals';
import AirTicketsChildrenModal from '../modals/AirTicketsChildrenModal';
import AirTicketsSearchBarDatePicker from './common/AirTicketsSearchBarDatePicker';
import AirTicketsSearchBarDatePickerSingle from './common/AirTicketsSearchBarDatePickerSingle';
// import requester from '../../../requester';
import { Config } from '../../../config';

import '../../../styles/css/components/airTickets/search/air-tickets-search-bar.css';

function AirTicketsSearchBar(props) {
  if (props.location.pathname.indexOf('/mobile') !== -1) {
    return null;
  }

  // TODO change logic with air tickets locations when backend is ready
  const getAirports = (param) => {
    if (!param) {
      return Promise.resolve({ options: [] });
    }

    return fetch(`${Config.getValue('apiHost')}flight/city?query=${param}`, {
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => {
      return res.json().then(towns => {
        let options = [];
        towns.forEach(town => {
          town.airports.forEach(airport => {
            options.push({ code: airport.code, name: `${town.name}, ${town.cityState ? town.cityState + ', ' : ''}${town.countryName}, ${airport.code} airport` });
          });
        });
        return { options };
      });
    });
  };

  const getQueryString = () => {
    let queryString = '?';

    queryString += 'origin=' + props.airTicketsSearchInfo.origin.code;
    queryString += '&destination=' + props.airTicketsSearchInfo.destination.code;
    queryString += '&departureDate=' + props.airTicketsSearchInfo.departureDate.format('DD/MM/YYYY');
    if (props.airTicketsSearchInfo.routing === '2') {
      queryString += '&arrivalDate=' + props.airTicketsSearchInfo.arrivalDate.format('DD/MM/YYYY');
    }
    queryString += '&adults=' + props.airTicketsSearchInfo.adultsCount;
    queryString += '&children=' + encodeURI(JSON.stringify(props.airTicketsSearchInfo.children));
    queryString += '&infants=' + props.airTicketsSearchInfo.infants;
    queryString += '&routing=' + props.airTicketsSearchInfo.routing;
    queryString += '&flightClass=' + props.airTicketsSearchInfo.flightClass;
    queryString += '&stops=' + props.airTicketsSearchInfo.stops;
    if (props.airTicketsSearchInfo.departureTime) {
      queryString += '&departureTime=' + props.airTicketsSearchInfo.departureTime;
    }

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
        <div className="routing air-tickets-form-group-item">
          <input type="radio" id="roundTrip" name="routing" value="2" onClick={e => props.dispatch(setRouting(e.target.value))} defaultChecked={props.airTicketsSearchInfo.routing === '2'} required />
          <label htmlFor="roundTrip">Round trip</label>
          <input type="radio" id="oneWay" name="routing" value="1" onClick={e => props.dispatch(setRouting(e.target.value))} defaultChecked={props.airTicketsSearchInfo.routing === '1'} required />
          <label htmlFor="oneWay">One way</label>
        </div>
        <div className="departure-time air-tickets-form-group-item">
          <span>Departure time: </span>
          <select name="classType" value={props.airTicketsSearchInfo.departureTime} onChange={e => props.dispatch(setDepartureTime(e.target.value))}>
            <option value="">any</option>
            {departureTimes.map((time) => {
              return <option value={time} key={time}>{time.padStart(2, 0)}:00</option>;
            })}
          </select>
        </div>
        <div className="flight-stops air-tickets-form-group-item">
          <span>Flight stops: </span>
          <select name="classType" value={props.airTicketsSearchInfo.stops} onChange={e => props.dispatch(setStops(e.target.value))}>
            <option value="-1">any</option>
            <option value="0">direct flight</option>
            <option value="1">one stop</option>
            <option value="2">one or more stops</option>
          </select>
        </div>
        <div className="class-type air-tickets-form-group-item">
          <span>Ticket class: </span>
          <select name="classType" value={props.airTicketsSearchInfo.flightClass} onChange={e => props.dispatch(setFlightClass(e.target.value))}>
            <option value="0">any</option>
            <option value="Y">economy</option>
            <option value="J">premium economy</option>
            <option value="C">business</option>
            <option value="F">first</option>
          </select>
        </div>
      </div>
      <div className="air-tickets-form-group-second air-tickets">
        <div className="air-tickets-select air-tickets-form-group-item">
          <Select.Async
            placeholder="Origin"
            required
            style={{ boxShadow: 'none', border: 'none' }}
            value={props.airTicketsSearchInfo.origin}
            onChange={value => props.dispatch(setOrigin(value))}
            valueKey={'code'}
            labelKey={'name'}
            loadOptions={getAirports}
            backspaceRemoves={true}
            arrowRenderer={null}
            onSelectResetsInput={false}
            ignoreCase={false}
          />
        </div>
        <div className="air-tickets-select air-tickets-form-group-item">
          <Select.Async
            placeholder="Destination"
            required
            style={{ boxShadow: 'none', border: 'none' }}
            value={props.airTicketsSearchInfo.destination}
            onChange={value => props.dispatch(setDestination(value))}
            valueKey={'code'}
            labelKey={'name'}
            loadOptions={getAirports}
            backspaceRemoves={true}
            arrowRenderer={null}
            onSelectResetsInput={false}
            ignoreCase={false}
          />
        </div>

        <div className="check-wrap air-tickets-form-group-item">
          <AirTicketsChildrenModal
            isActive={props.modalsInfo.isActive[AIR_TICKETS_CHILDREN]}
            closeModal={closeChildrenModal}
            handleSubmit={handleSubmitModal}
          />
          <div className="check">
            {props.airTicketsSearchInfo.routing === '1' ?
              <AirTicketsSearchBarDatePickerSingle
                departureDate={props.airTicketsSearchInfo.departureDate}
                onApply={(e, picker) => props.dispatch(setDates(e, picker))}
              /> :
              <AirTicketsSearchBarDatePicker
                departureDate={props.airTicketsSearchInfo.departureDate}
                arrivalDate={props.airTicketsSearchInfo.arrivalDate}
                onApply={(e, picker) => props.dispatch(setDates(e, picker))}
              />}
          </div>
        </div>

        <div className="guest-wrap guests air-tickets-form-group-item">

          <select name={'adults'} value={props.airTicketsSearchInfo.adultsCount} onChange={e => props.dispatch(setAdults(e.target.value))}>
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

          <div className="select-children" onClick={() => props.dispatch(setHasChildren())}>
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
  history: PropTypes.object,

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
