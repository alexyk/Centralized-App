import 'react-notifications/lib/notifications.css';
import '../../../styles/css/components/profile/me/my-profile-edit-form.css';

import { NotificationManager } from 'react-notifications';
import React from 'react';
import requester from '../../../requester';

class ProfileAdditionalInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      aboutMe: '',
      work: '',
      school: '',
      loading: true
    };


    this.onChange = this.onChange.bind(this);
    this.updateUserAdditionalInfo = this.updateUserAdditionalInfo.bind(this);
  }

  async componentDidMount() {
    requester.getUserInfo().then(res => res.body).then(data => {
      if (data.userIdentity) {
        this.setState({
          aboutMe: data.userIdentity.aboutMe !== null ? data.userIdentity.aboutMe : '',
          work: data.userIdentity.work !== null ? data.userIdentity.work : '',
          school: data.userIdentity.school !== null ? data.userIdentity.school : '',
        });
      }
    }).then(() => {
      this.setState({ loading: false });
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  updateUserAdditionalInfo(e) {
    if (e) {
      e.preventDefault();
    }

    let userAdditionalInfo = {
      aboutMe: this.state.aboutMe,
      work: this.state.work,
      school: this.state.school
    };

    Object.keys(userAdditionalInfo).forEach((key) => (userAdditionalInfo[key] === null || userAdditionalInfo[key] === '') && delete userAdditionalInfo[key]);

    requester.updateUserAdditionalInfo(userAdditionalInfo).then(res => {
      if (res.success) {
        NotificationManager.success('Successfully updated your info', 'Update user additional info');
      }
      else {
        NotificationManager.error('Something went wrong...');
      }
    }).catch(errors => {
      for (var e in errors) {
        NotificationManager.warning(errors[e].message);
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <div className="loader"></div>;
    }

    return (
      <div id="my-profile-edit-form">
        <h2>Additional Info</h2>
        <hr />
        <form onSubmit={(e) => { this.updateUserAdditionalInfo(e); }}>
          <div className="about-me">
            <label htmlFor="about-me">About me</label>
            <textarea value={this.state.aboutMe} onChange={this.onChange} name="aboutMe" id="about-me">
            </textarea>
          </div>

          <div className="work">
            <label htmlFor="work">Work</label>
            <input id="work" name="work" value={this.state.work} onChange={this.onChange} type="text" placeholder='Enter your work place' />
          </div>

          <div className="school">
            <label htmlFor="school">School</label>
            <input id="school" name="school" value={this.state.school} onChange={this.onChange} type="text" placeholder='Enter your school' />
          </div>

          <button type="submit" className="button">Save</button>
        </form>
      </div>
    );
  }
}

export default ProfileAdditionalInfo;
