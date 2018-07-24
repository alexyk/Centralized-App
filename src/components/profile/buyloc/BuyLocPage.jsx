import React from 'react';
import BancorConvertWidget from '../../external/BancorConvertWidget';

import '../../../styles/css/components/profile/buyloc/buyloc-page.css';

function BuyLocPage() {
  return (
    <div id='buyloc-page'>
      <div className="buyloc-page__content">
        <div className="container ">
          <p>You can buy LOC immediately through your Metamask Wallet, Trezor or Bancor Wallet by using the tool below. It doesn’t require any registration and you will receive your tokens right back to your Metamask wallet. Alternitavely, you can also buy LOC from Exchange. For more info on how to do that, please <a href='https://medium.com/@LockChainCo/buy-loc-on-exchange-aftermarket-launch-on-friday-15th-dec-2017-bb1950d29c7f' target='_blank' rel='noopener noreferrer'>read this post.</a></p>
        </div>
      </div>
      <BancorConvertWidget />
      <div className="bottom-padder"></div>
    </div>
  );
}

export default BuyLocPage;