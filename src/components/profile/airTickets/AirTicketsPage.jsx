import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import Pagination from '../../../common/pagination/Pagination';
import AirTicketsList from './AirTicketsList';
import * as tickets from './mock.json';

class AirTicketsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tickets: [],
      loading: true
    };

    this.onPageChange = this.onPageChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      loading: false,
      tickets
    });
  }

  onPageChange() {
    
  }

  render() {
    const { loading, tickets } = this.state;

    if (loading) {
      return <div className="loader"></div>;
    }

    return (
      <div className="container">
        <section>
          <div>
            <h2>Latest Tickets</h2>
            <AirTicketsList
              tickets={tickets}
            />
            {/* <Pagination
              loading={this.state.totalListings === 0}
              onPageChange={this.onPageChange}
              currentPage={this.state.currentPage}
              totalElements={this.state.totalTrips}
            /> */}
          </div>
        </section>
      </div>
    );
  }
}

AirTicketsPage.propTypes = {
};

export default withRouter(connect()(AirTicketsPage));
