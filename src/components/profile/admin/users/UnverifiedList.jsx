import '../../../../styles/css/components/captcha/captcha-container.css';

import { NavLink, withRouter } from 'react-router-dom';

import AdminNav from '../AdminNav';
import { Config } from '../../../../config';
import ListItem from './ListItem';
import NoEntriesMessage from '../../common/NoEntriesMessage';
import { NotificationManager } from 'react-notifications';
import Pagination from '../../../common/pagination/Pagination';
import PropTypes from 'prop-types';
import ReCAPTCHA from 'react-google-recaptcha';
import React from 'react';
import queryString from 'query-string';
import requester from '../../../../initDependencies';

class UnverifiedList extends React.Component {
  constructor(props) {
    super(props);

    let searchMap = queryString.parse(this.props.location.search);
    this.state = {
      users: [{
        firstName: 'Anna',
        gender: 'Women',
        id: 87,
        lastName: 'Nowak',
        city: null,
        country: 'Poland',
        email: 'anna123@gmail.com',
        birthday: '28/07/1995',
        image: 'users/images/default.png',
        verified: false,
        idImage: 'https://dokumencik.com.pl/wp-content/uploads/2016/04/EuropeanIdCard2_A-1.jpg'
      },{
        firstName: 'Christian',
        gender: null,
        id: 87,
        lastName: 'Pamidoff',
        city: null,
        country: null,
        email: 'chrispam1509@gmail.com',
        birthday: '15/09/2000',
        image: 'users/images/default.png',
        verified: false
      },{
        firstName: 'Christian',
        gender: null,
        id: 87,
        lastName: 'Pamidoff',
        city: null,
        country: null,
        email: 'chrispam1509@gmail.com',
        birthday: '15/09/2000',
        image: 'users/images/default.png',
        verified: false
      },{
        firstName: 'Christian',
        gender: null,
        id: 87,
        lastName: 'Pamidoff',
        city: null,
        country: null,
        email: 'chrispam1509@gmail.com',
        birthday: '15/09/2000',
        image: 'users/images/default.png',
        verified: false
      },{
        firstName: 'Christian',
        gender: null,
        id: 87,
        lastName: 'Pamidoff',
        city: null,
        country: null,
        email: 'chrispam1509@gmail.com',
        birthday: '15/09/2000',
        image: 'users/images/default.png',
        verified: false
      },],
      loading: false,
      totalElements: 0,
      currentPage: !searchMap.page ? 0 : Number(searchMap.page),
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.updateListingStatus = this.updateListingStatus.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    // requester.getAllPublishedListings().then(res => {
    //   res.body.then(data => {
    //     this.setState({ listings: data.content, loading: false, totalElements: data.totalElements });
    //   });
    // });
  }


  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  onPageChange(page) {
    this.setState({
      currentPage: page - 1,
      loading: true
    });

    // requester.getAllPublishedListings(page - 1).then(res => {
    //   res.body.then(data => {
    //     this.setState({
    //       users: data.content,
    //       totalElements: data.totalElements,
    //       loading: false
    //     });
    //   });
    // });
  }

  updateListingStatus(event, id, status) {
    if (event) {
      event.preventDefault();
    }

    let unpublishObj = {
      listingId: id,
      state: status
    };

    requester.changeListingStatus(unpublishObj).then(res => {
      if (res.success) {
        NotificationManager.info('Listing unpublished');
        const allListings = this.state.listings;
        const newListings = allListings.filter(x => x.id !== id);
        const totalElements = this.state.totalElements;
        this.setState({ listings: newListings, totalElements: totalElements - 1 });
        if (newListings.length === 0 && totalElements > 0) {
          this.onPageChange(1);
        }
      }
      else {
        NotificationManager.error('Something went wrong', 'Listings Operations');
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <div className="loader" style={{ 'margin-bottom': '40px' }}></div>;
    }

    return (
      <div>
        <AdminNav>
          <li><NavLink exact activeClassName="active" to="/profile/admin/users/unverified"><h2>Unverified</h2></NavLink></li>
          <li><NavLink exact activeClassName="active" to="/profile/admin/users/verified"><h2>Verified</h2></NavLink></li>
        </AdminNav>
        <div className="my-reservations">
          <section id="profile-my-reservations">
            <div>
              {this.state.users.length === 0
                ? <NoEntriesMessage text="No users to show" />
                : <div>
                  {this.state.users.map((l, i) => {
                    return (
                      <ListItem
                        key={i}
                        item={l}
                        updateListingStatus={this.updateListingStatus}
                      />
                    );
                  })}
                </div>
              }

              <Pagination
                loading={this.state.totalReservations === 0}
                onPageChange={this.onPageChange}
                currentPage={this.state.currentPage + 1}
                pageSize={20}
                totalElements={this.state.totalElements}
              />

              <div className='captcha-container'>
                <ReCAPTCHA
                  ref={el => this.captcha = el}
                  size="invisible"
                  sitekey={Config.getValue('recaptchaKey')}
                  onChange={token => { this.handleDeleteListing(token); this.captcha.reset(); }}
                />

              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

UnverifiedList.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(UnverifiedList);
