import React from 'react';

import './style.css';

const ListMenu = (props) => {
  return (
    <div className="nav-list-menu sm-none">
      {props.children}
    </div>
  );
};

export default ListMenu;