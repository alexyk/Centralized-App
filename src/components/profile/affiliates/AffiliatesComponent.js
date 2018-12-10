// @flow
import React from "react";
import "./affiliates.css";
import { ensureNaturalNumber } from "./helpers";
import BookingsAndStats from "./BookingsAndStats";

import type {
  AffiliateBooking,
  AffiliatesChartData,
  RevenueChartData
} from "./AffiliatesComponent.flow";

type Props = {
  totalAffiliates: number,
  totalRevenue: number,
  affiliateBookings: Array<AffiliateBooking>,
  noBookingsText: string,
  onPageChange: Function,
  onWithdraw: Function,
  affiliatesChartData: AffiliatesChartData,
  revenueChartData: RevenueChartData
};

export default class AffiliatesDashboard extends React.Component<Props> {
  render() {
    let totalAffiliates = ensureNaturalNumber(this.props.totalAffiliates);
    let totalRevenue = ensureNaturalNumber(this.props.totalRevenue);
    let thresholdMessage = "minimum withdrawal threshold is $50";
    return (
      <div className={"container"}>
        <h2>My Affiliates</h2>
        <hr />
        <div>
          <h3>
            Total affiliates:{" "}
            <span data-testid="total-affiliates">{totalAffiliates}</span>
          </h3>

          <h3>
            Accumulated Revenue: <span>$</span>
            <span data-testid="total-revenue">{totalRevenue}</span>
          </h3>

          <div>
            <button
              data-testid="withdraw-button"
              className="btn"
              onClick={this.props.onWithdraw}
            >
              Withdraw Revenue
            </button>
            <span className={"threshold-message"}>{thresholdMessage}</span>
          </div>
          <div>
            <BookingsAndStats
              list={this.props.affiliateBookings}
              onPageChange={this.props.onPageChange}
              noBookingsText={this.props.noBookingsText}
              affiliatesChartData={this.props.affiliatesChartData}
              revenueChartData={this.props.revenueChartData}
            />
          </div>
        </div>
      </div>
    );
  }
}
