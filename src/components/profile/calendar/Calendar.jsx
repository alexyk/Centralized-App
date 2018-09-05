import 'react-big-calendar/lib/css/react-big-calendar.css';

import BigCalendar from 'react-big-calendar';
import CalendarAside from './CalendarAside';
import CalendarAsideStatic from './CalendarAsideStatic';
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
          <button className="btn-back" onClick={goToBack}>&#8249;</button>
          <button className="btn-next" onClick={goToNext}>&#8250;</button>
        </div>

        <span className="rbc-toolbar-label">{label()}</span>
      </div>
    );
  };

  const eventStyleGetter = (event) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let isPastDate = new Date(event.end).getTime() < now.getTime();

    let styleNotSelected = {};

    let styleSelected = {
      color: '#FFFFFF',
      backgroundColor: '#a2c5bf',
      position: 'relative',
      top: '-20px',
      zIndex: '1000'
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

  const DateCell = ({ value, children }) => {
    const now = new Date();
    const afterDaysConst = 89;
    now.setHours(0, 0, 0, 0);

    let dateAfterDays = new Date();
    dateAfterDays.setHours(0, 0, 0, 0);
    dateAfterDays.setDate(dateAfterDays.getDate() + afterDaysConst);

    let isPastDate = (new Date(value).getTime() < now.getTime()) || (new Date(value).getTime() > dateAfterDays);
    let isSelected = value.toString() === props.selectedDate.toString();

    const isUnavailable = props.allEvents.filter(x => x.available === false).filter(x => new Date(x.start).getTime() === value.getTime()).length >= 1;

    let className = isPastDate ? 'date-in-past' : isUnavailable === true ? 'rbc-day-bg-unavailable' : 'rbc-day-bg';
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
        {children}
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
    <div className={(props.selectedDay !== null && props.selectedDay !== '') ? 'col-md-12 calendar dynamic-aside' : 'col-md-12 calendar'}>
      <div className="col-md-8">
        {props.calendarLoading ?
          <div className="loader"></div> :
          <BigCalendar
            selectable
            popup
            events={props.allEvents}
            defaultView='month'
            step={60}
            defaultDate={new Date()}
            onSelectSlot={e => {
              const now = new Date();
              now.setHours(0, 0, 0, 0);

              const afterDaysConst = 89;

              let dateAfterDays = new Date();
              dateAfterDays.setHours(0, 0, 0, 0);
              dateAfterDays.setDate(dateAfterDays.getDate() + afterDaysConst);

              if ((e.end.getTime() < now.getTime()) || (e.end.getTime() > dateAfterDays)) {
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

      {props.selectedDay !== null && props.selectedDay !== '' ?
        <CalendarAside onCancel={props.onCancel}
          day={props.selectedDay}
          date={props.selectedDate}
          price={props.price}
          available={props.available}
          onSubmit={props.onSubmit}
          onChange={props.onChange}
          currencySign={props.currencySign} /> :
        <CalendarAsideStatic
          currencySign={props.currencySign}
          defaultDailyPrice={props.defaultDailyPrice}
          onChange={props.onChange}
          updateDailyPrice={props.updateDailyPrice} />}
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
  calendarLoading: PropTypes.bool
};

export default Calendar;
