import { Link, withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';
import React from 'react';
import { React_Bootstrap_Carousel as ReactBootstrapCarousel } from 'react-bootstrap-carousel';

function ListingItemPictureCarousel(props) {
  const leftIcon = <span className="left-carousel"> </span>;
  const rightIcon = <span className="right-carousel"> </span>;
  let { pictures } = props;
  if (!pictures) {
    return <div className="loader"></div>;
  }

  return (
    <React.Fragment>
      {pictures &&
        <ReactBootstrapCarousel
          animation={true}
          autoplay={false}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          indicators={false}
          className="carousel-fade"
        >
          {pictures.map((item, i) => {
            return (
              <div className="homes-item" key={i}>
                <Link to={`/homes/listings/${props.id}${props.location.search}`}><img src={item.thumbnail} alt="" /></Link>
              </div>
            );
          })}
        </ReactBootstrapCarousel>
      }
    </React.Fragment>
  );
}

ListingItemPictureCarousel.propTypes = {
  pictures: PropTypes.any,
  id: PropTypes.number,
  listingsType: PropTypes.string,

  // router props
  location: PropTypes.object
};

export default withRouter(ListingItemPictureCarousel);
