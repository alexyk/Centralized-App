import React from "react";
import { getStopName } from "../../../../common/flights/util";

export default class StopsFilter extends React.Component {
  render() {
    if (!this.props.filterOptions.changes) return null;
    return (
      <div className="filter-box">
        <div className="filter stops-filter">
          <h5>Stops</h5>
          <ul>
            {(this.props.filterOptions.changes || []).map((item, i) => {
              return (
                <li key={i}>
                  <label className="filter-label">
                    <input
                      data-testid={"stop-checkbox"}
                      type="checkbox"
                      className="filter-checkbox"
                      name="stops[]"
                      value={item.changesId}
                      onChange={this.props.handleSelectedStopsChange}
                    />
                    <span>{getStopName(item.changesId)}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
