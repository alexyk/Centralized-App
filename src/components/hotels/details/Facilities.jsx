import '../../../styles/css/components/hotels/details/facilities.css';

import React from 'react';
import PropTypes from 'prop-types';
import { Config } from '../../../config';

class Facilities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showAllFacilities: false
    };

    this.toggleShowAllFacilities = this.toggleShowAllFacilities.bind(this);
  }

  toggleShowAllFacilities() {
    const { showAllFacilities } = this.state;
    this.setState({ showAllFacilities: !showAllFacilities });
  }

  render() {
    const { facilities } = this.props;

    if (!facilities || facilities.length === 0) {
      return null;
    }
    const mostPopularFacilities = facilities.filter(a => a.picture != null).splice(0, 5);
    const otherFacilities = facilities.filter(a => !mostPopularFacilities.includes(a));

    return (
      <div id="facilities">
        <h2>Facilities</h2>
        <hr />
        {mostPopularFacilities && mostPopularFacilities.length > 0 &&
          <div className="hotel-details__most-popular clearfix">
            {mostPopularFacilities.map((item, i) => {
              const text = item.text ? item.text : item.name;
              return (
                item.picture != null && (
                  <div key={i} className="most-popular__icon" tooltip={text}>
                    <span>
                      <img src={Config.getValue('imgHost') + item.picture} alt={text} />
                    </span>
                  </div>
                )
              );
            })}
            <div onClick={this.toggleShowAllFacilities} className="more-facilities">
              <p>+{otherFacilities.length}</p>
            </div>
          </div>
        }
        {this.state.showAllFacilities && <div className="hotel-details__facilities">
          {otherFacilities.map((facility, index) => {
            const text = facility.text ? facility.text : facility.name;
            return (<div key={index} className="hotel-details__facility">{text}</div>);
          })}
        </div>}
      </div>
    );
  };
}

Facilities.propTypes = {
  facilities: PropTypes.array
};

export default Facilities;