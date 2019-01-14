import React from "react";

class MockedSelectAsync extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  render() {
    return <input onChange={this.onChange} value={this.state.value} />;
  }
}

jest.doMock("react-select/lib/Async", () => {
  return <div />;
});

class AutocompleteService {}
class PlacesService {
  getDetails() {}
}
global.window = {};
window.google = {
  maps: {
    places: {
      AutocompleteService: AutocompleteService,
      PlacesService: PlacesService
    }
  }
};
