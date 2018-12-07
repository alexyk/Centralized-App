import { createSelector } from 'reselect';

const getInitialSecondsFromSubState = (state) => state.initialSeconds;

export const getInitialSeconds = createSelector(
  [getInitialSecondsFromSubState],
  (initialSeconds) => {
    return initialSeconds;
  }
);