import '../../../styles/css/components/profile/me/profile-verification.css';

import { closeModal, openModal } from '../../../actions/modalsInfo';

import { CAPTURE_IMAGE } from '../../../constants/modals.js';
import CaptureImageModal from './modals/CaptureImageModal';
import { Config } from '../../../config';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import React from 'react';
import VerificationItem from './VerificationItem';
import Webcam from 'react-webcam';
import { connect } from 'react-redux';
import request from 'superagent';
import requester from '../../../initDependencies';
import { withRouter } from 'react-router-dom';

const API_HOST = Config.getValue('apiHost');
const IMG_HOST = Config.getValue('imgHost');
const LOCKTRIP_UPLOAD_URL = `${API_HOST}users/me/identity/images/upload`;

class ProfileVerificationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFiles: '',
      uploadedFilesThumbUrls: '',
      loading: true,
      error: null,
      verificationFields: [
        'email',
        'phoneNumber'
      ],
      verifiedFields: [],
      unverifiedFields: [],
      governmentIdPhoto: '',
      governmentIdHolderPhoto: ''
    };

    this.onImageDrop = this.onImageDrop.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.onDropRejected = this.onDropRejected.bind(this);
    this.splitVerificationData = this.splitVerificationData.bind(this);
    this.capture = this.capture.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setRef = this.setRef.bind(this);
    this.updateUserIdentity = this.updateUserIdentity.bind(this);
  }

  componentDidMount() {
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        this.splitVerificationData(data);

        this.setState({
          governmentIdPhoto: data.userIdentity !== null && data.userIdentity.governmentIdPhoto !== null ? data.userIdentity.governmentIdPhoto : null,
          governmentIdHolderPhoto: data.userIdentity !== null && data.userIdentity.governmentIdHolderPhoto !== null ? data.userIdentity.governmentIdHolderPhoto : null,
          loading: false
        });
      });
    });
  }

  splitVerificationData(data) {
    let verifiedFields = [];
    let unverifiedFields = [];

    for (let i = 0; i < this.state.verificationFields.length; i++) {
      let key = this.state.verificationFields[i];
      if (data[key] !== null) {
        verifiedFields.push(key);
      }
      else {
        unverifiedFields.push(key);
      }
    }

    this.setState({ verifiedFields, unverifiedFields });
  }

  onImageDrop(file, photoName) {
    this.handleImageUpload(file, photoName);

    this.setState({
      uploadedFile: file
    });
  }

  onDropRejected() {
    this.setState({ error: 'Maximum file upload size is 10MB. Supported media formats are jpg, jpeg, png' });
  }

  handleImageUpload(file, photoName) {
    let upload = request.post(LOCKTRIP_UPLOAD_URL)
      .field('image', file)
      .set('Authorization', localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']);


    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }
      else {
        this.setState({
          photoName: [response.body.thumbnail]
        });
        this.updateUserIdentity();
      }
    });
  }

  updateUserIdentity() {
    var userIdentityObj = {
      governmentIdPhoto: this.state.governmentIdPhoto,
      governmentIdHolderPhoto: this.state.governmentIdHolderPhoto
    };

    requester.updateUserAdditionalInfo(userIdentityObj).then(res => {
      if (res.success) {
        console.log('bachka');
      }
    });
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  capture(photoName) {
    const ImageURL = this.webcam.getScreenshot();

    var file = this.dataURLtoFile(ImageURL, 'image.jpeg');

    let upload = request.post(LOCKTRIP_UPLOAD_URL)
      .field('image', file)
      .set('Authorization', localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }
      else {
        console.log(response.body.thumbnail);
        this.setState({ photoName: [response.body.thumbnail] });
        this.updateUserIdentity();
        this.closeModal(CAPTURE_IMAGE);
      }
    });
  }

  setRef(cam) {
    this.webcam = cam;
  }

  openModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(openModal(modal));
  }

  closeModal(modal, e) {
    if (e) {
      e.preventDefault();
    }

    this.props.dispatch(closeModal(modal));
  }

  render() {
    if (this.state.loading) {
      return <div className="loader"></div>;
    }

    console.log(this.state);

    return (
      <div>
        <h2>Identification</h2>
        <hr />
        <h5>For your security and your host's, we need to verify your identity. The informaction you share will be used only for verification. You'll only ever need to do this once.</h5>
        <div>
          <div className="box">
            <div className="left-part">
              <h2>Government ID</h2>
              {this.state.governmentIdPhoto == null ?
                <h5>You'll need to provide identification.</h5> :
                <h5>You are verified</h5>
              }
            </div>
            <div className="right-part">
              <div>
                <Dropzone
                  className="button"
                  style={this.state.governmentIdPhoto !== null ? { opacity: '0.5', cursor: 'not-allowed' } : { cursor: 'pointer' }}
                  multiple={false}
                  maxSize={10485760}
                  accept="image/jpg, image/jpeg, image/png"
                  onDrop={(files) => this.onImageDrop(files, 'governmentIdPhoto')}
                  onDropRejected={this.onDropRejected}
                  disabled={this.state.governmentIdPhoto !== null}>
                  <span><i className="fa fa-upload"></i>Provide ID</span>
                </Dropzone>
                <button
                  style={this.state.governmentIdPhoto !== null ? { opacity: '0.5', cursor: 'not-allowed' } : { cursor: 'pointer' }}
                  disabled={this.state.governmentIdPhoto === null}
                  onClick={() => this.openModal(CAPTURE_IMAGE)}
                  className="button">
                  <i className="fa fa-camera"></i>Provide ID</button>
                <CaptureImageModal setRef={this.setRef} capture={() => this.capture('governmentIdPhoto')} isActive={this.props.modalsInfo.isActive[CAPTURE_IMAGE]} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} />
              </div>
              <div>
                <Dropzone
                  className="button"
                  style={this.state.governmentIdHolderPhoto !== null ? { opacity: '0.5', cursor: 'not-allowed' } : { cursor: 'pointer' }}
                  multiple={false}
                  maxSize={10485760}
                  accept="image/jpg, image/jpeg, image/png"
                  onDrop={this.onImageDrop}
                  onDropRejected={this.onDropRejected}
                  disabled={this.state.governmentIdHolderPhoto !== null}>
                  <span><i className="fa fa-upload"></i>Provide Holder and ID</span>
                </Dropzone>
                <button
                  style={this.state.governmentIdHolderPhoto !== null ? { opacity: '0.5', cursor: 'not-allowed' } : { cursor: 'pointer' }}
                  disabled={this.state.governmentIdHolderPhoto === null}
                  onClick={() => this.openModal(CAPTURE_IMAGE)}
                  className="button">
                  <i className="fa fa-camera"></i>Provide Holder ID</button>
                <CaptureImageModal setRef={this.setRef} capture={() => this.capture('governmentIdHolderPhoto')} isActive={this.props.modalsInfo.isActive[CAPTURE_IMAGE]} openModal={this.openModal} closeModal={this.closeModal} onChange={this.onChange} />
              </div>
            </div>
          </div>
          {this.state.error ? <div className="error">{this.state.error}</div> : null}
        </div>
        <br />
        <h2>Your verified info</h2>
        <hr />
        {this.state.verifiedFields.map((item, i) => {
          return <VerificationItem key={i} item={item} verified={true} />;
        })}
        <br />
        {this.state.unverifiedFields.length !== 0 ?
          <div>
            <h2>Not yet verified</h2>
            <hr />
            {this.state.unverifiedFields.map((item, i) => {
              return <VerificationItem key={i} item={item} verified={false} />;
            })}
          </div>
          : null}
      </div>
    );
  }
}

ProfileVerificationPage.propTypes = {
  // start Redux props
  dispatch: PropTypes.func,
  userInfo: PropTypes.object,
  modalsInfo: PropTypes.object,
};

function mapStateToProps(state) {
  const { modalsInfo } = state;
  return {
    modalsInfo
  };
}

export default withRouter(connect(mapStateToProps)(ProfileVerificationPage));
