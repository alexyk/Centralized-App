import '../../../styles/css/components/profile/me/profile-verification.css';
import '../../../styles/css/components/profile/admin_panel/navigation-tab.css';

import { NavLink, withRouter } from 'react-router-dom';
import { closeModal, openModal } from '../../../actions/modalsInfo';

import { CAPTURE_IMAGE } from '../../../constants/modals.js';
import CaptureImageModal from './modals/CaptureImageModal';
import { Config } from '../../../config';
import Dropzone from 'react-dropzone';
import {NotificationManager} from 'react-notifications';
import PropTypes from 'prop-types';
import React from 'react';
import VerificationItem from './VerificationItem';
import Webcam from 'react-webcam';
import { connect } from 'react-redux';
import request from 'superagent';
import requester from '../../../initDependencies';

const API_HOST = Config.getValue('apiHost');
const LOCKTRIP_UPLOAD_URL = `${API_HOST}users/me/identity/images/upload`;

class ProfileVerificationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFile: '',
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
      governmentIdHolderPhoto: '',
      uploadedFilegovernmentIdPhoto: null,
      uploadedFilegovernmentIdHolderPhoto: null,
      cardIdTabs: [],
      activeTab: true
    };

    this.onImageDrop = this.onImageDrop.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.onDropRejected = this.onDropRejected.bind(this);
    this.splitVerificationData = this.splitVerificationData.bind(this);
    this.onCaptureDrop = this.onCaptureDrop.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setRef = this.setRef.bind(this);
    this.updateUserIdentity = this.updateUserIdentity.bind(this);
    this.changeTabStatus = this.changeTabStatus.bind(this);
    this.fillUserInfo = this.fillUserInfo.bind(this);
  }

  componentDidMount() {
    this.fillUserInfo();
  }

  fillUserInfo() {
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        this.splitVerificationData(data);
        // console.log(data);
        this.setState({
          governmentIdPhoto: data.userIdentity !== null && data.userIdentity.governmentIdPhoto !== null ? data.userIdentity.governmentIdPhoto : null,
          governmentIdHolderPhoto: data.userIdentity !== null && data.userIdentity.governmentIdHolderPhoto !== null ? data.userIdentity.governmentIdHolderPhoto : null,
          verified: data.verified,
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

  onDropRejected() {
    this.setState({ error: 'Maximum file upload size is 10MB. Supported media formats are jpg, jpeg, png' });
  }

  async handleImageUpload(file) {
    return await request.post(LOCKTRIP_UPLOAD_URL)
      .field('image', file)
      .set('Authorization', localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']).then(res => {
        return res.body.thumbnail;
      });
  }

  async updateUserIdentity() {
    let governmentIdPhoto = await this.handleImageUpload(this.state.uploadedFilegovernmentIdPhoto);
    let governmentIdHolderPhoto = await this.handleImageUpload(this.state.uploadedFilegovernmentIdHolderPhoto);

    var userIdentityObj = {
      governmentIdPhoto,
      governmentIdHolderPhoto
    };
    requester.updateUserAdditionalInfo(userIdentityObj).then(res => {
      if (res.success) {
        NotificationManager.info('Your card ID is submitted. Wait up to 72 hours for admin to revise your personal information');
        this.fillUserInfo();
      }
    });
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  onImageDrop(file, photoName) {

    if (photoName == 'governmentIdPhoto') {
      this.state.cardIdTabs.push('cardId');
      this.setState({activeTab: false});
    }
    if (photoName == 'governmentIdHolderPhoto') {
      this.state.cardIdTabs.push('cardIdHolder');
      this.setState({activeTab: ''});
    }

    this.setState({
      [`uploadedFile${photoName}`]: file[0],
    });
  }

  onCaptureDrop(photoName) {
    if (photoName == 'governmentIdPhoto') {
      this.state.cardIdTabs.push('cardId');
      this.setState({activeTab: false});
    }
    if (photoName == 'governmentIdHolderPhoto') {
      this.state.cardIdTabs.push('cardIdHolder');
      this.setState({activeTab: ''});
    }

    let imageURL = this.webcam.getScreenshot();
    var file = this.dataURLtoFile(imageURL, 'image.jpeg');
    this.setState({
      [`uploadedFile${photoName}`]: file
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

  changeTabStatus(state) {
    if (state == 'cardId') {
      this.setState({ activeTab: true });
    }
    if (state == 'cardIdHolder') {
      this.setState({ activeTab: false });
    }
    // this.state.cardIdTabs.push(state);
  }

  render() {
    if (this.state.loading) {
      return <div className="loader"></div>;
    }

    // console.log(this.state);
    const isTwoPicturesUploaded = this.state.uploadedFilegovernmentIdHolderPhoto != null && this.state.uploadedFilegovernmentIdPhoto != null;
    const saveButtonClass = this.state.uploadedFilegovernmentIdPhoto == null || this.state.uploadedFilegovernmentIdHolderPhoto == null ? 'unactive' : 'active';
    return (
      <div id="profile-trust-and-verification">
        <h2>Identification</h2>
        <hr />
        <h5>Your Government ID will be used for verification of your identity and allowing you access to certain features. It will not be shared with anyone else.</h5>

        {this.state.verified == true ? <div>Verified</div> : this.state.governmentIdHolderPhoto == 'true' && this.state.governmentIdPhoto == 'true' ? <div>Pending</div> :
          <div>
            <div className="box">
              <ul className="navigation-tab">
                <li>
                  <a href="#"
                    onClick={() => this.changeTabStatus('cardId')}
                    className={this.state.activeTab == true ? 'active' : ''}>
                    <h2>
                      {this.state.cardIdTabs.includes('cardId') ?
                        <span className="step-check checked"></span> :
                        <span className="step-check unchecked"></span>}
                      Step 1: Card ID</h2>
                  </a>
                </li>
                <li>
                  <a href="#"
                    onClick={() => this.changeTabStatus('cardIdHolder')}
                    className={this.state.activeTab == false ? 'active' : ''}>
                    <h2>
                      {this.state.cardIdTabs.includes('cardIdHolder') ?
                        <span className="step-check checked"></span> :
                        <span className="step-check unchecked"></span>}
                      Step 2: Holder + Card ID</h2>
                  </a>
                </li>
              </ul>
              <div className="left-part">
                <h2>{this.state.activeTab == true ? 'Government ID' : 'Holder + Government ID'}</h2>
                {this.state.activeTab == true ?
                  <h5>Upload an existing picture of your ID or use your web camera to take one.</h5> :
                  <h5>In order to be sure that the cardholder is you, we need you to be on the picture holding the card near your face.</h5>
                }
              </div>
              <div className="right-part">
                {this.state.activeTab == true ? <div>
                  <Dropzone
                    className="button"
                    style={this.state.uploadedFilegovernmentIdPhoto === null ? null : { backgroundColor: '#a2c5bf' }}
                    multiple={false}
                    maxSize={10485760}
                    accept="image/jpg, image/jpeg, image/png"
                    onDrop={(files) => this.onImageDrop(files, 'governmentIdPhoto')}
                    onDropRejected={this.onDropRejected}
                  >
                    <span><i className="fa fa-upload"></i>Provide ID</span>
                  </Dropzone>
                  <p>or</p>
                  <button
                    style={this.state.uploadedFilegovernmentIdPhoto === null ? null : { backgroundColor: '#a2c5bf' }}
                    onClick={() => this.openModal(CAPTURE_IMAGE)}
                    className="button">
                    <i className="fa fa-camera"></i>Provide ID</button>
                  <CaptureImageModal isActive={this.props.modalsInfo.isActive[CAPTURE_IMAGE]} openModal={this.openModal} closeModal={this.closeModal}>
                    <form onSubmit={(e) => { e.preventDefault(); this.closeModal(CAPTURE_IMAGE); this.onCaptureDrop('governmentIdPhoto'); }}>
                      <Webcam
                        className="webcam"
                        audio={false}
                        screenshotFormat="image/jpeg"
                        ref={(cam) => this.setRef(cam)}
                      />
                      <button type="submit" className="btn btn-primary">Capture</button>
                      <div className="clearfix"></div>
                    </form>

                  </CaptureImageModal>
                </div> :
                  <div>
                    <Dropzone
                      className="button"
                      style={this.state.uploadedFilegovernmentIdHolderPhoto === null ? null : { backgroundColor: '#a2c5bf' }}
                      multiple={false}
                      maxSize={10485760}
                      accept="image/jpg, image/jpeg, image/png"
                      onDrop={(files) => this.onImageDrop(files, 'governmentIdHolderPhoto')}
                      onDropRejected={this.onDropRejected}
                    >
                      <span><i className="fa fa-upload"></i>Provide Holder + ID</span>
                    </Dropzone>
                    <p>or</p>
                    <button
                      style={this.state.uploadedFilegovernmentIdHolderPhoto === null ? null : { backgroundColor: '#a2c5bf' }}
                      onClick={() => this.openModal(CAPTURE_IMAGE)}
                      className="button">
                      <i className="fa fa-camera"></i>Provide Holder ID</button>
                    <CaptureImageModal isActive={this.props.modalsInfo.isActive[CAPTURE_IMAGE]} openModal={this.openModal} closeModal={this.closeModal}>
                      <form onSubmit={(e) => { e.preventDefault(); this.closeModal(CAPTURE_IMAGE); this.onCaptureDrop('governmentIdHolderPhoto'); }}>
                        <Webcam
                          className="webcam"
                          audio={false}
                          screenshotFormat="image/jpeg"
                          ref={(cam) => this.setRef(cam)}
                        />
                        <button type="submit" className="btn btn-primary">Capture</button>
                        <div className="clearfix"></div>
                      </form>

                    </CaptureImageModal>
                  </div>}
                {this.state.error ? <div className="error">{this.state.error}</div> : null}
              </div>
            </div>
            <button disabled={!isTwoPicturesUploaded} onClick={this.updateUserIdentity} className={'button' + ' ' + saveButtonClass}>Save ID</button>
          </div>}
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
