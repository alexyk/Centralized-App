import '../../../styles/css/components/profile/me/profile-verification.css';

import { Config } from '../../../config';
import Dropzone from 'react-dropzone';
import { ProfileVerification } from '../../../constants/profileVerification';
import React from 'react';
import VerificationItem from './VerificationItem';
import request from 'superagent';
import requester from '../../../initDependencies';

const API_HOST = Config.getValue('apiHost');
const IMG_HOST = Config.getValue('imgHost');
const LOCKTRIP_UPLOAD_URL = `${API_HOST}users/me/identity/images/upload`;

class ProfileVerificationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFiles: [],
      uploadedFilesThumbUrls: [],
      governmentIdPhoto: null,
      loading: true,
      error: null,
      verificationFields: [
        'address',
        'birthday',
        'city',
        'country',
        'gender',
        'phoneNumber',
        'lastName'
      ],
      verifiedFields: [],
      unverifiedFields: []
    };

    this.onImageDrop = this.onImageDrop.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.onDropRejected = this.onDropRejected.bind(this);
    this.splitVerificationData = this.splitVerificationData.bind(this);
  }

  componentDidMount() {
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        this.splitVerificationData(data);

        this.setState({ governmentIdPhoto: data.userIdentity !== null && data.userIdentity.governmentIdPhoto !== null ? data.userIdentity.governmentIdPhoto : null, loading: false });
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

  onImageDrop(files) {
    this.handleImageUpload(files);

    this.setState({
      uploadedFiles: files
    });
  }

  onDropRejected() {
    this.setState({ error: 'Maximum file upload size is 10MB. Supported media formats are jpg, jpeg, png' });
  }

  handleImageUpload(files) {
    files.forEach((file) => {
      let upload = request.post(LOCKTRIP_UPLOAD_URL)
        .field('image', file)
        .set('Authorization', localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']);


      upload.end((err, response) => {
        if (err) {
          console.error(err);
        }
        else {
          this.setState({
            governmentIdPhoto: [response.body.thumbnail]
          });
        }
      });
    });


  }

  render() {
    if (this.state.loading) {
      return <div className="loader"></div>;
    }

    return (
      <div className="container">
        <div className="row">
          <h2>Identification</h2>
          <hr />
          <h5>For your security and your host's, we need to verify your identity. The informaction you share will be used only for verification. You'll only ever need to do this once.</h5>
        </div>
        <div>
          <div className="identification-box row">
            {this.state.governmentIdPhoto == null ?
              <div className="info col-md-9">
                <span>You'll need to provide identification.</span>
              </div> :
              <div className="info col-md-9">
                <span>You are verified</span>
              </div>
            }
            <Dropzone
              className="dropzone col-md-3"
              style={this.state.governmentIdPhoto !== null ? { opacity: '0.5', cursor: 'not-allowed' } : { cursor: 'pointer' }}
              multiple={false}
              maxSize={10485760}
              accept="image/jpg, image/jpeg, image/png"
              onDrop={this.onImageDrop}
              onDropRejected={this.onDropRejected}
              disabled={this.state.governmentIdPhoto !== null}>
              <span className="button">Provide ID</span>
            </Dropzone>
          </div>
          {this.state.error ? <div className="error">{this.state.error}</div> : null}
        </div>
        <br />
        <div className="row">
          <h2>Your verified info</h2>
          <hr />
          {this.state.verifiedFields.map((item, i) => {
            return <VerificationItem key={i} item={item} verified={true} />;
          })}
        </div>
        <br />
        <div className="row">
          <h2>Not yet verified</h2>
          <hr />
          {this.state.unverifiedFields.map((item, i) => {
            return <VerificationItem key={i} item={item} verified={false} />;
          })}
        </div>
      </div>
    );
  }
}

export default ProfileVerificationPage;
