import { Modal } from 'react-bootstrap';
import React from 'react';
import { UPDATE_COUNTRY } from '../../../constants/modals.js';
import { connect } from 'react-redux';

function UpdateCountryModal(props) {

  const getShortName = (name, length) => {
    if (name.length <= length) {
      return name;
    }

    return `${name.substring(0, length)}...`;
  };

  return (
    <div>
      <Modal show={props.modalsInfo.isActive[UPDATE_COUNTRY]} onHide={() => props.closeModal(UPDATE_COUNTRY)} className="modal fade myModal">
        <Modal.Header>
          <h1>Where are you from?</h1>
          <button type="button" className="close" onClick={() => props.closeModal(UPDATE_COUNTRY)}>&times;</button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => { e.preventDefault(); props.handleUpdateCountry(); }}>
            <label htmlFor="country">Where do you live</label>
            <div className='select'>
              <select name="country" id="country" onChange={props.handleChangeCountry} value={JSON.stringify(props.country)} style={{ padding: '10px', maxWidth: '100%' }}>
                <option value="" disabled selected>Country</option>
                {props.countries && props.countries.map((item, i) => {
                  return <option key={i} value={JSON.stringify(item)} style={{ minWidth: '100%', maxWidth: '0' }}>{getShortName(item.name, 30)}</option>;
                })}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">Save</button>
            <div className="clearfix"></div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  modalsInfo: state.modalsInfo
});

export default connect(mapStateToProps)(UpdateCountryModal);
