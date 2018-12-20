import '../../styles/css/main.css';
import '../../styles/css/components/captcha/captcha-container.css';
import React from 'react';
import referralIdPersister from '../profile/affiliates/service/persist-referral-id';
import {Config} from '../../config';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

type Props = {
  persistReferralId:  Function,
  requestExchangeRates: Function,
  requestLocEurRate: Function,
  requestCountries: Function,
  initCalendar: Function,
  location: {
    search: string
  }
}


export default class AppFunctionality extends React.Component<Props> {

  static defaultProps = {
    initCalendar: ()=>{
      BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment.utc()));
    },
    persistReferralId: referralIdPersister.tryToSetFromSearch,
    isAuthenticated() {
      let token = localStorage.getItem(Config.getValue('domainPrefix') + '.auth.locktrip');
      if (token) {
        return true;
      }
      return false;
    }
  }

  componentDidMount() {
    this.props.initCalendar();
    this.props.persistReferralId(this.props.location.search);
    this.props.requestExchangeRates();
    this.props.requestLocEurRate();
    this.props.requestCountries();
  }

  render() {
    return null;
  }
}
