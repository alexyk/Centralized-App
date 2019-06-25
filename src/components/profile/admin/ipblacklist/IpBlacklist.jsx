import {withRouter} from "react-router-dom";

import NoEntriesMessage from "../../../common/messages/NoEntriesMessage";
import {NotificationManager} from "react-notifications";
// import Pagination from "../../../common/pagination/Pagination";
import PropTypes from "prop-types";
import React from "react";

import {LONG} from "../../../../constants/notificationDisplayTimes.js";
import {ADD_IP_TO_BLACKLIST, REMOVE_IP_FROM_BLACKLIST} from "../../../../constants/successMessages";
import {IP_NOT_ADD_TO_BLACKLIST, USER_SERVERROR} from "../../../../constants/errorMessages";

import "../../../../styles/css/components/profile/admin/reservations/admin-reservations-edit-form.css";
import {Config} from "../../../../config";
import Axios from "axios";
import UsersTopBar from "../users/UsersTopBar";
import {getAxiosConfig} from "../utils/adminUtils";
import queryString from "query-string";

class IpBlacklist extends React.Component {
  constructor(props) {
    super(props);

    let queryParams = queryString.parse(this.props.location.search);

    this.state = {
      ipAddress: "",
      ipBlacklist: {},
      loading: true,
      page: !queryParams.page ? 0 : Number(queryParams.page),
      totalElements: '',
      totalPages: ''
    };

    this.onChange = this.onChange.bind(this);
    this.addIpAddressToBlacklist = this.addIpAddressToBlacklist.bind(this);
    this.getIpBlacklist = this.getIpBlacklist.bind(this);
    this.addIpToWhitelist = this.addIpToWhitelist.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    // this.getIpBlacklist(this.state.page);

    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}admin/ipBlacklist`;

    Axios.get(url, getAxiosConfig())
      .then(data => {
        this.setState({
          ipBlacklist: data.data
        });
      })
      .catch(error => {
        NotificationManager.error(USER_SERVERROR + " " + this.state.ipAddress, "", LONG);
      });
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  addIpAddressToBlacklist(e) {
    if (e) {
      e.preventDefault();
    }
    if (
      window.confirm(
        "Are you sure you wish to add IP: " +
        this.state.ipAddress +
        " to blacklist?"
      )
    ) {

      const apiHost = Config.getValue('apiHost');
      const url = `${apiHost}admin/ipBlacklist`;


      Axios.post(url, {"ipAddress": this.state.ipAddress}, getAxiosConfig())
        .then(data => {
          NotificationManager.success(ADD_IP_TO_BLACKLIST, "", LONG);

          this.setState({ipAddress: ""});
          this.props.history.push("/profile/admin/ipBlacklist");
        })
        .catch(error => {
          NotificationManager.error(IP_NOT_ADD_TO_BLACKLIST + " " + this.state.ipAddress, "", LONG);
        });
    }
  }

  getIpBlacklist(page) {
    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}admin/ipBlacklist?page=${page}`;

    Axios.get(url, getAxiosConfig())
      .then(data => {
        this.setState({
          loading: false,
          totalElements: data.totalElements,
          ipBlacklist: data.data
        });
      })
      .catch(error => {
        NotificationManager.error(USER_SERVERROR + " " + this.state.ipAddress, "", LONG);
      });
  }

  addIpToWhitelist(e, ip) {
    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}admin/ipBlacklist/remove`;

    Axios.post(url, ip, getAxiosConfig())
      .then(data => {
        NotificationManager.success(REMOVE_IP_FROM_BLACKLIST, "", LONG);

        this.setState({ipAddress: ""});
        this.props.history.push("/profile/admin/ipBlacklist");
      })
      .catch(error => {
        NotificationManager.error(IP_NOT_ADD_TO_BLACKLIST + " " + this.state.ipAddress, "", LONG);
      });
  }

  onPageChange(page) {
    this.setState({
      page: page - 1,
      loading: true
    });

    window.scrollTo(0, 0);

    this.getIpBlacklist(page - 1);
  }

  render() {
    const ipList = this.state.ipBlacklist;
    // const { totalElements, loading } = this.state;

    // if (loading) {
    //   return <div className="loader"></div>;
    // }

    const styleTable = {
      width: '100%',
      borderSpacing: '5px',
      boxShadow: '0 1px 0 0 rgba(22, 29, 37, 0.05)',
      borderCollapse: 'collapse',
      borderBottom: '1px solid #C0C0C0',
      textAlign: 'center',
      margin: '10px 0px 30px 5px'
    };

    const styleTh = {
      backgroundColor: '#C0C0C0',
      borderBottom: '1px solid #C0C0C0',
      textAlign: 'center',
      font: '18px Futura, Arial, Helvetica Neue, Helvetica',
      height: '30px'
    };

    const styleTd = {
      borderBottom: '1px solid #C0C0C0'
    };

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

    console.log(ipList);

    // if (this.state.loading) {
    //   return <div className="loader" style={{marginBottom: "40px"}}/>;
    // }
    return (
      <div className="container">
        <UsersTopBar/>
        <div className="container reservations-edit-form">
          <form onSubmit={this.addIpAddressToBlacklist}>
            <div className="ipAddress">
              <label htmlFor="ipAddress" style={styleLabel}>IP Address:</label>
              <input
                id="ipAddress"
                name="ipAddress"
                value={this.state.ipAddress || ""}
                onChange={this.onChange}
                type="text"
                required
                style={styleInput}
              />
              <button className="btn" id="btnText" name="btnText" style={styleButton}>
                Add IP to Blacklist
              </button>
            </div>
          </form>
        </div>

        <div className="container reservations-edit-form">
          <div>
            {!ipList ? (
              <NoEntriesMessage text="No IP Addresses in Blacklist"/>
            ) : (
              <div className="reservations-table">
                <table style={styleTable}>
                  <thead>
                  <tr>
                    <th style={styleTh}>#</th>
                    <th style={styleTh}>IP Address</th>
                    <th style={styleTh}>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {Object.keys(ipList).map((key) => {
                    return (
                      <tr key={key}>
                        <td style={styleTd}>{key}</td>
                        <td style={styleTd}>{ipList[key]}</td>
                        <td style={styleTd}>
                          <button onClick={(e) => this.addIpToWhitelist(e, {[key]: ipList[key]})} className="btn"
                                  id="btnText" name="btnText">Whitelist
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  </tbody>
                </table>

                {/*<Pagination*/}
                  {/*loading={this.state.totalReservations === 0}*/}
                  {/*onPageChange={this.onPageChange}*/}
                  {/*currentPage={this.state.currentPage + 1}*/}
                  {/*pageSize={20}*/}
                  {/*totalElements={this.state.totalElements}*/}
                {/*/>*/}
              </div>
            )}
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
