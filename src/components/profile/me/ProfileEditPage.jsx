import { Route, Switch } from 'react-router-dom';

import ProfileAdditionalInfo from './ProfileAdditionalInfo';
import ProfileEditForm from './ProfileEditForm';
import ProfileEditNav from './ProfileEditNav';
import ProfilePhotosPage from './ProfilePhotosPage';
import ProfileVerificationPage from './ProfileVerificationPage';
import React from 'react';

function ProfileEditPage() {
  return (
    <div>
      <section id="profile-edit">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <ProfileEditNav />
            </div>
            <div className="col-md-8">
              <Switch>
                <Route exact path="/profile/me/edit" render={() => <ProfileEditForm />} />
                <Route exact path="/profile/me/edit/photos" render={() => <ProfilePhotosPage />} />
                <Route exact path="/profile/me/additional-info" render={() => <ProfileAdditionalInfo /> } />
                <Route exact path="/profile/me/verification" render={() => <ProfileVerificationPage />} />
              </Switch>
            </div>
            <div className="before-footer clear-both" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProfileEditPage;
