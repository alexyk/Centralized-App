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
  }

  getGeneralAffiliatesData() {
    AffiliatesService.getGeneralAffiliateData().then(
      ({ totalAffiliates, totalRevenue, affiliateBookings }) => {
        this.setState({
          totalAffiliates,
          totalRevenue,
          affiliateBookings
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

  toggleItemsRefresh(page: number) {
    AffiliatesService.getBookings(page).then(affiliateBookings => {
      this.setState({
        affiliateBookings
      });
    });
  }

  render() {
    return (
      <AffiliatesDashboard
        totalAffiliates={21}
        totalRevenue={250.5}
        affiliateBookings={this.state.affiliateBookings}
        affiliatesChartData={this.state.affiliatesChartData}
        revenueChartData={this.state.revenueChartData}
        noBookingsText={"Sorry, no bookings yet!"}
        onPageChange={this.toggleItemsRefresh}
        onWithdraw={console.log}
      />
    );
  }
}
