import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';
import AirTicketsSearchResult from './AirTicketsSearchResult';
import NoEntriesMessage from '../../common/messages/NoEntriesMessage';

import '../../../styles/css/components/search-result-component.css';

function AirTicketsResultsHolder(props) {

  if (!props.results) {
    return;
  }

  if (props.results && props.results.length === 0 && props.loading) {
    return <div className="text-center"><h2 style={{ margin: '80px 0' }}>Looking for the best rates for your trip...</h2></div>;
  }

  if (props.results && props.results.length === 0 && !props.loading) {
    // return <div className="text-center"><h2 style={{ margin: '80px 0' }}>No Results</h2></div>;
    return <NoEntriesMessage text='No Results' />;
  }

  const results = props.results && props.results.map((result, index) => {
    return <AirTicketsSearchResult
      // key={result.id}
      key={index}
      result={result}
      exchangeRatesInfo={props.exchangeRatesInfo}
      paymentInfo={props.paymentInfo}
      userInfo={props.userInfo}
      allElements={props.allElements}
      price={result.pricesInfo.totalPrice} />;
  });

  return (
    <div className="results-holder">
      <ReactCSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        {results}
      </ReactCSSTransitionGroup>
    </div>
  );
}

AirTicketsResultsHolder.propTypes = {
  results: PropTypes.any,
  loading: PropTypes.bool,
  allElements: PropTypes.bool,
  exchangeRatesInfo: PropTypes.object,
  paymentInfo: PropTypes.object,
  userInfo: PropTypes.object
};

export default AirTicketsResultsHolder;
