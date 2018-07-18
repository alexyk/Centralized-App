import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { connect } from 'react-redux';
import HotelsSearchBarDatePicker from './HotelsSearchBarDatePicker';
import ChildrenModal from '../modals/ChildrenModal';

import { setRegion, setDates, setRooms, setAdults, setChildren, setRoomsByCountOfRooms } from '../../../actions/searchInfo';
import { openModal, closeModal } from '../../../actions/modalsInfo.js';

import { CHILDREN } from '../../../constants/modals';

import { getRegionsBySearchParameter } from '../../../requester';

function HotelsSearchBar(props) {
  if (props.location.pathname.indexOf('/mobile') !== -1) {
    return null;
  }

  const getRegions = (param) => {
    if (!param) {
      return Promise.resolve({ options: [] });
    }

    return getRegionsBySearchParameter(param)
      .then((json) => {
        return { options: json };
      });
  };

  const getQueryString = () => {
    let queryString = '?';
    queryString += 'region=' + props.searchInfo.region.id;
    queryString += '&currency=' + props.paymentInfo.currency;
    queryString += '&startDate=' + props.searchInfo.startDate.format('DD/MM/YYYY');
    queryString += '&endDate=' + props.searchInfo.endDate.format('DD/MM/YYYY');
    queryString += '&rooms=' + encodeURI(JSON.stringify(props.searchInfo.rooms));
    return queryString;
  };

  const handleSubmitModal = () => {
    props.redirectToSearchPage(getQueryString());
  };

  const distributeAdults = async () => {
    let adults = Number(props.searchInfo.adults);
    let rooms = props.searchInfo.rooms.slice(0);
    if (adults < rooms.length) {
      rooms = rooms.slice(0, adults);
    }

    let index = 0;
    while (adults > 0) {
      // console.log(`${adults} / ${rooms.length - index} = ${Math.ceil(adults / (rooms.length - index))}`)
      const quotient = Math.ceil(adults / (rooms.length - index));
      rooms[index].adults = quotient;
      adults -= quotient;
      index++;
    }

    await props.dispatch(setRooms(rooms));

    return rooms;
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

    distributeAdults().then((rooms) => {
      if (props.searchInfo.hasChildren) {
        openChildrenModal(CHILDREN);
      } else {
        props.redirectToSearchPage(getQueryString(rooms), e);
      }
    });
  };

  return (
    <form className="source-panel" onSubmit={handleSearch}>
      <div className="source-panel-select source-panel-item">
        <Select.Async
          placeholder="Choose a location"
          required
          style={{ boxShadow: 'none', border: 'none' }}
          value={props.searchInfo.region}
          onChange={value => props.dispatch(setRegion(value))}
          valueKey={'id'}
          labelKey={'query'}
          loadOptions={getRegions}
          backspaceRemoves={true}
          arrowRenderer={null}
          onSelectResetsInput={false}
        />
      </div>

      <div className="check-wrap source-panel-item">
        <ChildrenModal
          isActive={props.modalsInfo.modals.get(CHILDREN)}
          closeModal={closeChildrenModal}
          handleSubmit={handleSubmitModal}
        />
        <div className="check">
          <HotelsSearchBarDatePicker
            id='search-bar-date-picker'
            startDate={props.searchInfo.startDate}
            endDate={props.searchInfo.endDate}
            onApply={(e, picker) => props.dispatch(setDates(e, picker))}
            nights={props.searchInfo.nights} />
        </div>

        <div className="days-of-stay">
          <span className="icon-moon"></span>
          <span>{props.searchInfo.nights} nights</span>
        </div>
      </div>

      <div className="guest-wrap guests source-panel-item">
        <select className="guest-select" name={'rooms'} value={props.searchInfo.rooms.length} onChange={e => props.dispatch(setRoomsByCountOfRooms(e.target.value))}>
          <option value="1">1 room</option>
          <option value="2">2 rooms</option>
          <option value="3">3 rooms</option>
          <option value="4">4 rooms</option>
          <option value="5">5 rooms</option>
          <option value="6">6 room</option>
          <option value="7">7 rooms</option>
          <option value="8">8 rooms</option>
          <option value="9">9 rooms</option>
          <option value="10">10 rooms</option>
        </select>

        <select name={'adults'} value={props.searchInfo.adults} onChange={e => props.dispatch(setAdults(e.target.value))}>
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
            {!props.searchInfo.hasChildren
              ? 'No children'
              : 'With children'
            }
          </div>
        </div>
      </div>
      <button type="submit" className="btn btn-primary btn-search">Search</button>
    </form>
  );
}

HotelsSearchBar.propTypes = {
  redirectToSearchPage: PropTypes.func,

  // start Router props
  location: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  searchInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  modalsInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { searchInfo, paymentInfo, modalsInfo } = state;
  return {
    searchInfo,
    paymentInfo,
    modalsInfo
  };
}

export default withRouter(connect(mapStateToProps)(HotelsSearchBar));
