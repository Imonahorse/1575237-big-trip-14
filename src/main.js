import SiteMenuView from './view/site-menu.js';
import RouteInfoView from './view/route-info.js';
import FiltersView from './view/filters.js';
import SortingView from './view/sorting-events.js';
import EventsListView from './view/events-list.js';
import EditEventView from './view/edit-event.js';
import EventView from './view/event.js';
import NewEventView from './view/new-event.js';
import NoEventView from './view/no-event.js';
import {createEvent} from './mock/event-data.js';
import {generateFilter} from './filter.js';
import {render, replace, RenderPosition} from './utils/render.js';
import {isEscEvent} from './utils/common.js';

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripControlsFilters = tripMain.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const EVENTS_COUNT = 20;
const EMPTY_EVENTS_LIST = 0;

const events = new Array(EVENTS_COUNT).fill().map(createEvent);
const filters = generateFilter(events);

const renderEvent = (eventListElement, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EditEventView(event);

  const replaceCardToForm = () => {
    replace(eventEditComponent, eventComponent);
  };
  const replaceFormToCard = () => {
    replace(eventComponent, eventEditComponent);
  };
  const closeEventEditForm = () => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeydown);
  };
  const onEscKeydown = (evt) => {
    if (isEscEvent) {
      evt.preventDefault();
      closeEventEditForm();
    }
  };

  eventComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeydown);
  });
  eventEditComponent.setEditClickHandler(() => {
    closeEventEditForm();
  });
  eventEditComponent.setFormSubmitHandler(() => {
    closeEventEditForm();
  });

  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderMenu = () => render(tripControlsNavigation, new SiteMenuView(), RenderPosition.BEFOREEND);
const renderRouteInfo = () => render(tripMain, new RouteInfoView(), RenderPosition.AFTERBEGIN);
const renderFilters = () => render(tripControlsFilters, new FiltersView(filters), RenderPosition.BEFOREEND);
const renderEventsList = () => render(tripEvents, new EventsListView(), RenderPosition.BEFOREEND);

renderMenu();
renderRouteInfo();
renderFilters();
renderEventsList();

const containerForEvents = document.querySelector('.trip-events__list');

if (events.length === EMPTY_EVENTS_LIST) {
  render(containerForEvents, new NoEventView(), RenderPosition.AFTERBEGIN);
}

if (events.length > EMPTY_EVENTS_LIST) {
  render(tripEvents, new SortingView(), RenderPosition.AFTERBEGIN);
  const renderNewPoint = () => render(containerForEvents, new NewEventView(events[0]).getElement(), RenderPosition.BEFOREEND);
  renderNewPoint();
}

for (let i = 1; i < EVENTS_COUNT; i++) {
  renderEvent(containerForEvents, events[i]);
}
