import React from 'react';

import '../../styles/css/components/static/help-page.css';

function HelpPage() {
  return (
    <React.Fragment>
      <div id='help-page'>
        <div className='container help-page__content'>
          <h2>FAQ</h2>
          <h4>Customer Support</h4>
          <p>You can contact our team by:</p>
          <ul>
            <li>phone: +359899811454</li>
            <li>email: <a href="mailto:team@locktrip.com?Subject=Customer%20Support" target="_top" className='customer-support-email'>team@locktrip.com</a></li>
          </ul>
          <br/>
          <hr/>
          <h4>Refund/Cancellation Policy</h4>
          <p>Property owner can allow cancelation of booking and return of funds.</p>
          <ul>
            <li>Property owner can define percent of amount returned and a deadline date.</li>
            <li>Conditions and LOC are hold on the blockchain, which gives 100% guarantee of execution of rules for both property owner and customer.</li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}

export default HelpPage;