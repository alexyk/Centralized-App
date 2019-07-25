import '../../../../styles/css/components/profile/admin/unpublished-item.css';

import {Config} from '../../../../config.js';
import PropTypes from 'prop-types';
import React from 'react';
import RulesModal from './rules/RulesModal';
import Axios from "axios";
import {getAxiosConfig} from "../utils/adminUtils";
import {NotificationManager} from "react-notifications";


export default class ListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rulesModal: false
    };

    this.onRulesClick = this.onRulesClick.bind(this);
    this.onRulesModelClose = this.onRulesModelClose.bind(this);
  }


  onRulesModelClose(...args) {
    console.log('onRulesModelClose', {args});
    this.setState({rulesModal: false});
  }

  onRulesClick(e) {
    if (e) {
      e.preventDefault();
    }

    this.setState({rulesModal: !this.state.rulesModal});
  }

  render() {
    const {
      firstName, id, lastName, city, country, email, phoneNumber, idCardPicture, idCardHolderPicture, address, zipCode
    } = this.props.item;


    const {verified, blocked, updateUserBlockedStatus, updateUserStatus} = this.props;

    const {rulesModal} = this.state;

    return (
      <div className="unpublished-item">
        <div className="unpublished-item_images">
          {idCardPicture && <img alt="id-card" src={Config.getValue('imgHost') + idCardPicture}/>}
        </div>
        <div className="unpublished-item_content">
          <div className="header">
            <h2><span>{firstName} {lastName}</span></h2>
            <h6>{email}</h6>

            <p>Phone number: {phoneNumber ? phoneNumber : 'Missing'}</p>
            <p>Country: {country && country.name ? country.name : 'Missing'}</p>
            <p>City: {city ? city : 'Missing'}</p>
            <p>Address: {address ? address : 'Missing'}</p>
            <p>Zip code: {zipCode ? zipCode : 'Missing'}</p>
            {idCardHolderPicture && <img alt="id-card-and-holder" src={Config.getValue('imgHost') + idCardHolderPicture}
                                         style={{width: '50%'}}/>}
          </div>

          {rulesModal && rulesModal === true && <div> <RulesModal isActive={rulesModal} user={id} email={email} onClose={this.onRulesModelClose}/></div>}
          <div className="unpublished-item_actions">
            <div className="minor-actions">

            </div>
            <div className="major-actions">
              {verified === false &&
              <div><a href="" onClick={(e) => updateUserStatus(e, id, true)}>Verify</a></div>
              }
              {verified === true &&
              <div><a href="" onClick={(e) => updateUserStatus(e, id, false)}>Unverify</a></div>
              }
              {blocked === false &&
              <div><a href="" onClick={(e) => updateUserBlockedStatus(e, id, email, true)}>Block</a></div>
              }
              {blocked === true &&
              <div><a href="" onClick={(e) => updateUserBlockedStatus(e, id, email, false)}>Unblock</a></div>
              }
              <div><a href="" onClick={this.onRulesClick}>Rules</a></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ListItem.propTypes = {
  item: PropTypes.object,
  updateUserStatus: PropTypes.func,
  verified: PropTypes.bool,
  blocked: PropTypes.bool,
  updateUserBlockedStatus: PropTypes.func
};
