import React, { Component } from 'react';
import Select from 'react-select';
import { NotificationManager } from 'react-notifications';
import { getCurrentlyLoggedUserJsonFile } from '../../requester';

export default class StyleTest extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      selectedOption: null
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectedOption) {
    this.setState({ selectedOption });
  }

  render() {
    const { selectedOption } = this.state;
    return (
      <div className="container">
        <Select
          style={{ zIndex: '100' }}
          name="form-field-name"
          value={selectedOption}
          onChange={this.handleChange}
          onClose={() => {
            if (this.state.selectedOption && this.state.selectedOption.label === '') {
              this.setState({ selectedOption: null });
            }
          }}
          onOpen={() => {
            if (!this.state.selectedOption) {
              this.setState({ selectedOption: { label: '' } });
            }
          }}
          options={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ]}
        />

        <button onClick={() => {
          const a = 'abc';
          console.log(a.match('^([^\\s][a-zA-Z].?[0-9][^\\s]|[^\\s][0-9].?[a-zA-Z][^\\s])$/'));
        }}>Test</button>
        <span className="icon-question" title={`${123}`}></span>
      </div>
    );
  }
}