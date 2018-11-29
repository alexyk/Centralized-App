import React from "react";
import Pagination from "./pagination";

export default class BookingsListPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0
    };

    this.onBookingsPageChange = this.onBookingsPageChange.bind(this);
    this.listEntries = this.listEntries.bind(this);
  }

  onBookingsPageChange(page) {
    this.setState(
      {
        currentPage: page
      },
      () => {
        this.props.onPageChange(this.state.currentPage);
      }
    );
  }

  render() {
    let { currentPage } = this.state;
    let { list = [], noBookingsText } = this.props;
    let isEmpty = !list.length;
    let hasEntries = !isEmpty;

    return (
      <div data-testid="list-view">
        {isEmpty && <div data-testid="no-bookings-text">{noBookingsText}</div>}
        {hasEntries && this.listEntries()}

        <Pagination
          currentPage={currentPage}
          onPageChange={this.onBookingsPageChange}
          pageSize={20}
          loading={false}
          totalElements={200}
        />
      </div>
    );
  }

  listEntries() {
    let { list = [] } = this.props;
    return list.map((booking, index) => (
      <div
        key={index}
        data-testid="bookings-list-item"
        className={"single-booking"}
      >
        Booking by affiliate with ID {booking.affiliateId} was made on{" "}
        {booking.date}, accumulating ${booking.revenue} of revenue
      </div>
    ));
  }
}
