import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import { getStopName } from "../../../../common/flights/util";

import "../../../../../styles/css/components/airTickets/search/filter/air-tickets-search-filter-panel.css";

class FilterCheckbox extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(name, value) {
    this.setState(
      {
        [name]: value
      },
      () => {
        this.props.applyFilters(this.state);
      }
    );
  }

  render() {
    const { stops } = this.props;
    let items = [];

    Object.values(stops).map((item, i) => {
      items.push(
        <Fragment key={i}>
          <li>
            <label className="filter-label">
              <input
                data-testid={"stop-checkbox"}
                type="checkbox"
                className="filter-checkbox"
                name="stops[]"
                value={item.changesId}
                onChange={() => this.onChange("stops", item)}
              />
              <span>{getStopName(item.changesId)}</span>
            </label>
          </li>
        </Fragment>
      );
    });

    return (
      <div className="filter-box">
        <div className="filter stops-filter">
          <h5>Stops</h5>
          <ul>{items}</ul>
        </div>
      </div>
    );
  }
}

FilterCheckbox.propTypes = {
  stops: PropTypes.any,
  applyFilters: PropTypes.func
};

export default FilterCheckbox;
