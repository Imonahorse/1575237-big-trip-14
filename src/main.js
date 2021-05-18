import SiteMenuView from './view/site-menu.js';
import BoardPresenter from './presenter/board.js';
import {render, remove} from './utils/render.js';
import EventsModel from './model/events';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import Api from './view/api.js';
import {UpdateType, RenderPosition, MenuItem} from './utils/constant.js';
import Offers from './data/offers.js';
import Destination from './data/destination.js';
import RouteInfoPresenter from './presenter/route-info';
import StatisticsView from './view/statistics.js';

const RANDOM_STRING = 'darkKiLLLer666Leha';
const AUTHORIZATION = `Basic ${RANDOM_STRING}`;
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripControlsFilters = tripMain.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
export const offersData = new Offers();
export const destinationData = new Destination();
const api = new Api(END_POINT, AUTHORIZATION);
const siteMenuComponent = new SiteMenuView();
let statisticsComponent = null;

render(tripControlsNavigation, siteMenuComponent, RenderPosition.BEFOREEND);


const boardPresenter = new BoardPresenter(tripEventsSection, eventsModel, filterModel, api);
const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, eventsModel);
const routeInfoPresenter = new RouteInfoPresenter(tripMain, eventsModel);

Promise.all([api.getEvents(), api.getDestinations(), api.getOffers()])
  .then(([events, destinations, offers]) => {
    offersData.setOffers(offers);
    destinationData.setDestination(destinations);
    eventsModel.setEvents(UpdateType.INIT, events);
    filterPresenter.init();
    routeInfoPresenter.init();

    const handleSiteMenuClick = (menuItem) => {
      switch (menuItem) {
        case MenuItem.TABLE:
          boardPresenter.init();
          remove(statisticsComponent);
          break;
        case MenuItem.STATISTICS:
          statisticsComponent = new StatisticsView(eventsModel.getEvents());
          render(tripEventsSection, statisticsComponent, RenderPosition.BEFOREEND);
          boardPresenter.destroy();
          break;
      }
    };

    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch((err) => alert(err));

boardPresenter.init();


document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createEvent();
});

