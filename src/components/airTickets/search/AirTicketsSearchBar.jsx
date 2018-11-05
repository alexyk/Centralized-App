import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { closeModal, openModal } from '../../../actions/modalsInfo.js';
import { setFlightClass, setStops, setDepartureTime, setOrigin, setDestination, setAdults, setHasChildren } from '../../../actions/airTicketsSearchInfo';
import { AIR_TICKETS_CHILDREN } from '../../../constants/modals';
import AirTicketsChildrenModal from '../modals/AirTicketsChildrenModal';
import SelectFlex from '../../common/select';
import AirTicketsDatepickerWrapper from './AirTicketsDatepickerWrapper';
import { Config } from '../../../config';

import '../../../styles/css/components/airTickets/search/air-tickets-search-bar.css';

function AirTicketsSearchBar(props) {
  if (props.location.pathname.indexOf('/mobile') !== -1) {
    return null;
  }

  const requestAirports = (param) => {
    if (!param) {
      return Promise.resolve({ options: [] });
    }

    return fetch(`${Config.getValue('apiHost')}flight/city/search?query=${param}`, {
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => {
      return res.json().then(towns => {
        let options = [];
        towns.forEach(town => {
          town.airports.forEach(airport => {
            if (airport.code) {
              options.push({ code: airport.code, name: `${town.name}, ${town.cityState ? town.cityState + ', ' : ''}${town.countryName}, ${airport.code} airport` });
            }
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
    queryString += '&departureDate=' + props.searchDatesInfo.startDate.format('DD/MM/YYYY');
    if (props.airTicketsSearchInfo.flightRouting === '2') {
      queryString += '&arrivalDate=' + props.searchDatesInfo.endDate.format('DD/MM/YYYY');
    }
    queryString += '&adults=' + props.airTicketsSearchInfo.adultsCount;
    queryString += '&children=' + encodeURI(JSON.stringify(props.airTicketsSearchInfo.children));
    queryString += '&infants=' + props.airTicketsSearchInfo.infants;
    queryString += '&routing=' + props.airTicketsSearchInfo.flightRouting;
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

  return (
    <div className="air-tickets">
      <form className="air-tickets-form" onSubmit={handleSearch}>
        <div className="air-tickets-form-select">
          <Select.Async
            placeholder="Origin"
            required
            style={{ boxShadow: 'none', border: 'none' }}
            value={props.airTicketsSearchInfo.origin}
            onChange={value => props.dispatch(setOrigin(value))}
            valueKey={'code'}
            labelKey={'name'}
            loadOptions={requestAirports}
            backspaceRemoves={true}
            arrowRenderer={null}
            onSelectResetsInput={false}
          />
        </div>
        <div className="air-tickets-form-select">
          <Select.Async
            placeholder="Destination"
            required
            style={{ boxShadow: 'none', border: 'none' }}
            value={props.airTicketsSearchInfo.destination}
            onChange={value => props.dispatch(setDestination(value))}
            valueKey={'code'}
            labelKey={'name'}
            loadOptions={requestAirports}
            backspaceRemoves={true}
            arrowRenderer={null}
            onSelectResetsInput={false}
          />
        </div>
        <div className="air-tickets-form-check-wrap">
          <div className="check">
            <AirTicketsDatepickerWrapper />
          </div>
        </div>
        <div className="air-tickets-form-guest-wrap guests">
          <SelectFlex placeholder="Adults" className="select-adults" onChange={(value) => props.dispatch(setAdults(value))} value={props.airTicketsSearchInfo.adultsCount}>
            <select name={'adults'}>
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
          </SelectFlex>
          <div className="select-children" onClick={() => props.dispatch(setHasChildren())}>
            <div>
              {!props.airTicketsSearchInfo.hasChildren
                ? 'No children'
                : 'With children'
              }
            </div>
          </div>
        </div>
        <SelectFlex placeholder="Departure time" className="air-tickets-form-departure-time" onChange={(value) => props.dispatch(setDepartureTime(value))} value={props.airTicketsSearchInfo.departureTime}>
          <select name="departureTime">
            <option value="">any</option>
            <option value="0">00:00</option>
            <option value="1">01:00</option>
            <option value="2">02:00</option>
            <option value="3">03:00</option>
            <option value="4">04:00</option>
            <option value="5">05:00</option>
            <option value="6">06:00</option>
            <option value="7">07:00</option>
            <option value="8">08:00</option>
            <option value="9">09:00</option>
            <option value="10">10:00</option>
            <option value="11">11:00</option>
            <option value="12">12:00</option>
            <option value="13">13:00</option>
            <option value="14">14:00</option>
            <option value="15">15:00</option>
            <option value="16">16:00</option>
            <option value="17">17:00</option>
            <option value="18">18:00</option>
            <option value="19">19:00</option>
            <option value="20">20:00</option>
            <option value="21">21:00</option>
            <option value="22">22:00</option>
            <option value="23">23:00</option>
          </select>
        </SelectFlex>
        <SelectFlex placeholder="Flight stops" className="air-tickets-form-flight-stops" onChange={(value) => props.dispatch(setStops(value))} value={props.airTicketsSearchInfo.stops}>
          <select name="flightStops">
            <option value="-1">any</option>
            <option value="0">direct flight</option>
            <option value="1">one stop</option>
            <option value="2">more stops</option>
          </select>
        </SelectFlex>
        <SelectFlex placeholder="Flight class" className="air-tickets-form-flight-class" onChange={(value) => props.dispatch(setFlightClass(value))} value={props.airTicketsSearchInfo.flightClass}>
          <select name="flightClass">
            <option value="0">any</option>
            <option value="Y">economy</option>
            <option value="J">premium economy</option>
            <option value="C">business</option>
            <option value="F">first</option>
          </select>
        </SelectFlex>
        <button type="submit" className="btn btn-primary btn-search">Search</button>
      </form>
      <AirTicketsChildrenModal
        isActive={props.modalsInfo.isActive[AIR_TICKETS_CHILDREN]}
        closeModal={closeChildrenModal}
        handleSubmit={handleSubmitModal}
      />
    </div>
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
  searchDatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  modalsInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { airTicketsSearchInfo, searchDatesInfo, paymentInfo, modalsInfo } = state;

  return {
    airTicketsSearchInfo,
    searchDatesInfo,
    paymentInfo,
    modalsInfo
  };
}

export default withRouter(connect(mapStateToProps)(AirTicketsSearchBar));
