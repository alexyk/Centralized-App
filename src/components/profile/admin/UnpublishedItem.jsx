import React from 'react';
import '../../../styles/css/components/profile/admin_panel/unpublished-item.css';

export default function UnpublishedListing(props) {
  return (
    <div className="unpublished-item">
      <div className="unpublished-item_images">
        <div style={{ backgroundImage: 'url(' + '"https://static.locktrip.com/RXLImages/7/SOF-HOL1hotel_Exterior_2.jpg"' + ')' }}>
        </div>
      </div>
      <div className="unpublished-item_content">
        <h2>Listing name</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
        <p>Price - $225 (LOC104)</p>
        <div className="unpublished-item_actions">
          <div className="minor-actions">
            <div><a href="#">Expand Details</a></div>
            <div><a href="#">Contact Host</a></div>
            <div><a href="#" className="delete">Delete</a></div>
          </div>
          <div className="major-actions">
            <div><a href="#">Approve</a></div>
            <div><a href="#">Deny</a></div>
          </div>
        </div>
      </div>
    </div>
  );
}