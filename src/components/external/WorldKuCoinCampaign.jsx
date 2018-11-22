
import React from 'react';
import { withRouter } from 'react-router-dom';

class WorldKuCoinCampaign extends React.Component {

  render() {
    return <div>
      <section id="wallet-index">
        <div className="container">
          <div className="row">
            <div className="after-header" />
            <div className="col-md-11">
              <div id="profile-edit-form">
                <h2>
                  Airdrop completed. The available spots have been exceeded. Thank you for participating! The payout will be made between
                  15th and 30th July. For more info and future airdrops, please join our <a href="https://t.me/locktrip_kucoin_bounty" rel="noopener noreferrer" target="_blank"><b><u>airdrop telegram</u></b></a>
                </h2>
                <br />
              </div>
            </div>
            <div className="before-footer clear-both" />
          </div>
        </div>
      </section>
    </div>;
  }
}

export default withRouter(WorldKuCoinCampaign);
