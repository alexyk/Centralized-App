// @flow
import React from "react";
import AffiliatesDashboard from "./AffiliatesComponent";
import { AffiliatesService } from "./service/affiliates-rest-client";

import type {
  AffiliateBooking,
  RevenueChartData,
  AffiliatesChartData
} from "./AffiliatesComponent.flow";

type State = {
  totalAffiliates: number,
  totalRevenue: number,
  affiliateBookings: Array<AffiliateBooking>,
  affiliatesChartData: AffiliatesChartData,
  revenueChartData: RevenueChartData
};

type Props = {};

export default class PopulatedAffiliatesPage extends React.Component<
  Props,
  State
> {
  toggleItemsRefresh: Function;
  getGeneralAffiliatesData: Function;
  getChartData: Function;

  constructor(props: Props) {
    super(props);

    this.toggleItemsRefresh = this.toggleItemsRefresh.bind(this);
    this.getGeneralAffiliatesData = this.getGeneralAffiliatesData.bind(this);
    this.getChartData = this.getChartData.bind(this);

    this.state = {
      totalAffiliates: 0,
      totalRevenue: 0,
      affiliateBookings: [],
      affiliatesChartData: [],
      revenueChartData: []
    };
  }

  componentDidMount() {
    this.getGeneralAffiliatesData();
    this.getChartData();
    this.toggleItemsRefresh();
  }

  getGeneralAffiliatesData() {
    AffiliatesService.getGeneralAffiliateData().then(
      ({ totalAffiliates, totalRevenue }) => {
        this.setState({
          totalAffiliates,
          totalRevenue
        });
      }
    );
  }

  getChartData() {
    AffiliatesService.getChartData().then(
      ({ affiliatesChartData, revenueChartData }) => {
        this.setState({
          affiliatesChartData,
          revenueChartData
        });
      }
    );
  }

  toggleItemsRefresh(page: number = 1) {
    AffiliatesService.getBookings(page).then(affiliateBookings => {
      this.setState({
        affiliateBookings: affiliateBookings.bookings
      });
    });
  }

  render() {
    const bookingPaginationOptions = {
      onPageChange: this.toggleItemsRefresh,
      totalElements: 22,
      initialPage: 1,
      pageSize: 10
    };

    return (
      <AffiliatesDashboard
        totalAffiliates={this.state.totalAffiliates}
        totalRevenue={this.state.totalRevenue}
        affiliateBookings={this.state.affiliateBookings}
        affiliatesChartData={this.state.affiliatesChartData}
        revenueChartData={this.state.revenueChartData}
        noBookingsText={"Sorry, no bookings yet!"}
        // onPageChange={this.toggleItemsRefresh}
        bookingPaginationOptions={bookingPaginationOptions}
        onWithdraw={console.log}
      />
    );
  }
}
