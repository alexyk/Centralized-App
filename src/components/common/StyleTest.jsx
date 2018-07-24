import React, { Component } from 'react';

import queryString from 'query-string';

class StyleTest extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      ulr: null,
      decodedUrl: null,
    };

    this.decode = this.decode.bind(this);
  }

  componentDidMount() {
    // const baseURL = '/hotels/listings';
    const searchString = '?region=15664&currency=EUR&startDate=14/07/2018&endDate=20/07/2018&rooms=%5B%7B"adults":2,"children":%5B%5D%7D%5D';
    const filters = {
      showUnavailable: false,
      name: 'marinela',
      minPrice: 10,
      maxPrice: 500,
      stars: [0,1,2,3,4,5],
    };
    const filterString = '&filters=' + encodeURI(JSON.stringify(filters));
    const paginationString = '&page=0&sort=asc&size=10';
    const url = `${searchString}${filterString}${paginationString}`;
    this.setState({ url });
  }

  decode() {
    const params = queryString.parse(this.state.url);
    const filters = params.filters;
    console.log(filters);
  }

  render() {
    return (
      <div className="container">
        {this.state.url}
        {this.state.decodedUrl}
        <button onClick={this.decode}>DECODE</button>
      </div>
    );
  }
}

export default StyleTest;