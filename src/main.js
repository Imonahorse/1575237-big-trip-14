import SiteMenuView from './view/site-menu.js';
import BoardPresenter from './presenter/board.js';
import {render, remove} from './utils/render.js';
import EventsModel from './model/events';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import Api from './api/api.js';
import {UpdateType, RenderPosition, MenuItem, OfflineMessage, OFFLINE_TITLE} from './utils/constant.js';
import Offers from './data/offers.js';
import Destination from './data/destination.js';
import RouteInfoPresenter from './presenter/route-info';
import StatisticsView from './view/statistics.js';
import {isOnline} from './utils/common.js';
import Storage from './api/storage.js';
import Provider from './api/provider.js';
import {toast} from './utils/toast.js';
import {enableAddButton, disableAddButton} from './utils/add-button.js';

const RANDOM_STRING = 'DaRkKiLLLeR666LeHHHa69696';
const AUTHORIZATION = `Basic ${RANDOM_STRING}`;
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'BigTrip-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const tripMain = document.querySelector('.trip-main');
const tripControlsNavigation = tripMain.querySelector('.trip-controls__navigation');
const tripControlsFilters = tripMain.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');
const addButton = document.querySelector('.trip-main__event-add-btn');

const eventsModel = new EventsModel();
const filterModel = new FilterModel();
export const offersData = new Offers();
export const destinationData = new Destination();

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Storage(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const boardPresenter = new BoardPresenter(tripEventsSection, eventsModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, eventsModel);
const routeInfoPresenter = new RouteInfoPresenter(tripMain, eventsModel);

const siteMenuComponent = new SiteMenuView();
const renderNavControls = () => render(tripControlsNavigation, siteMenuComponent, RenderPosition.BEFOREEND);
let statisticsComponent = null;
const handleSiteMenuClick = (menuItem) => {
  siteMenuComponent.changeMode(menuItem);
  filterPresenter.changeMode(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      enableAddButton();
      document.querySelectorAll('.page-body__container').forEach((item) => {
        item.classList.remove('page-body__container--no-after');
      });
      boardPresenter.init();
      remove(statisticsComponent);
      break;

    case MenuItem.STATISTICS:
      document.querySelectorAll('.page-body__container').forEach((item) => {
        item.classList.add('page-body__container--no-after');
      });

      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(eventsModel.get());
      render(tripEventsSection, statisticsComponent, RenderPosition.BEFOREEND);
      disableAddButton();
      break;
  }
};
disableAddButton();

Promise.all([apiWithProvider.getEvents(), apiWithProvider.getDestinations(), apiWithProvider.getOffers()])
  .then(([events, destinations, offers]) => {
    offersData.set(offers);
    destinationData.set(destinations);
    eventsModel.set(UpdateType.INIT, events);
    renderNavControls();
    enableAddButton();
    filterPresenter.init();
    routeInfoPresenter.init();
    siteMenuComponent.setClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    offersData.set([]);
    destinationData.set([]);
    eventsModel.set(UpdateType.INIT, []);
    renderNavControls();
    siteMenuComponent.setClickHandler(handleSiteMenuClick);
  });

boardPresenter.init();

addButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (!isOnline()) {
    toast(OfflineMessage.NEW_EVENT);
    return;
  }
  boardPresenter.createEvent();
  disableAddButton();
});

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(OFFLINE_TITLE, '');
  apiWithProvider.sync();
  toast(OfflineMessage.RECONNECT);
  if (!offersData.get().length || !destinationData.get().length) {

    Promise.all([apiWithProvider.getOffers(), apiWithProvider.getDestinations()])
      .then(([offers, destinations]) => {
        offersData.set(offers);
        destinationData.set(destinations);
        boardPresenter.destroy();
        boardPresenter.init();
      })
      .catch(() => {
        offersData.set([]);
        destinationData.set([]);
        boardPresenter.destroy();
        boardPresenter.init();
      });
  }
});

window.addEventListener('offline', () => {
  toast(OfflineMessage.DISCONNECT);
  document.title += OFFLINE_TITLE;
});
