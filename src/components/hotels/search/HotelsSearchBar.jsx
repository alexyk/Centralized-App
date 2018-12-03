import { closeModal, openModal } from '../../../actions/modalsInfo.js';
import { setAdults, setChildren, setRegion, setRooms, setRoomsByCountOfRooms } from '../../../actions/hotelsSearchInfo';

import { CHILDREN } from '../../../constants/modals';
import ChildrenModal from '../modals/ChildrenModal';
import PropTypes from 'prop-types';
import React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import { connect } from 'react-redux';
import requester from '../../../requester';
import { withRouter } from 'react-router-dom';
import Datepicker from '../../common/datepicker';
import moment from 'moment';

const customStyles = {
  container: (styles) => ({
    ...styles,
    flex: '1 1 0',
    outline: 'none',
  }),
  valueContainer: (styles) => ({
    ...styles,
    fontSize: '1.2em'
  }),
  input: (styles) => ({
    ...styles,
    outline: 'none',
  }),
  control: (styles) => ({
    ...styles,
    padding: '0 10px',
    cursor: 'pointer',
    boxShadow: 'none',
    border: 0,
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none'
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: '20px'
  }),
  option: (styles, { data, isFocused, isSelected }) => {
    const color = isSelected ? '#d87a61' : 'black';
    return {
      ...styles,
      fontSize: '1.2em',
      textAlign: 'left',
      cursor: 'pointer',
      backgroundColor: isFocused
        ? '#f0f1f3'
        : 'none',
      color: isSelected
        ? color
        : data.color,
      fontWeight: isSelected && '400',
      paddingLeft: isSelected && '30px',
    };
  },
};

function HotelsSearchBar(props) {
  if (props.location.pathname.indexOf('/mobile') !== -1) {
    return null;
  }

  const loadOptions = (input = '', callback) => {
    fetchCities(input).then(cities => callback(cities));
  };

  const fetchCities = (input = '') => {
    console.log(input)
    return requester.getRegionsBySearchParameter([`query=${input}`]).then(res => {
      return res.body.then(data => {
        if (!data) {
          return [];
        }
        console.log(data);

        return data.map(region => ({
          value: region.id,
          label: region.query
        }));
      });
    });
  };

  const changeRegion = (selectedOption) => {
    if (selectedOption) {
      const region = {
        id: selectedOption.value,
        query: selectedOption.label
      };

      props.dispatch(setRegion(region));
    }
  };

  const getQueryString = () => {
    let queryString = '?';
    queryString += 'region=' + props.hotelsSearchInfo.region.id;
    queryString += '&currency=' + props.paymentInfo.currency;
    queryString += '&startDate=' + props.searchDatesInfo.startDate.format('DD/MM/YYYY');
    queryString += '&endDate=' + props.searchDatesInfo.endDate.format('DD/MM/YYYY');
    queryString += '&rooms=' + encodeURI(JSON.stringify(props.hotelsSearchInfo.rooms));
    return queryString;
  };

  const handleSubmitModal = () => {
    props.search(getQueryString());
  };

  const distributeAdults = async () => {
    let adults = Number(props.hotelsSearchInfo.adults);
    let rooms = props.hotelsSearchInfo.rooms.slice(0);
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
      if (props.hotelsSearchInfo.hasChildren) {
        openChildrenModal(CHILDREN);
      } else {
        props.search(getQueryString(rooms), e);
      }
    });
  };

  const region = props.hotelsSearchInfo.region;
  let selectedOption = null;
  if (region) {
    selectedOption = {
      value: region.id,
      label: region.query
    };
  }

  return (
    <form className="source-panel" onSubmit={handleSearch}>
      <div className="select-wrap source-panel-item">
        <AsyncSelect
          styles={customStyles}
          value={selectedOption}
          onChange={changeRegion}
          loadOptions={loadOptions}
          backspaceRemoves={true}
          arrowRenderer={null}
          onSelectResetsInput={false}
          placeholder="Choose a location"
          required
        />
      </div>

      <div className="check-wrap source-panel-item">
        <ChildrenModal
          isActive={props.modalsInfo.isActive[CHILDREN]}
          closeModal={closeChildrenModal}
          handleSubmit={handleSubmitModal}
        />

        <div className="check">
          <Datepicker minDate={moment()} enableRanges />
        </div>

        <div className="days-of-stay">
          <span className="icon-moon"></span>
          <span>{props.searchDatesInfo.endDate.diff(props.searchDatesInfo.startDate, 'days')} nights</span>
        </div>
      </div>

      <div className="guest-wrap guests source-panel-item">
        <select className="guest-select " name={'rooms'} value={props.hotelsSearchInfo.rooms.length} onChange={e => props.dispatch(setRoomsByCountOfRooms(e.target.value))}>
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
        <select name={'adults'} value={props.hotelsSearchInfo.adults} onChange={e => props.dispatch(setAdults(e.target.value))}>
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
            {!props.hotelsSearchInfo.hasChildren
              ? 'No children'
              : 'With children'
            }
          </div>
        </div>
      </div>
      <button type="submit" className="button">Search</button>
    </form>
  );
}

HotelsSearchBar.propTypes = {
  search: PropTypes.func,

  // start Router props
  location: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  hotelsSearchInfo: PropTypes.object,
  searchDatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  modalsInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { hotelsSearchInfo, searchDatesInfo, paymentInfo, modalsInfo } = state;
  return {
    hotelsSearchInfo,
    searchDatesInfo,
    paymentInfo,
    modalsInfo
  };
}

export default withRouter(connect(mapStateToProps)(HotelsSearchBar));
