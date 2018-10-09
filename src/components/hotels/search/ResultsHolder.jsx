import '../../../styles/css/components/search-result-component.css';

import PropTypes from 'prop-types';
import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Result from './Result';
import NoEntriesMessage from '../../common/messages/NoEntriesMessage';

function ResultsHolder(props) {

  if (!props.hotels) {
    return;
  }

  if (props.hotels && props.hotels.length === 0 && props.loading) {
    return <div className="text-center"><h2 style={{ margin: '80px 0' }}>Looking for the best rates for your trip...</h2></div>;
  }

  if (props.hotels && props.hotels.length === 0 && !props.loading) {
    // return <div className="text-center"><h2 style={{ margin: '80px 0' }}>No Results</h2></div>;
    return <NoEntriesMessage text='No Results' />;
  }

  const hotels = props.hotels && props.hotels.map((hotel, i) => {
    return <CSSTransition
      key={i}
      classNames="example"
      timeout={{ enter: 500, exit: 300 }}><Result
        key={hotel.id}
        hotel={hotel}
        exchangeRates={props.exchangeRates}
        nights={props.nights}
        allElements={props.allElements}
        price={hotel.price} />
    </CSSTransition>;
  });

  return (
    <div className="results-holder">
      <TransitionGroup>
        {hotels}
      </TransitionGroup>
    </div>
  );
}

ResultsHolder.propTypes = {
  hotels: PropTypes.any,
  allElements: PropTypes.bool,
  exchangeRates: PropTypes.object,
  nights: PropTypes.number
};

export default ResultsHolder;
