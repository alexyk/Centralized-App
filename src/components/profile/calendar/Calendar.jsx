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
    const isPastDate = event.end < now;

    let reservationEventStyle = {
      color: '#FFFFFF',
      backgroundColor: '#a2c5bf',
      position: 'relative',
      top: '-20px'
    };

    if (isPastDate === true) {
      reservationEventStyle['opacity'] = '0.5';
    }

    if (event.isReservation) {
      return {
        style: reservationEventStyle
      };
    }
    else {
      return {};
    }
  };

  const DateCell = ({ value }) => {
    const now = moment().startOf('day');
    const end = moment().add(365, 'days');

    let isPastDate = (value < now) || (value > end);
    let isSelected = props.selectedDate !== null && value.toString() === props.selectedDate.toString();

    let className = isPastDate ? 'date-in-past' : 'rbc-day-bg';
    let borderBottom = isSelected ? '3px solid #d77961' : '1px solid transperant';

    return (
      <div
        className={className}
        style={{
          cursor: 'auto',
          flexBasis: 14.2857 + '%',
          maxWidth: 14.2857 + '%',
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
      <BigCalendar
        selectable
        popup
        events={props.allEvents}
        defaultView='month'
        step={60}
        defaultDate={moment().toDate()}
        onSelectSlot={e => {
          const now = moment().startOf('day');
          const end = moment().add(365, 'days');

          if ((e.end < now) || (e.end > end)) {
            return;
          }

          props.onCancel();
          props.onSelectSlot(e);
        }}
        views={['month', 'week']}
        components={{
          toolbar: CustomToolbar,
          dateCellWrapper: DateCell,
          event: CustomEvent
        }}
        formats={formats}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}

Calendar.propTypes = {
  selectedDate: PropTypes.object,
  allEvents: PropTypes.array,
  onCancel: PropTypes.func,
  onSelectSlot: PropTypes.func
};

export default Calendar;
