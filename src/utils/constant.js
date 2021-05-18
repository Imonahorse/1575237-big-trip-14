const TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Transport',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];
const CITIES = [
  'London',
  'Paris',
  'Moscow',
  'Amsterdam',
  'Warsaw',
  'Minsk',
  'Brussels',
  'Brasilia',
  'Ottawa',
  'Helsinki',
  'Berlin',
  'Kiev',
  'Astana',
];
const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};
const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADDING: 'ADDING',
};
const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};
const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};
const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};
const MenuItem = {
  TABLE: 'TABLE',
  STATISTICS: 'STATISTICS',
};

export {TYPES, CITIES, UserAction, UpdateType, FilterType, Mode, SortType, RenderPosition, State, MenuItem};
