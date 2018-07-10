import React from 'react';
import { Link, BrowserRouter } from 'react-router-dom';
import { Config } from '../../../../config.js';

function MarkerInfoWindow(props) {
  const calculateStars = function (ratingNumber) {
    let starsElements = [];
    let rating = Math.round(ratingNumber);
    for (let i = 0; i < rating; i++) {
      starsElements.push(<span key={i} className="full-star"></span>);
    }

    return starsElements;
  };
  
  // const photoURL = `${Config.getValue('imgHost')}${props.hotel.photos[0]}`;
  // const { id, name, stars } = props.hotel;
  const { isLogged, currencySign, fiatPrice, locPrice, rootUrl } = props;
  
  return (
    <div>
      <BrowserRouter>
        {/* <Link to={rootUrl + `/${id}${props.search}`}> */}
          <div className={'marker-hotel'}>
            {/* <div className={'marker-hotel-thumbnail'} style={{ backgroundImage: 'url(' + photoURL + ')' }}></div> */}
            {/* <div className={'marker-hotel-title'}>{name}</div> */}
            <div className="marker-hotel-price">
              {isLogged
                ? `${currencySign} ${fiatPrice} (LOC ${locPrice}) / Night`
                : `LOC ${locPrice} / Night`
              }
            </div>
            <div className="marker-hotel-rating">
              {/* <div className="marker-hotel-rating-stars">
                {calculateStars(stars)}
              </div> */}
            </div>
            <div className="marker-hotel-price-loc"></div>
          </div>
        {/* </Link> */}
      </BrowserRouter>
    </div>
  );
}

export default MarkerInfoWindow;