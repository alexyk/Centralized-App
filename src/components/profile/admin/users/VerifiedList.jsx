import '../../../../styles/css/components/captcha/captcha-container.css';

import { NavLink, withRouter } from 'react-router-dom';

import AdminNav from '../AdminNav';
import ListItem from './ListItem';
import NoEntriesMessage from '../../common/NoEntriesMessage';
import { NotificationManager } from 'react-notifications';
import Pagination from '../../../common/pagination/Pagination';
import PropTypes from 'prop-types';
import React from 'react';
import queryString from 'query-string';
import requester from '../../../../initDependencies';

class VerifiedList extends React.Component {
  constructor(props) {
    super(props);

    let searchMap = queryString.parse(this.props.location.search);
    this.state = {
      users: [],
      loading: true,
      totalElements: 0,
      currentPage: !searchMap.page ? 0 : Number(searchMap.page),
    };

    this.onPageChange = this.onPageChange.bind(this);
    this.updateUserStatus = this.updateUserStatus.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    requester.getAllVerifiedUsers().then(res => {
      res.body.then(data => {
        this.setState({ users: data.content, loading: false, totalElements: data.totalElements });
      });
    });
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

    requester.getAllVerifiedUsers([`page=${page - 1}`]).then(res => {
      res.body.then(data => {
        this.setState({
          users: data.content,
          totalElements: data.totalElements,
          loading: false
        });
      });
    });
  }

  updateUserStatus(event, id, verified) {
    if (event) {
      event.preventDefault();
    }

    let userObj = {
      id: id,
      verified: verified
    };

    requester.changeUserStatus(userObj).then(res => {
      if (res.success) {
        NotificationManager.info('User unverified');
        const allUsers = this.state.users;
        const newUsers = allUsers.filter(x => x.id !== id);
        const totalElements = this.state.totalElements;
        this.setState({ users: newUsers, totalElements: totalElements - 1 });
        if (newUsers.length === 0 && totalElements > 0) {
          this.onPageChange(1);
        }
      }
      else {
        NotificationManager.error('Something went wrong', 'Users Operations');
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <div className="loader" style={{ 'marginBottom': '40px' }}></div>;
    }

    return (
      <div>
        <AdminNav>
          <div>
            <li><NavLink exact activeClassName="active" to="/profile/admin/users/unverified"><h2>Unverified</h2></NavLink></li>
            <li><NavLink exact activeClassName="active" to="/profile/admin/users/verified"><h2>Verified</h2></NavLink></li>
          </div>
        </AdminNav>
        <div className="my-reservations">
          <section id="profile-my-reservations">
            <div>
              {this.state.users.length === 0
                ? <NoEntriesMessage text="No users to show" />
                : <div>
                  {this.state.users.map((item, i) => {
                    return (
                      <ListItem
                        key={i}
                        item={item}
                        verified={true}
                        updateUserStatus={this.updateUserStatus}
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
            </div>
          </section>
        </div>
      </div>
    );
  }
}

VerifiedList.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(VerifiedList);