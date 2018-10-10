import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { AIR_TICKETS_CHILDREN } from '../../../constants/modals';
import { setChildren, setInfants } from '../../../actions/airTicketsSearchInfo';

function AirTicketsChildrenModal(props) {

  const areChildrenAgesValid = () => {
    const children = props.airTicketsSearchInfo.children;
    for (let i = 0; i < children.length; i++) {
      const age = Number(children[i].age);
      if (age < 1 || age > 17) {
        return false;
      }
    }

    return true;
  };

  const handleChildrenChange = (event) => {
    let countChildren = event.target.value;
    let children = props.airTicketsSearchInfo.children.slice();
    if (children.length < countChildren) {
      while (children.length < countChildren) {
        children.push({ age: '' });
      }
    } else if (children.length > countChildren) {
      children = children.slice(0, countChildren);
    }

    props.dispatch(setChildren(children));
  };

  const handleChildAgeChange = (event, childIndex) => {
    const childAge = event.target.value;
    const children = props.airTicketsSearchInfo.children.slice();
    children[childIndex].age = childAge;

    props.dispatch(setChildren(children));
  };

  return (
    <div>
      <Modal show={props.isActive} onHide={e => props.closeModal(AIR_TICKETS_CHILDREN, e)} className="modal fade myModal">
        <Modal.Header>
          <h1>Children Info</h1>
          <button type="button" className="close" onClick={(e) => props.closeModal(AIR_TICKETS_CHILDREN, e)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <div className="children-modal">
            <div className="row">
              <div className="col col-md-4">
                <span className="children-select-label">Children</span>
              </div>
              <div className="col col-md-8">
                <select name="children" className="form-control children-select"
                  value={props.airTicketsSearchInfo.children.length} onChange={(e) => handleChildrenChange(e)}>
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
              {props.airTicketsSearchInfo.children.map((child, childIndex) => {
                return (
                  <div key={childIndex} className="col col-md-2">
                    <select name={`children${childIndex}age`} className="form-control children-age-select"
                      value={child.age} onChange={(e) => handleChildAgeChange(e, childIndex)}>
                      <option value="" disabled required>Age</option>
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
            <div className="row">
              <div className="col col-md-4">
                <span className="children-select-label">Infants</span>
              </div>
              <div className="col col-md-8">
                <select name="infants" className="form-control children-select"
                  value={props.airTicketsSearchInfo.infants} onChange={(e) => props.dispatch(setInfants(e.target.value))}>
                  <option value="0">No infants</option>
                  <option value="1">1 infant</option>
                  <option value="2">2 infants</option>
                  <option value="3">3 infants</option>
                  <option value="4">4 infants</option>
                  <option value="5">5 infants</option>
                  <option value="6">6 infants</option>
                </select>
              </div>
            </div>
          </div>
          <hr className="room-break" />
          {areChildrenAgesValid() ?
            <button className="btn btn-primary" onClick={e => {
              props.closeModal(AIR_TICKETS_CHILDREN, e);
              props.handleSubmit();
            }}>Search</button> :
            <button className="btn btn-primary" disabled>Search</button>
          }
        </Modal.Body>
      </Modal>
    </div>
  );
}

AirTicketsChildrenModal.propTypes = {
  closeModal: PropTypes.func,
  isActive: PropTypes.bool,
  handleSubmit: PropTypes.func,

  // Redux props
  dispatch: PropTypes.func,
  airTicketsSearchInfo: PropTypes.object
};

function mapStateToProps(state) {
  const { airTicketsSearchInfo } = state;
  return {
    airTicketsSearchInfo
  };
}

export default connect(mapStateToProps)(AirTicketsChildrenModal);
