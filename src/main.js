import {createNavigationTemplate} from './view/navigation.js';
import {createRouteInfoTemplate} from './view/route-info.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortingEventsTemplate} from './view/sorting-events.js';
import {createEventsListTemplate} from './view/events-list.js';
import {createEditEventTemplate} from './view/edit-event.js';
import {createEventTemplate} from './view/event.js';
import {createNewEventTemplate} from './view/new-event.js';
import {createEvent} from './mock/event-data.js';
import {generateFilter} from './filter.js';

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripControlsFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const POINTS_COUNT = 15;

const events = new Array(POINTS_COUNT).fill().map(createEvent);
const filters = generateFilter(events);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderMenu = () => render(tripControlsNavigation, createNavigationTemplate(), 'beforeend');
const renderRouteInfo = () => render(tripMain, createRouteInfoTemplate(), 'afterbegin');
const renderFilters = () => render(tripControlsFilters, createFiltersTemplate(filters), 'afterbegin');
const renderSortingEvents = () => render(tripEvents, createSortingEventsTemplate(), 'afterbegin');
const renderEventsList = () => render(tripEvents, createEventsListTemplate(), 'beforeend');

renderMenu();
renderRouteInfo();
renderFilters();
renderSortingEvents();
renderEventsList();

const containerForPoints = document.querySelector('.trip-events__list');

const renderEditPoint = () => render(containerForPoints, createEditEventTemplate(events[1]), 'beforeend');
const renderNewPoint = () => render(containerForPoints, createNewEventTemplate(events[0]), 'beforeend');

renderNewPoint();
renderEditPoint();

for (let i = 0; i < POINTS_COUNT; i++) {
  render(containerForPoints, createEventTemplate(events[i]), 'beforeend');
}
