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
import Pagination from "../../../common/pagination/Pagination";


class SearchUser extends React.Component {
  constructor(props) {
    super(props);

    let searchMap = queryString.parse(this.props.location.search);
    this.state = {
      users: [],
      loading: true,
      searchEmail: '',
      totalElements: 0,
      currentPage: !searchMap.page ? 0 : Number(searchMap.page)
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.updateUserStatus = this.updateUserStatus.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateUserBlockedStatus = this.updateUserBlockedStatus.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.getUsersByEmail = this.getUsersByEmail.bind(this);
  }


  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onPageChange(page) {
    this.setState({
      currentPage: page - 1,
      loading: true
    });

    this.getUsersByEmail(this.state.searchEmail, page);
  }


  updateUserStatus(event, id, verified) {
    if (event) {
      event.preventDefault();
    }

    const status = verified ? 'verified' : 'unverified';

    let userObj = {
      id: id,
      verified: verified
    };

    let userEmail;
    this.state.users.map(u => {
      if(u.id === id){
        userEmail = u.email;
      }
    });

    requester.changeUserStatus(userObj).then(res => {
      if (res.success) {
        NotificationManager.success(`You successfuly ${status} user: ${userEmail}`);
        this.getUsersByEmail(this.state.searchEmail, this.state.currentPage);
      } else {
        NotificationManager.error(`Unsuccessful ${status} user: ${userEmail}`, "", LONG);
      }
    });
  }

  updateUserBlockedStatus(e, id, email, blockedStatus) {
    if (e) {
      e.preventDefault();
    }

    let blocked = blockedStatus ? "Block" : "Unblock";

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
            NotificationManager.success(`You successfuly ${blocked}ed user: ${email}.`, "", LONG);
          } else {
            NotificationManager.error(`Unsuccessful ${blocked}ed user: ${email}.`, "", LONG);
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

    this.getUsersByEmail(email, this.state.currentPage);
  }

  getUsersByEmail(email, page) {
    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}admin/users/email?page=${page - 1}`;

    Axios.post(url, {'email': email}, getAxiosConfig())
      .then(data => {
        if (data.data) {
          this.setState({
            users: data.data.content,
            searchEmail: email,
            totalElements: data.data.totalElements,
            loading: false});
        }
      })
      .catch(error => {
        NotificationManager.error(`Not found user contains in email: ${email}.`, "", LONG)
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

        {!this.state.loading && <div className="my-reservations">
          <section id="profile-my-reservations">
            <div>
              {this.state.users.length === 0 ? (
                <NoEntriesMessage text="No users to show"/>
              ) : (
                <div>
                  {this.state.users.map((item, i) => {
                    return (
                      <ListItem
                        key={i}
                        item={item}
                        verified={item.verify}
                        updateUserStatus={this.updateUserStatus}
                        blocked={item.blocked}
                        updateUserBlockedStatus={this.updateUserBlockedStatus}
                      />
                    );
                  })}
                </div>
              )}

              <Pagination
                loading={this.state.totalReservations === 0}
                onPageChange={this.onPageChange}
                currentPage={this.state.currentPage + 1}
                pageSize={10}
                totalElements={this.state.totalElements}
              />
            </div>
          </section>
        </div>}
      </div>
    );
  }
}

SearchUser.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(SearchUser);
