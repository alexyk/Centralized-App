import React from 'react';
import TripsNav from './TripsNav';


export default function withNav(WrappedComponent) {
  return (
    <div>
      <TripsNav />
      <WrappedComponent />
    </div>
  );
}