// @flow

import StatisticsPanel from "./StatisticsPanel";
import BookingsListPanel from "./BookingsListPanel";
import React from "react";

import type {
  AffiliateBooking,
  RevenueChartData,
  AffiliatesChartData
} from "./AffiliatesComponent.flow";

type Props = {
  noBookingsText: string,
  onPageChange: Function,
  list: Array<AffiliateBooking>,
  revenueChartData: RevenueChartData,
  affiliatesChartData: AffiliatesChartData,
  bookingPaginationOptions: Object
};

type State = {
  showAsStats: boolean
};

export default class BookingsAndStats extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showAsStats: false
    };

    this.showStatsPanel = this.showStatsPanel.bind(this);
    this.showBookingsPanel = this.showBookingsPanel.bind(this);
  }

  /**
   * Show Stats Panel
   */
  // Toggle
  showStatsPanel() {
    this.setState({
      showAsStats: true
    });
  }

  /**
   * Show Bookings Panel
   */
  showBookingsPanel() {
    this.setState({
      showAsStats: false
    });
  }

  render() {
    let { showAsStats: statsAreActive } = this.state;
    let bookingsAreActive = !statsAreActive;

    let {
      noBookingsText,
      list,
      revenueChartData,
      affiliatesChartData
    } = this.props;
    return (
      <div>
        <BookingsListPanel
          list={list}
          noBookingsText={noBookingsText}
          bookingPaginationOptions={this.props.bookingPaginationOptions}
        />
        <StatisticsPanel
          revenueChartData={revenueChartData}
          affiliatesChartData={affiliatesChartData}
        />
      </div>
    );
  }
}
