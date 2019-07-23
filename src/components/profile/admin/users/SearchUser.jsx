import {NavLink, withRouter} from "react-router-dom";

import ListItem from "./ListItem";
import NoEntriesMessage from "../../../common/messages/NoEntriesMessage";
import {NotificationManager} from "react-notifications";
import PropTypes from "prop-types";
import React from "react";
import queryString from "query-string";
import requester from "../../../../requester";
import UsersTopBar from "./UsersTopBar"
import {Config} from "../../../../config";
import Axios from "axios";
import {getAxiosConfig} from "../utils/adminUtils";
import {LONG} from "../../../../constants/notificationDisplayTimes";


class SearchUser extends React.Component {
  constructor(props) {
    super(props);

    let searchMap = queryString.parse(this.props.location.search);
    this.state = {
      user: '',
      loading: true,
      searchEmail: ''
    };

    this.updateUserStatus = this.updateUserStatus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateUserBlockedStatus = this.updateUserBlockedStatus.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.getUserByEmail = this.getUserByEmail.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  updateUserStatus(event, id, verified) {
    if (event) {
      event.preventDefault();
    }

    let userObj = {
      id: id,
      verified: verified
    };

    const email = this.state.user.email;

    requester.changeUserStatus(userObj).then(res => {
      if (res.success) {
        NotificationManager.info("You successfully changed user status");
        this.getUserByEmail(email);
      } else {
        NotificationManager.error("Something went wrong", "Users Operations");
      }
    });
  }

  updateUserBlockedStatus(e, id, email, blockedStatus) {
    if (e) {
      e.preventDefault();
    }

    let blocked = blockedStatus ? "Blocked" : "Unblocked";

    if (
      window.confirm(
        `Are you sure you want to ${blocked} user: ${email} ?`
      )
    ) {

      const apiHost = Config.getValue('apiHost');
      const url = `${apiHost}admin/users/blocked`;

      const objToSend = {
        id: id,
        blocked: blockedStatus
      };

      Axios.post(url, objToSend, getAxiosConfig())
        .then(data => {
          if (data.data.success) {
            NotificationManager.success(`You successfuly ${blocked} user: ${email}.`, "", LONG);
          } else {
            NotificationManager.error(`Unsuccessful ${blocked} user: ${email}.`, "", LONG);
          }
        })
        .catch(error => {
          NotificationManager.error(`Server error.`, "", LONG);
        });
    }
  }

  searchUser(e) {
    if (e) {
      e.preventDefault();
    }

    const email = this.state.searchEmail;

    this.getUserByEmail(email);

  }

  getUserByEmail(email){
    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}admin/users/email`;

    Axios.post(url, {'email': email}, getAxiosConfig())
      .then(data => {
        if (data.data) {
          this.setState({user: data.data, searchEmail: ''});
        }
      })
      .catch(error => {
        NotificationManager.error(`User not found`, "", LONG)
      });
  }

  render() {
    const styleInput = {
      border: '1px solid #cfcfcf',
      borderRadius: '5px',
      backgroundColor: 'white',
      padding: '15px',
      width: '50%'
    };

    const styleLabel = {
      display: 'block',
      margin: '10px 0 5px 5px'
    };

    const styleButton = {
      margin: '5px 0 5px 5px',
    };

    return (
      <div className="container">
        <UsersTopBar/>
        <div className="container reservations-edit-form">
          <form onSubmit={this.searchUser}>
            <div className="searchEmail">
              <label htmlFor="searchEmail" style={styleLabel}>Email:</label>
              <input
                id="searchEmail"
                name="searchEmail"
                value={this.state.searchEmail || ""}
                onChange={this.onChange}
                type="text"
                required
                style={styleInput}
              />
              <button className="btn" id="btnText" name="btnText" style={styleButton}>
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="my-reservations">
          <section id="profile-my-reservations">
            <div>
              {this.state.user === '' ? (
                <NoEntriesMessage text="No user to show"/>
              ) : (
                <div>
                  <ListItem
                    key={this.state.user.id}
                    item={this.state.user}
                    verified={this.state.user.verify}
                    updateUserStatus={this.updateUserStatus}
                    blocked={this.state.user.blocked}
                    updateUserBlockedStatus={this.updateUserBlockedStatus}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }
}

SearchUser.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(SearchUser);
