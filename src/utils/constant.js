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
};

export {TYPES, CITIES, UserAction, UpdateType};
