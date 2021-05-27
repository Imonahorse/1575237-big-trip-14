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
const OfflineMessage = {
  NEW_EVENT: 'You can\'t create new task offline',
  DISCONNECT: 'Lost internet connection',
  SAVE_EVENT: 'You can\'t save task offline',
  DELETE_EVENT: 'You can\'t delete task offline',
  EDIT_EVENT: 'You can\'t edit task offline',
};
const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};
const OFFLINE_TITLE = ' [offline]';

export {UserAction, UpdateType, FilterType, SortType, RenderPosition, State, MenuItem, OfflineMessage, Mode, OFFLINE_TITLE};
