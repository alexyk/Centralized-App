import BancorConvertWidget from '../external/BancorConvertWidget';
import HomesHeroComponent from './HomesHeroComponent';
// import PopularListingsCarousel from '../common/listing/PopularListingsCarousel';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import requester from '../../initDependencies';
import { withRouter } from 'react-router-dom';
import PopularDestinationsCarousel from '../hotels/carousel/PopularDestinationsCarousel';

class HomesHomePage extends React.Component {
  constructor(props) {
    super(props);

    let startDate = moment().add(1, 'day');
    let endDate = moment().add(2, 'day');

    this.state = {
      countryId: '',
      countries: undefined,
      startDate: startDate,
      endDate: endDate,
      guests: '2',
      listings: undefined
    };

    this.onChange = this.onChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDatePick = this.handleDatePick.bind(this);
    this.handleDestinationPick = this.handleDestinationPick.bind(this);
  }

  componentDidMount() {
    requester.getTopListings().then(res => {
      res.body.then(data => {
        this.setState({ listings: data.content });
      });
    });

    requester.getCountries().then(res => {
      res.body.then(data => {
        this.setState({ countries: data });
      });
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSearch(e) {
    e.preventDefault();

    let queryString = '?';

    queryString += 'countryId=' + this.state.countryId;
    queryString += '&startDate=' + this.state.startDate.format('DD/MM/YYYY');
    queryString += '&endDate=' + this.state.endDate.format('DD/MM/YYYY');
    queryString += '&guests=' + this.state.guests;

    this.props.history.push('/homes/listings' + queryString);
  }

  handleDatePick(event, picker) {
    this.setState({
      startDate: picker.startDate,
      endDate: picker.endDate,
    });
  }  
  
  handleDestinationPick(region) {
    // props.dispatch(setRegion(region));
    // document.getElementsByName('stay')[0].click();
  }

  render() {
    return (
      <div>
        <HomesHeroComponent
          countryId={this.state.countryId}
          countries={this.state.countries}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          guests={this.state.guests}
          onChange={this.onChange}
          handleSearch={this.handleSearch}
          handleDatePick={this.handleDatePick}
        />

        <BancorConvertWidget />

        <section id="popular-hotels-box">
          <h2>Popular Destinations</h2>
          <PopularDestinationsCarousel handleDestinationPick={this.handleDestinationPick} />
          <div className="clearfix"></div>
        </section>
        <section id="get-started">
          <div className="container">
            <div className="get-started-graphic">
              <div className="clearfix"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

HomesHomePage.propTypes = {
  // router props
  history: PropTypes.object
};

export default withRouter(HomesHomePage);
