import '../../../../styles/css/components/profile/admin/unpublished-item.css';

import { Config } from '../../../../config.js';
import PropTypes from 'prop-types';
import React from 'react';
import Slider from 'react-slick';

function ListItem(props) {
  const { id, name, lastModify, descriptionText, pictures, currencyCode, defaultDailyPrice, state } = props.item;
  const thumbnails = pictures.map((p, i) => { return { thumbnail: `${Config.getValue('imgHost')}${p.thumbnail}`, index: i }; });
  if (thumbnails.length < 1) {
    pictures.push({ thumbnail: `${Config.getValue('imgHost')}/listings/images/default.png` });
  }

  const SlickButton = ({ currentSlide, slideCount, ...props }) => (
    <button {...props} />
  );

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SlickButton />,
    prevArrow: <SlickButton />
  };

  let description = descriptionText;
  if (!props.isExpanded) {
    description = description.length < 300 ? description : description.substr(0, 300) + '...';
  }

  return (
    <div className="unpublished-item">
      <div className="unpublished-item_images">
        {thumbnails &&
          <Slider
            {...settings}>
            {thumbnails.map((picture, i) => {
              return (
                <div key={i} onClick={(e) => props.openLightbox(e, id, picture.index)}>
                  <div style={{ backgroundImage: 'url(' + picture.thumbnail + ')' }}>
                  </div>
                </div>
              );
            })}
          </Slider>
        }
      </div>
      <div className="unpublished-item_content">
        <div className="header">
          <h2><span><a href={`/homes/listings/${id}`}>{name}</a></span></h2>
          {lastModify &&
            <h6>Last modified on {lastModify.split(' ')[0]}</h6>
          }
        </div>
        <p>{description}</p>
        <p>Price - {currencyCode} {defaultDailyPrice}</p>
        <div className="unpublished-item_actions">
          <div className="minor-actions">
            {descriptionText && descriptionText.length > 300 &&
              (!props.isExpanded
                ? <div>{descriptionText.length > 300 && <a href="" onClick={(e) => props.handleExpandListing(e, id)}>Expand</a>}</div>
                : <div><a href="" onClick={(e) => props.handleShrinkListing(e, id)}>Hide</a></div>
              )
            }

            <div><a href="" onClick={(e) => props.openContactHostModal(e, id)}>Contact Host</a></div>
            {state === 'inactive' &&
              <div><a href="" className="delete" onClick={(e) => props.handleOpenDeleteListingModal(e, id, name)}>Delete</a></div>
            }
          </div>
          <div className="major-actions">
            {state === 'inactive' &&
              <div><a href="" onClick={(e) => props.updateListingStatus(e, id, 'active')}>Approve</a></div>
            }
            {state === 'inactive' &&
              <div><a href="" onClick={(e) => props.updateListingStatus(e, id, 'denied')}>Deny</a></div>
            }
            {state === 'active' &&
              <div><a href="" onClick={(e) => props.updateListingStatus(e, id, 'inactive')}>Unpublish</a></div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

ListItem.propTypes = {
  item: PropTypes.object,
  isExpanded: PropTypes.bool,
  handleExpandListing: PropTypes.func,
  handleShrinkListing: PropTypes.func,
  openContactHostModal: PropTypes.func,
  handleOpenDeleteListingModal: PropTypes.func,
  updateListingStatus: PropTypes.func
};

export default ListItem;
