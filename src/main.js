import SiteMenuView from './view/site-menu.js';
import RouteInfoView from './view/route-info.js';
import FiltersView from './view/filters.js';
import BoardPresenter from './presenter/board.js';
import {data} from './mock/data.js';
import {generateFilter} from './filter.js';
import {render, RenderPosition} from './utils/render.js';
import EventsModel from './model/events';

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripControlsFilters = tripMain.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
eventsModel.setEvents(data);

const filters = generateFilter(data);
const boardPresenter = new BoardPresenter(tripEventsSection, eventsModel);

const renderMenu = () => render(tripControlsNavigation, new SiteMenuView(), RenderPosition.BEFOREEND);
const renderRouteInfo = () => render(tripMain, new RouteInfoView(), RenderPosition.AFTERBEGIN);
const renderFilters = () => render(tripControlsFilters, new FiltersView(filters), RenderPosition.BEFOREEND);

renderMenu();
renderRouteInfo();
renderFilters();
boardPresenter.init(data);
