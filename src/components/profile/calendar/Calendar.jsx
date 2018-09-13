import 'react-big-calendar/lib/css/react-big-calendar.css';

import BigCalendar from 'react-big-calendar';
import CustomEvent from './CustomEvent';
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

function Calendar(props) {
  const CustomToolbar = (toolbar) => {
    const goToBack = () => { toolbar.onNavigate('PREV'); };
    const goToNext = () => { toolbar.onNavigate('NEXT'); };

    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span><b>{date.format('MMMM')}</b><span> {date.format('YYYY')}</span></span>
      );
    };

    return (
      <div className="rbc-toolbar">
        <div className="rbc-btn-group">
          <button className="btn-back" onClick={goToBack}>&lsaquo;</button>
          <button className="btn-next" onClick={goToNext}>&rsaquo;</button>
        </div>

        <span className="rbc-toolbar-label">{label()}</span>
      </div>
    );
  };

  const eventStyleGetter = (event) => {
    const now = moment();
    let isPastDate = event.end < now;

    let styleNotSelected = {};

    let styleSelected = {
      color: '#FFFFFF',
      backgroundColor: '#a2c5bf',
      position: 'relative',
      top: '-20px'
    };

    if (isPastDate) {
      styleNotSelected['opacity'] = '0.5';
      styleSelected['opacity'] = '0.5';
    }

    if (!event.isReservation) {
      return {
        style: styleNotSelected
      };
    }
    else {
      return {
        style: styleSelected
      };
    }
  };

  const DateCell = ({ value }) => {
    const now = moment();
    const afterDaysConst = 365;

    let dateAfterDays = moment().add(afterDaysConst, 'days');

    let isPastDate = (value < now) || (value > dateAfterDays);
    let isSelected = props.selectedDate !== null && value.toString() === props.selectedDate.toString();

    const isUnavailable = props.allEvents.filter(x => x.available === false).filter(x => x.start.isSame(value)).length >= 1;

    let className = isPastDate ? 'date-in-past' : isUnavailable === true ? ['rbc-day-bg unavailable'] : 'rbc-day-bg';
    let borderBottom = isSelected ? '3px solid #d77961' : '1px solid transperant';

    return (
      <div
        className={className}
        style={{
          flexBasis: 14.2857 + '%',
          maxWidth: 14.2857 + '%',
          cursor: 'auto',
          borderBottom
        }}>
      </div>
    );
  };

  const formats = {
    weekdayFormat: (date, culture, localizer) =>
      localizer.format(date, 'dddd', culture)
  };

  moment.locale('ko', {
    week: {
      dow: 1,
      doy: 1,
    },
  });
  BigCalendar.momentLocalizer(moment);

  return (
    <div>
      {props.loading ?
        <div className="loader"></div> :
        <BigCalendar
          selectable
          popup
          events={props.allEvents}
          defaultView='month'
          step={60}
          defaultDate={moment().toDate()}
          onSelectSlot={e => {
            const now = moment();
            const afterDaysConst = 365;
            let dateAfterDays = moment().add(afterDaysConst, 'days');

            if ((e.end < now) || (e.end > dateAfterDays)) {
              return;
            }

            props.onCancel();
            props.onSelectSlot(e);
          }}
          views={['month']}
          components={{
            toolbar: CustomToolbar,
            dateCellWrapper: DateCell,
            event: CustomEvent
          }}
          formats={formats}
          eventPropGetter={eventStyleGetter}
        />
      }
    </div>
  );
}

Calendar.propTypes = {
  selectedDay: PropTypes.string,
  selectedDate: PropTypes.object,
  price: PropTypes.number,
  available: PropTypes.string,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  currencySign: PropTypes.string,
  defaultDailyPrice: PropTypes.number,
  updateDailyPrice: PropTypes.func,
  allEvents: PropTypes.array,
  onCancel: PropTypes.func,
  onSelectSlot: PropTypes.func,
  loading: PropTypes.bool
};

export default Calendar;
