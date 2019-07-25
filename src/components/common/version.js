import React, { Component } from 'react';
import packageJson from '../../../package.json';
import { isMobileWebView} from '../../services/utilities/mobileWebViewUtils';


export default class Version extends Component {
  render() {
    const version = <span style={{fontSize: "10px",float:"right"}}>v{packageJson.version} </span>;

    if (isMobileWebView) {
      return (
        <div>
          &nbsp;&nbsp;&nbsp;
          { version }
        </div>
      )
    } else {
      return version;
    }
  }
}
