// @flow

import React from "react";
import { Chart } from "react-google-charts";
import type {
  AffiliatesChartData,
  RevenueChartData
} from "./AffiliatesComponent.flow";

type Props = {
  revenueChartData: RevenueChartData,
  affiliatesChartData: AffiliatesChartData
};

type State = {
  showStatsForRevenue: boolean
};

export default class StatisticsPanel extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      showStatsForRevenue: false
    };

    this.showRevenueStats = this.showRevenueStats.bind(this);
    this.showAffiliateStats = this.showAffiliateStats.bind(this);
  }

  showRevenueStats() {
    this.setState({
      showStatsForRevenue: true
    });
  }

  showAffiliateStats() {
    this.setState({
      showStatsForRevenue: false
    });
  }

  render() {
    let { showStatsForRevenue } = this.state;
    let showStatsForAffiliates = !showStatsForRevenue;
    let { revenueChartData, affiliatesChartData } = this.props;
    return (
      <div data-testid="stats-view" className={"stats-chart"}>
        <div className={"chart-container"}>
          {showStatsForRevenue && <MyRevenue data={revenueChartData} />}
          {showStatsForAffiliates && (
            <MyAffiliates data={affiliatesChartData} />
          )}
        </div>
        <div className={"stats-controls"}>
          <div>
            <button
              className={`btn ${showStatsForAffiliates && "active"}`}
              onClick={this.showAffiliateStats}
              data-testid="stats-controls-affiliates"
            >
              Affiliates
            </button>
          </div>
          <div>
            <button
              className={`btn ${showStatsForRevenue &&
                "active"} revenue-button`}
              onClick={this.showRevenueStats}
              data-testid="stats-controls-revenue"
            >
              Revenue
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export function MyRevenue({ data = [] }: { data: RevenueChartData }) {
  debugger;
  let chart = data.length ? (
    <Chart chartType="Line" data={[["Days", "Revenue"], ...data]} />
  ) : (
    <div className={"chart-no-entries-message"}>
      No affiliate revenue made yet!
    </div>
  );
  return (
    <div data-testid="panels-chart-revenue" className={"chart-panel"}>
      {chart}
    </div>
  );
}
export function MyAffiliates({ data = [] }: { data: AffiliatesChartData }) {
  let chart = data.length ? (
    <Chart chartType="Line" data={[["Days", "New Affiliates"], ...data]} />
  ) : (
    <div className={"chart-no-entries-message"}>No affiliates yet!</div>
  );
  return (
    <div data-testid="panels-chart-affiliates" className={"chart-panel"}>
      {chart}
    </div>
  );
}
