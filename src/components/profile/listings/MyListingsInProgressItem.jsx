import PropTypes from 'prop-types';
import React from 'react';
import MyListingsInProgressItemAdditionalContent from './MyListingsInProgressItemAdditionalContent';
import MyListingsColapseInProgressItem from './MyListingsColapseInProgressItem';
import ProfileFlexContainer from '../flexContainer/ProfileFlexContainer';

import '../../../styles/css/components/profile/my-listings__progress-item.css';

class MyListingsInProgressItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpand: false
    };

    this.collapse = this.collapse.bind(this);
    this.expand = this.expand.bind(this);
  }

  collapse() {
    this.setState({
      isExpand: false
    });
  }

  expand() {
    this.setState({
      isExpand: true
    });
  }

  render() {
    const { isExpand } = this.state;
    return (
      <ProfileFlexContainer key={this.props.listing.id} styleClass="flex-container-row my-listings__progress-item">
        <MyListingsColapseInProgressItem
          id={this.props.id}
          step={this.props.step}
          listing={this.props.listing}
          styleClass="my-listings-flex-container"
          isExpand={isExpand}
          expand={this.expand}
          collapse={this.collapse}
          deleteInProgressListing={this.props.deleteInProgressListing}
        />
        {isExpand &&
          <MyListingsInProgressItemAdditionalContent
            step={this.props.step}
            filterListings={this.props.filterListings}
            id={this.props.id}
          />}
      </ProfileFlexContainer>
    );
  }
}

MyListingsInProgressItem.propTypes = {
  listing: PropTypes.object,
  step: PropTypes.number,
  id: PropTypes.number,
  filterListings: PropTypes.func,
  deleteInProgressListing: PropTypes.func
};

export default MyListingsInProgressItem;