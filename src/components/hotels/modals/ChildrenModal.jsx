import {Modal} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {setRooms} from '../../../actions/searchInfo';

import {CHILDREN} from '../../../constants/modals';

function ChildrenModal(props) {

  const areChildrenAgesValid = () => {
    const rooms = props.searchInfo.rooms;
    for (let i = 0; i < rooms.length; i++) {
      const children = rooms[i].children;
      for (let j = 0; j < children.length; j++) {
        const age = Number(children[j].age);
        if (age < 1 || age > 17) {
          return false;
        }
      }
    }

    return true;
  };

  const handleChildrenChange = (event, roomIndex) => {
    let value = event.target.value;
    let rooms = props.searchInfo.rooms.slice();
    let children = rooms[roomIndex].children;
    if (children.length < value) {
      while (children.length < value) {
        children.push({age: ''});
      }
    } else if (children.length > value) {
      children = children.slice(0, value);
    }

    rooms[roomIndex].children = children;
    props.dispatch(setRooms(rooms));
  };

  const handleChildAgeChange = (event, roomIndex, childIndex) => {
    const value = event.target.value;
    const rooms = props.searchInfo.rooms.slice();
    rooms[roomIndex].children[childIndex].age = value;
    props.dispatch(setRooms(rooms));
  };

  return (
    <div>
      <Modal show={props.isActive} onHide={e => props.closeModal(CHILDREN, e)} className="modal fade myModal">
        <Modal.Header>
          <h1>Children</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(CHILDREN, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          {props.searchInfo.rooms && props.searchInfo.rooms.map((room, roomIndex) => {
            return (
              <div key={roomIndex}>
                <div className="children-modal">
                  <div className="row">
                    <div className="col col-md-4">
                      <span className="children-select-label">Room {roomIndex + 1}</span>
                    </div>
                    <div className="col col-md-8">
                      <select name={`children${roomIndex}`} className="form-control children-select"
                        value={room.children.length} onChange={(e) => handleChildrenChange(e, roomIndex)}>
                        <option value="0">No children</option>
                        <option value="1">1 child</option>
                        <option value="2">2 children</option>
                        <option value="3">3 children</option>
                        <option value="4">4 children</option>
                        <option value="5">5 children</option>
                        <option value="6">6 children</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    {room.children.map((child, childIndex) => {
                      return (
                        <div key={childIndex} className="col col-md-2">
                          <select name={`children${roomIndex}age`} className="form-control children-age-select"
                            value={child.age} onChange={(e) => handleChildAgeChange(e, roomIndex, childIndex)}>
                            <option value="" selected disabled required>Age</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <hr className="room-break"/>
              </div>
            );
          })}
          {areChildrenAgesValid() ?
            <button className="btn btn-primary" onClick={e => {
              props.closeModal(CHILDREN, e);
              props.handleSubmit();
            }}>Search</button> :
            <button className="btn btn-primary" disabled>Search</button>
          }
        </Modal.Body>
      </Modal>
    </div>
  );
}

ChildrenModal.propTypes = {
  closeModal: PropTypes.func,
  isActive: PropTypes.bool,
  handleSubmit: PropTypes.func,

  // Redux props
  dispatch: PropTypes.func,
  searchInfo: PropTypes.object
};

function mapStateToProps(state) {
  const {searchInfo} = state;
  return {
    searchInfo
  };
}

export default connect(mapStateToProps)(ChildrenModal);
