import {withRouter} from "react-router-dom";

import NoEntriesMessage from "../../../common/messages/NoEntriesMessage";
import {NotificationManager} from "react-notifications";
// import Pagination from "../../../common/pagination/Pagination";
import PropTypes from "prop-types";
import React from "react";

import {LONG} from "../../../../constants/notificationDisplayTimes.js";
import {ADDED_TO_BLACKLIST, REMOVED_FROM_BLACKLIST} from "../../../../constants/successMessages";
import {NOT_ADDED_TO_BLACKLIST, NOT_REMOVED_FROM_BLACKLIST, USER_SERVERROR} from "../../../../constants/errorMessages";

import "../../../../styles/css/components/profile/admin/reservations/admin-reservations-edit-form.css";
import {Config} from "../../../../config";
import Axios from "axios";
import UsersTopBar from "../users/UsersTopBar";
import {getAxiosConfig} from "../utils/adminUtils";
import queryString from "query-string";

class CountryBlacklist extends React.Component {
  constructor(props) {
    super(props);

    let queryParams = queryString.parse(this.props.location.search);

    this.state = {
      country: {},
      countryBlacklist: [],
      loading: false,
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
    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}admin/countryBlacklist`;
    const countryUrl = `${apiHost}countries`;

    Axios.get(countryUrl, getAxiosConfig())
      .then(data => {
        this.setState({
          countries: data.data
        });
      })
      .catch(error => {
        NotificationManager.error(USER_SERVERROR + " " + error, "", LONG);
      });

    Axios.get(url, getAxiosConfig())
      .then(data => {
        this.setState({
          countryBlacklist: data.data
        });
      })
      .catch(error => {
        NotificationManager.error(USER_SERVERROR + " " + error, "", LONG);
      });
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

    if (!this.state.country.id) {
      NotificationManager.info("Please select country.");
    } else {
      if (
        window.confirm(
          "Are you sure you wish to add Country: " +
          this.state.country.name +
          " to blacklist?"
        )
      ) {

        const apiHost = Config.getValue('apiHost');
        const url = `${apiHost}admin/countryBlacklist`;

        const country = {
          countryId: this.state.country.id,
          code: this.state.country.code,
          name: this.state.country.name
        };

        Axios.post(url, country, getAxiosConfig())
          .then(data => {
            NotificationManager.success(this.state.country.name + " " + ADDED_TO_BLACKLIST, "", LONG);

            this.setState({country: {}});
            this.getCountryBlacklist();

            this.props.history.push("/profile/admin/countryBlacklist");
          })
          .catch(error => {
            NotificationManager.error(this.state.country.name + " " + NOT_ADDED_TO_BLACKLIST, "", LONG);
          });
      }
    }
  }

  // getCountryBlacklist(page) {
  //   const apiHost = Config.getValue('apiHost');
  //   const url = `${apiHost}admin/countryBlacklist?page=${page}`;
  //
  //   Axios.get(url, getAxiosConfig())
  //     .then(data => {
  //       this.setState({
  //         loading: false,
  //         totalElements: data.totalElements,
  //         countryBlacklist: data.data
  //       });
  //     })
  //     .catch(error => {
  //       NotificationManager.error(USER_SERVERROR + " " + error, "", LONG);
  //     });
  // }

  getCountryBlacklist() {
    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}admin/countryBlacklist`;

    Axios.get(url, getAxiosConfig())
      .then(data => {
        this.setState({
          countryBlacklist: data.data
        });
      })
      .catch(error => {
        NotificationManager.error(USER_SERVERROR + " " + error, "", LONG);
      });
  }

  addCountryToWhitelist(e, country) {
    const apiHost = Config.getValue('apiHost');
    const url = `${apiHost}admin/countryBlacklist/remove`;

    const sendCountry = {
      [country.id]: country.countryId
    };

    Axios.post(url, sendCountry, getAxiosConfig())
      .then(data => {
        NotificationManager.success(country.name + " " + REMOVED_FROM_BLACKLIST, "", LONG);

        this.getCountryBlacklist();
        this.props.history.push("/profile/admin/countryBlacklist");
      })
      .catch(error => {
        NotificationManager.error(country.name + " " + NOT_REMOVED_FROM_BLACKLIST, "", LONG);
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

    const {countryBlacklist, countries, country} = this.state;

    // const countriesArray = [{id: -1, name: 'Country'}, ...countries];

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

    const styleLabel = {
      display: 'block',
      margin: '10px 0 5px 5px'
    };

    const styleButton = {
      margin: '5px 0 5px 5px',
    };

    const styleOption = {
      width: '50%',
      border: '1px solid #cfcfcf',
      borderRadius: '5px',
      backgroundColor: 'white',
      padding: '15px',
      webkitAppearance: 'menulist',
      appearance: 'menulist'
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

              <select name="country" id="address" onChange={this.updateCountry} value={JSON.stringify(country)}
                      style={styleOption}>
                <option value="">Country</option>
                {countries && countries.map((item, i) => {
                  return <option key={i} value={JSON.stringify(item)}>{item.name}</option>;
                })}
              </select>
              <button className="btn" id="btnText" name="btnText" style={styleButton}>
                Add Country to Blacklist
              </button>

            </div>
          </form>
        </div>

        <div className="container reservations-edit-form">
          <div>
            {(!countryBlacklist || countryBlacklist.length === 0) ? (
              <NoEntriesMessage text="No Countries in Blacklist"/>
            ) : (
              <div className="reservations-table">
                <table style={styleTable}>
                  <thead>
                  <tr>
                    <th style={styleTh}>#</th>
                    <th style={styleTh}>Country Name</th>
                    <th style={styleTh}>Country Code</th>
                    <th style={styleTh}>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {countryBlacklist && countryBlacklist.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td style={styleTd}>{item.id}</td>
                        <td style={styleTd}>{item.name}</td>
                        <td style={styleTd}>{item.code}</td>
                        <td style={styleTd}>
                          <button onClick={(e) => this.addCountryToWhitelist(e, item)}
                                  className="btn"
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
