import { closeModal, openModal } from "../../../actions/modalsInfo.js";
import {
  setAdults,
  setChildren,
  setRegion,
  setRooms,
  setRoomsByCountOfRooms
} from "../../../actions/hotelsSearchInfo";
import { isActive } from "../../../selectors/modalsInfo.js";
import { getCurrency } from "../../../selectors/paymentInfo";
import { getStartDate, getEndDate } from "../../../selectors/searchDatesInfo";
import {
  getRooms,
  getAdults,
  getRegion,
  hasChildren
} from "../../../selectors/hotelsSearchInfo.js";

import { CHILDREN } from "../../../constants/modals";
import ChildrenModal from "../modals/ChildrenModal";
import PropTypes from "prop-types";
import React from "react";
import AsyncSelect from "react-select/lib/Async";
import { connect } from "react-redux";
import requester from "../../../requester";
import { withRouter } from "react-router-dom";
import Datepicker from "../../common/datepicker";
import moment from "moment";
import { NotificationManager } from "react-notifications";

const customStyles = {
  container: styles => ({
    ...styles,
    flex: "1 1 0",
    outline: "none"
  }),
  valueContainer: styles => ({
    ...styles,
    fontSize: "1.2em"
  }),
  input: styles => ({
    ...styles,
    outline: "none"
  }),
  control: styles => ({
    ...styles,
    padding: "0 10px",
    cursor: "pointer",
    boxShadow: "none",
    border: 0
  }),
  indicatorSeparator: styles => ({
    ...styles,
    display: "none"
  }),
  menu: styles => ({
    ...styles,
    marginTop: "20px"
  }),
  option: (styles, { data, isFocused, isSelected }) => {
    const color = isSelected ? "#d87a61" : "black";
    return {
      ...styles,
      fontSize: "1.2em",
      textAlign: "left",
      cursor: "pointer",
      backgroundColor: isFocused ? "#f0f1f3" : "none",
      color: isSelected ? color : data.color,
      fontWeight: isSelected && "400",
      paddingLeft: isSelected && "30px"
    };
  }
};

function HotelsSearchBar(props) {
  let select = null;

  if (props.location.pathname.indexOf("/mobile") !== -1) {
    return null;
  }

  const loadOptions = (input = "", callback) => {
    fetchCities(input).then(cities => callback(cities));
  };

  const fetchCities = (input = "") => {
    return requester
      .getRegionsBySearchParameter([`query=${input}`])
      .then(res => {
        return res.body.then(data => {
          if (!data) {
            return [];
          }

          return data.map(region => ({
            value: region.id,
            label: region.query
          }));
        });
      });
  };

  const changeRegion = selectedOption => {
    if (selectedOption) {
      const region = {
        id: selectedOption.value,
        query: selectedOption.label
      };

      props.dispatch(setRegion(region));
    }
  };

  const getQueryString = () => {
    const { region, rooms, currency, startDate, endDate } = props;
    let queryString = "?";
    queryString += "region=" + region.id;
    queryString += "&currency=" + currency;
    queryString += "&startDate=" + startDate.format("DD/MM/YYYY");
    queryString += "&endDate=" + endDate.format("DD/MM/YYYY");
    queryString += "&rooms=" + encodeURI(JSON.stringify(rooms));
    return queryString;
  };

  const handleSubmitModal = () => {
    props.search(getQueryString());
  };

  const distributeAdults = async () => {
    let adults = Number(props.adults);
    let rooms = props.rooms.slice(0);
    if (adults < rooms.length) {
      rooms = rooms.slice(0, adults);
    }

    let index = 0;
    while (adults > 0) {
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

  const handleSearch = e => {
    if (e) {
      e.preventDefault();
    }

    if (!props.region) {
      select.focus();
      NotificationManager.info("Please choose a location.");
    } else {
      distributeAdults().then(rooms => {
        if (props.hasChildren) {
          openChildrenModal(CHILDREN);
        } else {
          props.search(getQueryString(rooms), e);
        }
      });
    }
  };

  const region = props.region;
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
          ref={node => (select = node)}
          styles={customStyles}
          value={selectedOption}
          onChange={changeRegion}
          loadOptions={loadOptions}
          backspaceRemoves={true}
          arrowRenderer={null}
          onSelectResetsInput={false}
          placeholder="Choose a location"
          required={true}
        />
      </div>

      <div className="check-wrap source-panel-item">
        <ChildrenModal
          isActive={props.isActive[CHILDREN]}
          closeModal={closeChildrenModal}
          handleSubmit={handleSubmitModal}
        />

        <div className="check">
          <Datepicker minDate={moment()} enableRanges />
        </div>

        <div className="days-of-stay">
          <span className="icon-moon" />
          <span>{props.endDate.diff(props.startDate, "days")} nights</span>
        </div>
      </div>

      <div className="guest-wrap guests source-panel-item">
        <select
          className="guest-select "
          name={"rooms"}
          value={props.rooms.length}
          onChange={e => props.dispatch(setRoomsByCountOfRooms(e.target.value))}
        >
          <option value="1">1 room</option>
          <option value="2">2 rooms</option>
          <option value="3">3 rooms</option>
          <option value="4">4 rooms</option>
          <option value="5">5 rooms</option>
          {/*<option value="6">6 room</option>
          <option value="7">7 rooms</option>
          <option value="8">8 rooms</option>
          <option value="9">9 rooms</option>
          <option value="10">10 rooms</option>*/}
        </select>
        <select
          name={"adults"}
          value={props.adults}
          onChange={e => props.dispatch(setAdults(e.target.value))}
        >
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
        <div
          className="select-children"
          onClick={() => props.dispatch(setChildren())}
        >
          <div>{!props.hasChildren ? "No children" : "With children"}</div>
        </div>
      </div>
      <button type="submit" className="button">
        Search
      </button>
    </form>
  );
}

HotelsSearchBar.propTypes = {
  search: PropTypes.func,

  // start Router props
  location: PropTypes.object,

  // Redux props
  dispatch: PropTypes.func,
  rooms: PropTypes.array,
  adults: PropTypes.string,
  hasChildren: PropTypes.bool,
  region: PropTypes.object,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  currency: PropTypes.string,
  isActive: PropTypes.object
};

function mapStateToProps(state) {
  const { hotelsSearchInfo, searchDatesInfo, paymentInfo, modalsInfo } = state;

  return {
    rooms: getRooms(hotelsSearchInfo),
    adults: getAdults(hotelsSearchInfo),
    hasChildren: hasChildren(hotelsSearchInfo),
    region: getRegion(hotelsSearchInfo),
    startDate: getStartDate(searchDatesInfo),
    endDate: getEndDate(searchDatesInfo),
    currency: getCurrency(paymentInfo),
    isActive: isActive(modalsInfo)
  };
}

export default withRouter(connect(mapStateToProps)(HotelsSearchBar));
