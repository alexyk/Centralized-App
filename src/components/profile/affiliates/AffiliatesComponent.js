// @flow
import React from "react";
import "./affiliates.css";
import { ensureNaturalNumber } from "./helpers";
import BookingsAndStats from "./BookingsAndStats";
import Clipboard from "react-clipboard.js";
import {Link} from "react-router-dom"
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
  bookingPaginationOptions: Object,
  onWithdraw: Function,
  affiliatesChartData: AffiliatesChartData,
  revenueChartData: RevenueChartData,
  affiliateLink: string
};

export default class AffiliatesDashboard extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.addEventListener("resize", this.forceUpdate);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.forceUpdate);
  }

  render() {
    let totalAffiliates = ensureNaturalNumber(this.props.totalAffiliates);
    let totalRevenue = ensureNaturalNumber(this.props.totalRevenue);
    let thresholdMessage = "minimum withdrawal threshold is $50";

    return (
      <div className={"container affiliates-container"}>
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className={"affiliates-head-section"}
        >
          <h2>My Affiliates</h2>

          <div style={{maxWidth: "500px"}}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>Invite people with this link: </span>
              <span id="foo" className={"referral-link"}>
                {this.props.affiliateLink}
              </span>

              <Clipboard
                data-clipboard-text={this.props.affiliateLink}
                button-title="Copy link"
              >
                <img
                  src={require("./images/assignment-icon.svg")}
                  alt="Copy to clipboard"
                />
              </Clipboard>
            </div>
            <div style={{    padding: "10px 0", fontSize: "10px"}}><Link to={"/affiliate-terms"}>By copying and/or distributing this unique reference URL, you automatically agree with the affiliate program terms and conditions[link].</Link></div>

          </div>
        </div>

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

          <div className="withdraw-button-wrapper">
            <button
              disabled
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
              noBookingsText={this.props.noBookingsText}
              affiliatesChartData={this.props.affiliatesChartData}
              revenueChartData={this.props.revenueChartData}
              bookingPaginationOptions={this.props.bookingPaginationOptions}
            />
          </div>
        </div>
      </div>
    );
  }
}
