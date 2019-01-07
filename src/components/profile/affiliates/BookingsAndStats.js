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

export default class BookingsAndStats extends React.Component<Props> {
  render() {
    let {
      noBookingsText,
      list,
      revenueChartData,
      affiliatesChartData
    } = this.props;
    return (
      <div>
        <StatisticsPanel
          revenueChartData={revenueChartData}
          affiliatesChartData={affiliatesChartData}
        />
        <BookingsListPanel
          list={list}
          noBookingsText={noBookingsText}
          bookingPaginationOptions={this.props.bookingPaginationOptions}
        />
      </div>
    );
  }
}
