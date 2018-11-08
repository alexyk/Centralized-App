import $ from 'jquery';

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
