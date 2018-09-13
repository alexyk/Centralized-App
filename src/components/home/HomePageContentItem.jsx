import React from 'react';
import PropTypes from 'prop-types';

function HomePageContentItem(props) {
  return (
    <section className="home-page-content-item">
      <h3>{props.title}</h3>
      <h5>{props.text}</h5>
      {props.children}
    </section>
  );
}

HomePageContentItem.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  content: PropTypes.object
};

export default HomePageContentItem;