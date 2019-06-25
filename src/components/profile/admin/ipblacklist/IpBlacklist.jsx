import {NavLink, withRouter} from "react-router-dom";

import AdminNav from "../AdminNav";
import NoEntriesMessage from "../../../common/messages/NoEntriesMessage";
import {NotificationManager} from "react-notifications";
import PropTypes from "prop-types";
import React from "react";
import requester from "../../../../requester";

import {LONG} from "../../../../constants/notificationDisplayTimes.js";
import {ADD_IP_IN_BLACKLIST} from "../../../../constants/successMessages";
import {IP_NOT_ADD_IN_BLACKLIST, USER_SERVERROR} from "../../../../constants/errorMessages";

import "../../../../styles/css/components/profile/admin/reservations/admin-reservations-edit-form.css";

class IpBlacklist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ipAddress: "",
      ipBlacklist: {}
    };

    this.onChange = this.onChange.bind(this);
    this.addIpAddressInBlacklist = this.addIpAddressInBlacklist.bind(this);
  }

  componentDidMount() {
    requester.getIpBlacklist().then(res => {
      res.body.then(data => {
        console.log(data);
        this.setState({
          ipBlacklist: data
        });
      });
    });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  addIpAddressInBlacklist(e) {
    if (e) {
      e.preventDefault();
    }
    if (
      window.confirm(
        "Are you sure you wish to add IP: " +
        this.state.ipAddress +
        " in blacklist?"
      )
    )

      console.log(this.state.ipAddress);

      requester.addInIpBlacklist({"ipAddress" : this.state.ipAddress}).then(res => {
        if (res.success) {
          res.body.then(data => {
            if (data.success) {
              NotificationManager.success(ADD_IP_IN_BLACKLIST, "", LONG);
            } else {
              NotificationManager.error(
                IP_NOT_ADD_IN_BLACKLIST + " " + this.state.ipAddress,
                "",
                LONG
              );
            }
            this.props.history.push("/profile/admin/ipBlacklist");
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
    const ipList = this.state.ipBlacklist;

    console.log(ipList);

    if (this.state.loading) {
      return <div className="loader" style={{marginBottom: "40px"}}/>;
    }
    return (
      <div className="container">
        <AdminNav>
          <div>
            <li>
              <NavLink
                exact
                activeClassName="active"
                to="/profile/admin/users/unverified"
              >
                <h2>Unverified</h2>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="active"
                to="/profile/admin/users/verified"
              >
                <h2>Verified</h2>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="active"
                to="/profile/admin/users/eraseprofile"
              >
                <h2>Delete User</h2>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="active"
                to="/profile/admin/ipBlacklist"
              >
                <h2>Ip Blacklist</h2>
              </NavLink>
            </li>
          </div>
        </AdminNav>
        <div className="container reservations-edit-form">
          <form onSubmit={this.addIpAddressInBlacklist}>
            <div className="ipAddress">
              <label htmlFor="ipAddress">Ip Address:</label>
              <input
                id="ipAddress"
                name="ipAddress"
                value={this.state.ipAddress || ""}
                onChange={this.onChange}
                type="text"
                required
              />
            </div>
            <div className="button-holder">
              <button className="btn" id="btnText" name="btnText">
                Add in Blacklist
              </button>
            </div>
          </form>
        </div>

        <div className="my-reservations">
            <div>
              {!ipList ? (
                <NoEntriesMessage text="No IP Addresses in Blacklist"/>
              ) : (
                <div>
                  <table>
                    <thead>
                    <tr>
                      <th>#</th>
                      <th>IP Address</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.keys(ipList).map((key) => {
                      return (
                        <tr>
                          <td>{key}</td>
                          <td>{ipList[key]}</td>
                        </tr>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
              )}

              {/*<Pagination*/}
                {/*loading={this.state.totalReservations === 0}*/}
                {/*onPageChange={this.onPageChange}*/}
                {/*currentPage={this.state.currentPage + 1}*/}
                {/*pageSize={20}*/}
                {/*totalElements={this.state.totalElements}*/}
              {/*/>*/}
            </div>
        </div>
      </div>
    );
  }
}

IpBlacklist.propTypes = {
  history: PropTypes.object
};

export default withRouter(IpBlacklist);
