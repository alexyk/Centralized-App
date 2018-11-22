import React from 'react';

import '../../styles/css/components/static/help-page.scss';

function HelpPage() {
  return (
    <React.Fragment>
      <div id='help-page'>
        <div className='container help-page__content'>
          <h4>FAQ</h4>
          <div className='question'>
            <p>Q: What is LockTrip?</p>
            <p>A: LockTrip is a blockchain powered marketplace &amp; technology, where hoteliers and property owners can rent their property globally, collect money and manage bookings without paying any commissions to middlemen.</p>
          </div>

          <div className='question'>
            <p>Q: Where is LockTrip registered?</p>
            <p>A: LockTrip is registered in Sofia, Bulgaria.</p>
          </div>

          <div className='question'>
            <p>Q: What is the LOC Token?</p>
            <p>A: The LOC token is an invariable  part of the LockTrip ecosystem and is the utility token that gives access to both clients and hotel owners to the decentralized LOC Ledger.</p>
          </div>

          <div className='question'>
            <p>Q: What is the circulating supply of the LOC Token? </p>
            <p>A: You can check the circulating supply on our Coinmarketcap profile page: <a href='https://coinmarketcap.com/currencies/lockchain' target="_blank" rel='noopener noreferrer' className='link'>https://coinmarketcap.com/currencies/lockchain</a></p>
          </div>

          <div className='question'>
            <p>Q: How is LockTrip different than existing booking platforms?</p>
            <p>A: Existing  platforms  (e.g.  Booking.com,  Airbnb.com,  Expedia.com)  are  centralized  and  charge  substantial fees from the property owner and/or the end customer. Additional middlemen are the payment  processors.  All  listings  and  deal  parameters  on  LockTrip  will  be  decentralized  on  the  Ethereum blockchain VM, eliminating all middlemen and guaranteeing transparent execution via smart contracts.</p>
          </div>

          <div className='question'>
            <p>Q: Who manages LockTrip?</p>
            <p>A: Our team has been operating in the digital space for more than a decade, with centuries of combined expertise in fields as diverse as travel, technical innovations, software engineering, politics, fintech, and crypto-currency. The majority shareholders are the project&#39;s founders Nikola Alexandrov and Hristo Tenchev.</p>
          </div>

          <div className='question'>
            <p>Q: Who are LockTrip&#39;s advisors?</p>
            <p>A: LockTrip is proud to be backed by a strong and prominent Advisory Board that includes the president of Bulgaria and the co-founder of SoftUni Educational Center. You can check our Board of Advisors at: <a href='https://locktrip.com/#team_advisor' target="_blank" rel='noopener noreferrer' className='link'>https://locktrip.com/#team_advisor</a></p>
          </div>

          <div className='question'>
            <p>Q: What is LockTrip’s corporate mailing address?</p>
            <p>A: Feel free to reach LockTrip at <a href="mailto:team@locktrip.com?Subject=Customer%20Support" target="_top" className='customer-support-email'>team@locktrip.com</a></p>
          </div>
          <hr/>

          <h4>Customer Support</h4>
          <p>You can contact our team by:</p>
          <ul>
            <li>phone: +359899811454</li>
            <li>email: <a href="mailto:team@locktrip.com?Subject=Customer%20Support" target="_top" className='customer-support-email'>team@locktrip.com</a></li>
          </ul>
          <br />
          <hr />
          <h4>Refund/Cancellation Policy</h4>
          <p>Property owner can allow cancellation of booking and return of funds.</p>
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