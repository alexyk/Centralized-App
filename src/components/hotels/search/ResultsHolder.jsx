import '../../../styles/css/components/search-result-component.css';

import PropTypes from 'prop-types';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Result from './Result';
import _ from 'lodash';

function ResultsHolder(props) {

  if (!props.hotels) {
    return;
  }

  if (props.hotels && props.hotels.length === 0 && props.loading) {
    return <div className="text-center"><h2 style={{ margin: '80px 0' }}>Looking for the best rates for your trip...</h2></div>;
  }

  if (props.hotels && props.hotels.length === 0 && !props.loading) {
    return <div className="text-center"><h2 style={{ margin: '80px 0' }}>No Results</h2></div>;
  }

  return (
    <div className="results-holder">
      <ReactCSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}>
        {_.map(props.hotels, (hotel, index) => {
          return (<Result key={index} hotel={hotel} locRate={props.locRate} rates={props.rates} nights={props.nights} allElements={props.allElements} price={hotel.price} />);
        })}
      </ReactCSSTransitionGroup>
    </div>
  );
}

ResultsHolder.propTypes = {
  hotels: PropTypes.any,
  locRate: PropTypes.number,
  rates: PropTypes.object,
  nights: PropTypes.number
};

export default ResultsHolder;
