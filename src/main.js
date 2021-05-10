import SiteMenuView from './view/site-menu.js';
import RouteInfoView from './view/route-info.js';
import BoardPresenter from './presenter/board.js';
import {data} from './mock/data.js';
import {render, RenderPosition} from './utils/render.js';
import EventsModel from './model/events';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripControlsFilters = tripMain.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
eventsModel.setEvents(data);

const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter(tripEventsSection, eventsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, eventsModel);

const renderMenu = () => render(tripControlsNavigation, new SiteMenuView(), RenderPosition.BEFOREEND);
const renderRouteInfo = () => render(tripMain, new RouteInfoView(), RenderPosition.AFTERBEGIN);

renderMenu();
renderRouteInfo();
boardPresenter.init();
filterPresenter.init();
