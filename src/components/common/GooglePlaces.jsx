import React from 'react';
import { withRouter } from 'react-router-dom';
import { Config } from '../../config';

class GooglePlaces extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      country: '',
      search: '',
      countries: []
    };

    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {
    const headers = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': localStorage[Config.getValue('domainPrefix') + '.auth.locktrip']
      }
    };

    const data = await fetch('http://localhost:8080/nationality/all', headers)
      .then(response => response.json())
      .then(data => data)
      .catch();

    this.setState({
      countries: data.content,
      country: data.content[0].id
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div className='container'>
        <div className='select'>
          {/* <select name='country' onChange={this.onChange} value={this.state.country}>
            {this.state.countries && this.state.countries.map(country => {
              return (<option key={country.id} value={country.id}>{country.name}</option>);
            })}
          </select> */}
        </div>
        <input type='text' name='search' onChange={this.onChange} value={this.state.search} />
      </div>
    );
  }
}

export default withRouter(GooglePlaces);