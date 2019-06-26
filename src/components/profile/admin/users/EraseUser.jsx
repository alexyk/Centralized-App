import { NavLink, withRouter } from "react-router-dom";

import AdminNav from "../AdminNav";
import ListItem from "./ListItem";
import NoEntriesMessage from "../../../common/messages/NoEntriesMessage";
import { NotificationManager } from "react-notifications";
import Pagination from "../../../common/pagination/Pagination";
import PropTypes from "prop-types";
import React from "react";
import queryString from "query-string";
import requester from "../../../../requester";
import UsersTopBar from "./UsersTopBar"

import { LONG } from "../../../../constants/notificationDisplayTimes.js";
import { USER_ERADICATED } from "../../../../constants/successMessages";
import {
  USER_NOUSER,
  USER_SERVERROR
} from "../../../../constants/errorMessages";

import "../../../../styles/css/components/profile/admin/reservations/admin-reservations-edit-form.css";

class EraseUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEmail: ""
    };

    this.onChange = this.onChange.bind(this);
    this.eraseUserByEmail = this.eraseUserByEmail.bind(this);
  }

  componentDidMount() {}

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  eraseUserByEmail(e) {
    if (e) {
      e.preventDefault();
    }
    if (
      window.confirm(
        "Are you sure you wish to delete " +
          this.state.userEmail +
          " from the LockTrip Plarform?"
      )
    )
      requester.eraseUserByEmail(this.state.userEmail).then(res => {
        if (res.success) {
          res.body.then(data => {
            if (data.success) {
              NotificationManager.success(USER_ERADICATED, "", LONG);
            } else {
              NotificationManager.error(
                USER_NOUSER + " " + this.state.userEmail,
                "",
                LONG
              );
            }
            this.props.history.push("/profile/admin/users/eraseprofile");
          });
        } else {
          res.errors.then(err => {
            if (err["errors"]["UnsuccessfulOperation"]["message"] != null) {
              NotificationManager.warning(
                USER_SERVERROR,
                err["errors"]["UnsuccessfulOperation"]["message"],
                LONG
              );
            } else {
              NotificationManager.error(
                USER_SERVERROR,
                "Contact the dev support.",
                LONG
              );
            }
          });
        }
      });
  }

  render() {
    if (this.state.loading) {
      return <div className="loader" style={{ marginBottom: "40px" }} />;
    }
    return (
      <div className="container">
        <UsersTopBar/>
        <div className="container reservations-edit-form">
          <form onSubmit={this.eraseUserByEmail}>
            <div className="userEmail">
              <label htmlFor="userEmail">User Email:</label>
              <input
                id="userEmail"
                name="userEmail"
                value={this.state.userEmail || ""}
                onChange={this.onChange}
                type="email"
                required
              />
            </div>
            <div className="button-holder">
              <button className="btn" id="btnText" name="btnText">
                DELETE
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

EraseUser.propTypes = {
  history: PropTypes.object
};

export default withRouter(EraseUser);
