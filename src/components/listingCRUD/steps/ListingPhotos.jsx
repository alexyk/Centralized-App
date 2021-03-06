import React from 'react';
import { withRouter } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import PropTypes from 'prop-types';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import PlaceDescriptionAside from '../aside/PlaceDescriptionAside';
import ListingCrudNav from '../navigation/ListingCrudNav';
import FooterNav from '../navigation/FooterNav';

import Dropzone from 'react-dropzone';

import { Config } from '../../../config';

import { MISSING_PICTURE, INVALID_PICTURE } from '../../../constants/warningMessages.js';
import { LONG } from '../../../constants/notificationDisplayTimes.js';

import '../../../styles/css/components/profile/listings/listing-photos.css';

function ListingPhotos(props) {
  const SortableItem = SortableElement(({ value, i }) =>
    <div className="uploaded-small-picture" >
      <button onClick={props.removePhoto} className="close">
        <img className="inactiveLink" src={Config.getValue('basePath') + 'images/icon-delete.png'} alt="remove" />
      </button>
      <img draggable={false} src={value} height={200} alt={`uploaded-${i}`} />
    </div>
  );

  const SortableList = SortableContainer(({ items }) => {
    return (
      <div className="pictures-preview">
        {items.map((value, index) => (
          <SortableItem key={`item-${index}`} index={index} value={value} />
        ))}
      </div>
    );
  });

  const next = validateInput(props.values) ? props.next : props.location.pathname;
  const handleClickNext = validateInput(props.values)
    ? () => { props.updateProgress(1); }
    : () => { showErrors(props.values); };

  return (
    <div>
      <ListingCrudNav progress='66%' />
      <div className="container">
        <div className="listings create">
          <PlaceDescriptionAside routes={props.routes} />
          <div id="reservation-hotel-review-room">
            <h2>Upload photos of your place</h2>
            <hr />

            <Dropzone
              className="pictures-upload"
              multiple={true}
              maxSize={10485760}
              accept="image/jpg, image/jpeg, image/png"
              onDrop={props.onImageDrop}
              onDropRejected={onDropRejected}>
              <p>Drop files to upload</p>
              <button className="button">Choose file</button>
            </Dropzone>

            {props.values.uploadedFilesUrls.length === 0
              ? null
              : <SortableList
                axis={'xy'}
                lockToContainerEdges={true}
                items={props.values.uploadedFilesUrls}
                onSortEnd={props.onSortEnd} />
            }
          </div>
        </div>
      </div>
      <FooterNav next={next} prev={props.prev} handleClickNext={handleClickNext} step={7} />
    </div>
  );
}

function onDropRejected() {
  NotificationManager.warning(INVALID_PICTURE, '', LONG);
}

function validateInput(values) {
  const { uploadedFilesUrls } = values;
  if (uploadedFilesUrls.length < 1) {
    return false;
  }

  return true;
}

function showErrors(values) {
  const { uploadedFilesUrls } = values;
  if (uploadedFilesUrls.length < 1) {
    NotificationManager.warning(MISSING_PICTURE, '', LONG);
  }
}

ListingPhotos.propTypes = {
  values: PropTypes.any,
  onChange: PropTypes.func,
  onImageDrop: PropTypes.func,
  removePhoto: PropTypes.func,
  updateProgress: PropTypes.func,
  prev: PropTypes.string,
  next: PropTypes.string,
  routes: PropTypes.object,
  onSortEnd: PropTypes.any,

  // Router props
  location: PropTypes.object,
};

export default withRouter(ListingPhotos);
