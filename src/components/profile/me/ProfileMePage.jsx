import { Route, Switch } from 'react-router-dom';

import ProfileEditForm from './ProfileEditForm';
import ProfileNav from './ProfileNav';
import ProfilePhotosPage from './ProfilePhotosPage';
import ProfileVerificationPage from './ProfileVerificationPage';
import React from 'react';

function ProfileMePage() {
  return (
    <div>
      <section id="profile-edit">
        <div className="container">
          <div className="row">
            <div className="after-header" />
            <div className="col-md-3">
              <ProfileNav />
            </div>
            <div className="col-md-8">
              <Switch>
                <Route exact path="/profile/me/edit" render={() => <ProfileEditForm />} />
                <Route exact path="/profile/me/edit/photos" render={() => <ProfilePhotosPage />} />
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

export default ProfileMePage;
