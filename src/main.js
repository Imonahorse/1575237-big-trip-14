import {createNavigationTemplate} from './view/navigation.js';
import {createRouteInfoTemplate} from './view/route-info.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortingEventsTemplate} from './view/sorting-events.js';
import {createEventsListTemplate} from './view/events-list.js';
import {createEditEventTemplate} from './view/edit-event.js';
import {createEventTemplate} from './view/event.js';
import {createNewEventTemplate} from './view/new-event.js';

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripControlsFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const POINTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderMenu = () => render(tripControlsNavigation, createNavigationTemplate(), 'beforeend');
const renderRouteInfo = () => render(tripMain, createRouteInfoTemplate(), 'afterbegin');
const renderFilters = () => render(tripControlsFilters, createFiltersTemplate(), 'afterbegin');
const renderSortingEvents = () => render(tripEvents, createSortingEventsTemplate(), 'afterbegin');
const renderEventsList = () => render(tripEvents, createEventsListTemplate(), 'beforeend');

renderMenu();
renderRouteInfo();
renderFilters();
renderSortingEvents();
renderEventsList();

const containerForPoints = document.querySelector('.trip-events__list');

const renderEditPoint = () => render(containerForPoints, createEditEventTemplate(), 'beforeend');
const renderNewPoint = () => render(containerForPoints, createNewEventTemplate(), 'beforeend');

renderNewPoint();
renderEditPoint();

for (let i = 0; i < POINTS_COUNT; i++) {
  render(containerForPoints, createEventTemplate(), 'beforeend');
}
