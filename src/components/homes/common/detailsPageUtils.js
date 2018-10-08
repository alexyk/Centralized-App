import $ from 'jquery';

export function openLightbox(event, index) {
  event.preventDefault();
  this.setState({
    lightboxIsOpen: true,
    currentImage: index,
  });
}

export function closeLightbox() {
  this.setState({
    currentImage: 0,
    lightboxIsOpen: false,
  });
}

export function gotoPrevious() {
  this.setState({
    currentImage: this.state.currentImage - 1,
  });
}

export function gotoNext() {
  this.setState({
    currentImage: this.state.currentImage + 1,
  });
}

export function gotoImage(index) {
  this.setState({
    currentImage: index,
  });
}

export function handleClickImage() {
  if (this.state.currentImage === this.state.data.pictures.length - 1) {
    this.closeLightbox();
    return;
  };
  this.gotoNext();
}

export function next() {
  this.slider.slickNext();
}
export function previous() {
  this.slider.slickPrev();
}

export function setCheckInOutHours(checks) {
  const { checkInStart, checkInEnd, checkOutStart, checkOutEnd } = checks;
  const checkInBeforeStartWidth = ((100 / 24) * (checkInStart));
  const checkInAfterEndWidth = ((100 / 24) * (24 - checkInEnd));
  const checkInLength = ((100 / 24) * (checkInEnd - checkInStart));
  const checkOutBeforeStartWidth = ((100 / 24) * (checkOutStart));
  const checkOutAfterEndWidth = ((100 / 24) * (24 - checkOutEnd));
  const checkOutLength = (100 / 24) * (checkOutEnd - checkOutStart);


  setTimeout(() => {
    document.getElementById('check_in_hour').style.width = `calc(${checkInBeforeStartWidth}% + 40px)`;
    document.getElementById('check_out_hour').style.width = `calc(${checkOutBeforeStartWidth + checkOutLength}% + 20px)`;

    document.getElementById('check_in_line_1').style.width = `${checkInBeforeStartWidth}%`;
    document.getElementById('check_in_line_2').style.width = `${checkInLength}%`;
    document.getElementById('check_in_line_3').style.width = `${checkInAfterEndWidth}%`;
    document.getElementById('check_out_line_1').style.width = `${checkOutBeforeStartWidth}%`;
    document.getElementById('check_out_line_2').style.width = `${checkOutLength}%`;
    document.getElementById('check_out_line_3').style.width = `${checkOutAfterEndWidth}%`;

    document.getElementById('check_in_tooltip').style.marginLeft = `calc(${checkInBeforeStartWidth}% - 95px)`;
    document.getElementById('check_out_tooltip').style.marginLeft = `calc(${checkOutBeforeStartWidth + checkOutLength}% - 95px)`;
  }, 100);
}

export function calculateCheckInOuts(listing) {
  let checkInStart = listing.checkinStart && Number(listing.checkinStart.substring(0, 2));
  let checkInEnd = listing.checkinEnd && Number(listing.checkinEnd.substring(0, 2));
  checkInEnd = checkInEnd && checkInStart < checkInEnd ? checkInEnd : 24;

  let checkOutStart = listing.checkoutStart && Number(listing.checkoutStart.substring(0, 2));
  let checkOutEnd = listing.checkoutEnd && Number(listing.checkoutEnd.substring(0, 2));
  checkOutStart = checkOutStart && checkOutStart < checkOutEnd ? checkOutStart : 0;

  let checks = {
    checkInStart,
    checkInEnd,
    checkOutStart,
    checkOutEnd
  };

  return checks;
}

export function initStickyElements() {
  $(document).ready(() => {
    window.onscroll = function () { sticky(); };

    let hotelNav = document.getElementById('hotel-nav');
    let stickyHotelNav = hotelNav.offsetTop;
    let bookingPanel = document.getElementById('test');

    function sticky() {
      if (window.innerWidth > 1024) {
        $('#hotel-nav').width('100%');
        if (window.pageYOffset >= stickyHotelNav) {
          if (hotelNav && hotelNav.classList && !hotelNav.classList.contains('sticky-nav')) {
            hotelNav.classList.add('sticky-nav');
          }
        } else {
          if (hotelNav && hotelNav.classList && hotelNav.classList.contains('sticky-nav')) {
            hotelNav.classList.remove('sticky-nav');
          }
        }

        $('#test').width($('#test').width());
        $('#test').height($('#test').height());
        if (window.pageYOffset >= stickyHotelNav) {
          if (bookingPanel && bookingPanel.classList && !bookingPanel.classList.contains('sticky')) {
            bookingPanel.classList.add('sticky');
          }
        } else {
          if (bookingPanel && bookingPanel.classList && bookingPanel.classList.contains('sticky')) {
            bookingPanel.classList.remove('sticky');
          }
        }
      }
    }
  });
}

export function isInvalidRange(startDate, nights, calendar) {
  let result = false;

  let startDateIndex = calendar.findIndex(x => x.date === startDate.format('DD/MM/YYYY'));
  if (startDateIndex && startDateIndex < 0) {
    return true;
  }
  for (let i = startDateIndex; i < nights + startDateIndex; i++) {
    if (calendar[i].available === false) {
      result = true;
      break;
    }
  }

  return result;
}
