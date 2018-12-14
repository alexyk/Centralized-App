import React from 'react';
import './style.css';

export default class AsideContentPage extends React.Component {
  render() {
    return <div className="aside-content-page">
      {this.props.children}
    </div>;
  }
}


AsideContentPage.Aside = class Aside extends React.Component {
  render() {
    const { width } = this.props;
    return (
      <div className="aside" style={{ width }}>
        {this.props.children}
      </div>
    );
  }
};

AsideContentPage.Content = class Content extends React.Component {
  render() {
    const { width } = this.props;
    return (
      <div className="content" style={{ width }}>
        {this.props.children}
      </div>
    );
  }
};
