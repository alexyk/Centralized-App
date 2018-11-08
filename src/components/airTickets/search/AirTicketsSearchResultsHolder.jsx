import React from 'react';
import PropTypes from 'prop-types';
import AirTicketsSearchResult from './AirTicketsSearchResult';
import NoEntriesMessage from '../../common/messages/NoEntriesMessage';

import '../../../styles/css/components/search-result-component.css';

function AirTicketsResultsHolder(props) {

  if (!props.results) {
    return;
  }

  if (props.results.length === 0 && props.loading) {
    return <div className="text-center"><h2 style={{ margin: '80px 0' }}>Looking for the best offers...</h2></div>;
  }

  if (props.results.length === 0 && !props.loading) {
    return <NoEntriesMessage text='No Results' />;
  }

  const results = props.results && props.results.map((result) => {
    return <AirTicketsSearchResult
      key={result.id}
      result={result}
      exchangeRatesInfo={props.exchangeRatesInfo}
      paymentInfo={props.paymentInfo}
      userInfo={props.userInfo}
      allElements={props.allElements} />;
  });

  return results;
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
