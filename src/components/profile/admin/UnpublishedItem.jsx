import React from 'react';
import Slider from 'react-slick';
import { Config } from '../../../config.js';
import '../../../styles/css/components/profile/admin_panel/unpublished-item.css';

let slider = null;

export default function UnpublishedListing(props) {
  const { id, name, lastModify, descriptionText, pictures } = props.item;
  const thumbnails = pictures.map(p => { return { thumbnail: `${Config.getValue('imgHost')}${p.thumbnail}` }; });
  if (thumbnails.length < 1) {
    pictures.push({ thumbnail: `${Config.getValue('imgHost')}/listings/images/default.png` });
  }
  
  const leftButton = <button></button>;
  const rightButton = <button></button>;
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: rightButton,
    prevArrow: leftButton
  };

  const description = descriptionText.length < 300 ? descriptionText : descriptionText.substr(0, 300) + '...';

  return (
    <div className="unpublished-item">
      <div className="unpublished-item_images">
        {thumbnails &&
          <Slider ref={s => slider = s}
            {...settings}>
            {thumbnails.map((picture, i) => {
              return (
                <div key={i}>
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
        <p>Price - $225 (LOC104)</p>
        <div className="unpublished-item_actions">
          <div className="minor-actions">
            <div><a href="#">Expand Details</a></div>
            <div><a href="#" onClick={(e) => props.openContactHostModal(e, id)}>Contact Host</a></div>
            <div><a href="#" className="delete" onClick={(e) => props.handleOpenDeleteListingModal(e, id, name)}>Delete</a></div>
          </div>
          <div className="major-actions">
            <div><a href="#" onClick={(e) => props.updateListingStatus(e, id, 'active')}>Approve</a></div>
            <div><a href="#">Deny</a></div>
          </div>
        </div>
      </div>
    </div>
  );
}