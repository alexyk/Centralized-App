import { Config } from '../../../config';
import Dropzone from 'react-dropzone';
import React from 'react';
import request from 'superagent';
import requester from '../../../requester';

import '../../../styles/css/components/profile/me/profile-photos.scss';

const API_HOST = Config.getValue('apiHost');
const IMG_HOST = Config.getValue('imgHost');
const LOCKTRIP_UPLOAD_URL = `${API_HOST}users/me/images/upload`;

class ProfilePhotosPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedFiles: [],
      uploadedFilesThumbUrls: [],
      loading: true,
      error: null
    };

    this.onImageDrop = this.onImageDrop.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.onDropRejected = this.onDropRejected.bind(this);
  }

  componentDidMount() {
    requester.getUserInfo().then(res => {
      res.body.then(data => {
        this.setState({ uploadedFilesThumbUrls: [data.image], loading: false });
      });
    });
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
            uploadedFilesThumbUrls: [response.body.thumbnail]
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
      <div>
        <section id="profile-photos">
          <div className="pictures-preview col-md-12">
            {this.state.uploadedFilesThumbUrls.length === 0 ? null :
              this.state.uploadedFilesThumbUrls.map((imageUrl, i) =>
                <div key={i} className="uploaded-small-picture col-md-4">
                  <img src={`${IMG_HOST}${imageUrl}`} height={200} alt={`uploaded-${i}`} />
                </div>
              )
            }
            <Dropzone
              className="pictures-upload col-md-4"
              multiple={false}
              maxSize={10485760}
              accept="image/jpg, image/jpeg, image/png"
              onDrop={this.onImageDrop}
              onDropRejected={this.onDropRejected} >
              <p>Upload a file from your computer</p>
            </Dropzone>
          </div>
          {this.state.error ? <div className="error">{this.state.error}</div> : null}
        </section>
      </div>
    );
  }
}

export default ProfilePhotosPage;
