import SiteMenuView from './view/site-menu.js';
import RouteInfoView from './view/route-info.js';
import FiltersView from './view/filters.js';
import SortingView from './view/sorting-events.js';
import EventsListView from './view/events-list.js';
import EditEventView from './view/edit-event.js';
import EventView from './view/event.js';
import NewEventView from './view/new-event.js';
import {createEvent} from './mock/event-data.js';
import {generateFilter} from './filter.js';
import {render, RenderPosition} from './utils.js';

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripControlsFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const POINTS_COUNT = 15;

const events = new Array(POINTS_COUNT).fill().map(createEvent);
const filters = generateFilter(events);

const renderEvent = (eventListElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EditEventView(event);

  const replaceCardToForm = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const replaceFormToCard = () => {
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  eventComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
  });

  eventEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderMenu = () => render(tripControlsNavigation, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
const renderRouteInfo = () => render(tripMain, new RouteInfoView().getElement(), RenderPosition.AFTERBEGIN);
const renderFilters = () => render(tripControlsFilters, new FiltersView(filters).getElement(), RenderPosition.BEFOREEND);
const renderSortingEvents = () => render(tripEvents, new SortingView().getElement(), RenderPosition.AFTERBEGIN);
const renderEventsList = () => render(tripEvents, new EventsListView().getElement(), RenderPosition.BEFOREEND);

renderMenu();
renderRouteInfo();
renderFilters();
renderSortingEvents();
renderEventsList();

const containerForEvents = document.querySelector('.trip-events__list');

// const renderEditPoint = () => render(containerForEvents, new EditEventView(events[1]).getElement(), RenderPosition.BEFOREEND);
const renderNewPoint = () => render(containerForEvents, new NewEventView(events[0]).getElement(), RenderPosition.BEFOREEND);

renderNewPoint();
// renderEditPoint();

for (let i = 2; i < POINTS_COUNT; i++) {
  renderEvent(containerForEvents, events[i]);
}
