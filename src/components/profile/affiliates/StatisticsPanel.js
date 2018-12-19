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
              className={`btn ${showStatsForRevenue && "active"}`}
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
  return (
    <div data-testid="panels-chart-revenue">
      <Chart chartType="Line" data={[["Days", "Revenue"], ...data]} />
    </div>
  );
}
export function MyAffiliates({ data = [] }: { data: AffiliatesChartData }) {
  return (
    <div data-testid="panels-chart-affiliates">
      <Chart chartType="Line" data={[["Days", "New Affiliates"], ...data]} />
    </div>
  );
}
