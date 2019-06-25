import {withRouter} from "react-router-dom";

import NoEntriesMessage from "../../../common/messages/NoEntriesMessage";
import {NotificationManager} from "react-notifications";
// import Pagination from "../../../common/pagination/Pagination";
import PropTypes from "prop-types";
import React from "react";

import {LONG} from "../../../../constants/notificationDisplayTimes.js";
import {ADD_IP_TO_BLACKLIST, REMOVE_IP_FROM_BLACKLIST, USER_ERADICATED} from "../../../../constants/successMessages";
import {IP_NOT_ADD_TO_BLACKLIST, USER_NOUSER, USER_SERVERROR} from "../../../../constants/errorMessages";

import "../../../../styles/css/components/profile/admin/reservations/admin-reservations-edit-form.css";
import {Config} from "../../../../config";
import Axios from "axios";
import UsersTopBar from "../users/UsersTopBar";
import {getAxiosConfig} from "../utils/adminUtils";
import queryString from "query-string";
import requester from "../../../../requester";

class CountryBlacklist extends React.Component {
  constructor(props) {
    super(props);

    let queryParams = queryString.parse(this.props.location.search);

    this.state = {
      country: {},
      countryBlacklist: {},
      loading: true,
      page: !queryParams.page ? 0 : Number(queryParams.page),
      totalElements: '',
      totalPages: '',
      countries: []
    };

    this.onChange = this.onChange.bind(this);
    this.addCountryToBlacklist = this.addCountryToBlacklist.bind(this);
    this.getCountryBlacklist = this.getCountryBlacklist.bind(this);
    this.addCountryToWhitelist = this.addCountryToWhitelist.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
  }

  componentDidMount() {
    // requester.getCountries().then(res => {
    //   if (res.success) {
    //     res.body.then(data => {
    //       console.log(data);
    //
    //       if (data.success) {
    //         NotificationManager.success(USER_ERADICATED, "", LONG);
    //         this.setState({
    //           countries: data
    //         });
    //       }
    //       this.props.history.push("/profile/admin/countryBlacklist");
    //     });
    //   } else {
    //     res.errors.then(err => {
    //       if (err["errors"]["UnsuccessfulOperation"]["message"] != null) {
    //         NotificationManager.warning(
    //           USER_SERVERROR,
    //           err["errors"]["UnsuccessfulOperation"]["message"],
    //           LONG
    //         );
    //       } else {
    //         NotificationManager.error(
    //           USER_SERVERROR,
    //           "Contact the dev support.",
    //           LONG
    //         );
    //       }
    //     });
    //   }
    // });

    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}admin/countryBlacklist`;
    const countryUrl = `${apiHost}countries`;

    Axios.get(countryUrl, getAxiosConfig())
      .then(data => {
        console.log(data.data);
        this.setState({
          countries: data.data
        });
      })
      .catch(error => {
        NotificationManager.error(USER_SERVERROR + " " + this.state.ipAddress, "", LONG);
      });

    Axios.get(url, getAxiosConfig())
      .then(data => {
        this.setState({
          countryBlacklist: data.data
        });
      })
      .catch(error => {
        NotificationManager.error(USER_SERVERROR + " " + this.state.ipAddress, "", LONG);
      });

    console.log(this.state.countries);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  addCountryToBlacklist(e) {
    if (e) {
      e.preventDefault();
    }
    if (
      window.confirm(
        "Are you sure you wish to add Country: " +
        this.state.country.name +
        " to blacklist?"
      )
    ) {

      const apiHost = Config.getValue('apiHost');
      const url = `${apiHost}admin/ipBlacklist`;


      Axios.post(url, this.state.country, getAxiosConfig())
        .then(data => {
          NotificationManager.success(ADD_IP_TO_BLACKLIST, "", LONG);

          this.setState({ipAddress: ""});
          this.props.history.push("/profile/admin/countryBlacklist");
        })
        .catch(error => {
          NotificationManager.error(IP_NOT_ADD_TO_BLACKLIST + " " + this.state.ipAddress, "", LONG);
        });
    }
  }

  getCountryBlacklist(page) {
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

  addCountryToWhitelist(e, ip) {
    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}admin/countryBlacklist/remove`;

    Axios.post(url, ip, getAxiosConfig())
      .then(data => {
        NotificationManager.success(REMOVE_IP_FROM_BLACKLIST, "", LONG);

        this.setState({ipAddress: ""});
        this.props.history.push("/profile/admin/countryBlacklist");
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

    this.getCountryBlacklist(page - 1);
  }

  updateCountry(e) {
    let value = JSON.parse(e.target.value);

    this.setState({
      country: value
    });
  }

  render() {
    const countryList = this.state.countryBlacklist;
    const { countries} = this.props;
    const country = this.state.country;

    console.log(countries);
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

    // if (this.state.loading) {
    //   return <div className="loader" style={{marginBottom: "40px"}}/>;
    // }
    return (
      <div className="container">
        <UsersTopBar/>
        <div className="container reservations-edit-form">
          <form onSubmit={this.addCountryToBlacklist}>
            <div className="country">
              <label htmlFor="country" style={styleLabel}>Country:</label>

                <div className='select'>
                  <select name="country" id="address" onChange={this.updateCountry} value={JSON.stringify(country)}>
                    <option disabled value="">Country</option>
                    {countries && countries.map((item, i) => {
                      return <option key={i} value={JSON.stringify(item)}>{item.name}</option>;
                    })}
                  </select>
                </div>

              <button className="btn" id="btnText" name="btnText" style={styleButton}>
                Add IP to Blacklist
              </button>
            </div>
          </form>
        </div>

        <div className="container reservations-edit-form">
          <div>
            {!countryList ? (
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
                  {Object.keys(countryList).map((key) => {
                    return (
                      <tr key={key}>
                        <td style={styleTd}>{key}</td>
                        <td style={styleTd}>{countryList[key]}</td>
                        <td style={styleTd}>
                          <button onClick={(e) => this.addCountryToWhitelist(e, {[key]: countryList[key]})} className="btn"
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

CountryBlacklist.propTypes = {
  history: PropTypes.object
};

export default withRouter(CountryBlacklist);
