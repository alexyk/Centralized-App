import React from 'react';

import './style.scss';

const ListMenu = (props) => {
  return (
    <div className="nav-list-menu sm-none">
      {props.children}
    </div>
  );
};

export default ListMenu;