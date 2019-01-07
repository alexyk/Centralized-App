import React from "react";
import Pagination from "./pagination";
import { AffiliateBooking } from "./AffiliatesComponent.flow";

type Props = {
  bookingPaginationOptions: {
    onPageChange: Function,
    totalElements: number,
    initialPage: number,
    pageSize: number
  },
  list: [AffiliateBooking]
};

type State = {
  currentPage: number
};

const defaultBookingPaginationOptions = {
  totalElements: 0,
  initialPage: 1,
  pageSize: 10
};

export default class BookingsListPanel extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    let bookingPaginationOptions =
      props.bookingPaginationOptions || defaultBookingPaginationOptions;
    this.state = {
      currentPage: bookingPaginationOptions.initialPage
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
        if (this.props.bookingPaginationOptions) {
          this.props.bookingPaginationOptions.onPageChange(
            this.state.currentPage
          );
        }
      }
    );
  }

  render() {
    let { currentPage } = this.state;
    let { list = [], noBookingsText } = this.props;
    let isEmpty = !list.length;
    let hasEntries = !isEmpty;
    let paginationProps =
      this.props.bookingPaginationOptions || defaultBookingPaginationOptions;

    return (
      <div data-testid="list-view" className={"bookings-list-holder"}>
        {isEmpty && (
          <div data-testid="no-bookings-text" className={"single-booking"}>
            {noBookingsText}
          </div>
        )}
        {hasEntries && this.listEntries()}

        <Pagination
          currentPage={currentPage}
          onPageChange={this.onBookingsPageChange}
          pageSize={paginationProps.pageSize}
          loading={false}
          totalElements={paginationProps.totalElements}
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
