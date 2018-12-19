// @flow
import React from "react";
import AffiliatesDashboard from "./AffiliatesComponent";
import { AffiliatesService } from "./service/affiliates-rest-client";
import { selectors } from "../../../reducers/userInfo";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
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
  revenueChartData: RevenueChartData,
  bookingPaginationOptions: {
    totalElements: number,
    initialPage: number,
    pageSize: number
  }
};

type Props = {};

class PopulatedAffiliatesPage extends React.Component<Props, State> {
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
      revenueChartData: [],
      bookingPaginationOptions: {
        totalElements: 0,
        initialPage: 1,
        pageSize: 10
      }
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
        debugger;
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
      debugger;
      this.setState({
        affiliateBookings: affiliateBookings.bookings,
        bookingPaginationOptions: affiliateBookings.pagination
      });
    });
  }

  render() {
    const bookingPaginationOptions = {
      ...this.state.bookingPaginationOptions,
      onPageChange: this.toggleItemsRefresh
    };
    let referralLink = this.props.userId
      ? `${window.location.origin}/?refId=${this.props.userId}`
      : "";
    return (
      <AffiliatesDashboard
        totalAffiliates={this.state.totalAffiliates}
        totalRevenue={this.state.totalRevenue}
        affiliateBookings={this.state.affiliateBookings}
        affiliatesChartData={this.state.affiliatesChartData}
        revenueChartData={this.state.revenueChartData}
        noBookingsText={"There are no affiliate bookings yet!"}
        bookingPaginationOptions={bookingPaginationOptions}
        onWithdraw={console.log}
        affiliateLink={referralLink}
      />
    );
  }
}
export default connect(function mapStateToProps(state) {
  return {
    userId: selectors.getUserId(state.userInfo)
  };
})(withRouter(PopulatedAffiliatesPage));
