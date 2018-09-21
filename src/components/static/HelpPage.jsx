import React from 'react';

import '../../styles/css/components/static/help-page.css';

function HelpPage() {
  return (
    <React.Fragment>
      <div id='help-page'>
        <div className='container help-page__content'>
          <h2>FAQ</h2>
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