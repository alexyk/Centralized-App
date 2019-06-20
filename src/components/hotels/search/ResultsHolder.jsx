import '../../../styles/css/components/search-result-component.css';

import PropTypes from 'prop-types';
import React from 'react';
import Result from './Result';
import NoEntriesMessage from '../../common/messages/NoEntriesMessage';

function ResultsHolder(props) {

  if (!props.hotels) {
    return;
  }

  if (props.hotels && props.hotels.length === 0 && props.loading) {
    return <div className="text-center"><h2 style={{margin: '80px 0'}}>Looking for the best rates for your trip...</h2>
    </div>;
  }

  if (props.hotels && props.hotels.length === 0 && !props.loading) {
    // return <div className="text-center"><h2 style={{ margin: '80px 0' }}>No Results</h2></div>;
    return <NoEntriesMessage text='No Results'/>;
  }

  const haveSearchHotel = props.sch && props.scHotel;
  let scHotel = null;

  const hotels = props.hotels && props.hotels.map((hotel) => {
    if(props.sch && hotel.id === Number(props.sch)){
      scHotel = hotel;
    } else {
      return <Result
        key={hotel.id}
        hotel={hotel}
        nights={props.nights}
        allElements={props.allElements}
        price={hotel.price}
        sch={false}/>;
    }
  });

  return (
    <div className="results-holder">
      {scHotel && <Result
        key={scHotel.id}
        hotel={scHotel}
        nights={props.nights}
        allElements={props.allElements}
        price={scHotel.price}
        sch={true}/>}
      {hotels}
    </div>
  );
}

ResultsHolder.propTypes = {
  hotels: PropTypes.any,
  allElements: PropTypes.bool,
  nights: PropTypes.number,
  loading: PropTypes.bool
};

export default ResultsHolder;
