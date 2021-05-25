import SiteMenuView from './view/site-menu.js';
import BoardPresenter from './presenter/board.js';
import {render, remove} from './utils/render.js';
import EventsModel from './model/events';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import Api from './api/api.js';
import {UpdateType, RenderPosition, MenuItem, OfflineMessage} from './utils/constant.js';
import Offers from './data/offers.js';
import Destination from './data/destination.js';
import RouteInfoPresenter from './presenter/route-info';
import StatisticsView from './view/statistics.js';
import {isOnline} from './utils/common.js';
import Storage from './api/storage.js';
import Provider from './api/provider.js';
import {toast} from './utils/toast.js';

const RANDOM_STRING = 'DaRkKiLLLeR666LeXXXa770';
const AUTHORIZATION = `Basic ${RANDOM_STRING}`;
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'BigTrip-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;
const offlineTitle = ' [offline]';

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
const siteMenuComponent = new SiteMenuView();
let statisticsComponent = null;
const boardPresenter = new BoardPresenter(tripEventsSection, eventsModel, filterModel, apiWithProvider);
const filterPresenter = new FilterPresenter(tripControlsFilters, filterModel, eventsModel);
const routeInfoPresenter = new RouteInfoPresenter(tripMain, eventsModel);
addButton.disabled = true;
const renderNavControls = () => render(tripControlsNavigation, siteMenuComponent, RenderPosition.BEFOREEND);
const handleSiteMenuClick = (menuItem) => {
  const tableButton = siteMenuComponent.getElement().querySelector(`[data-menu-type=${MenuItem.TABLE}]`);
  const statisticsButton = siteMenuComponent.getElement().querySelector(`[data-menu-type=${MenuItem.STATISTICS}]`);

  switch (menuItem) {
    case MenuItem.TABLE:
      if (tableButton.classList.contains('trip-tabs__btn--active')) {
        return;
      }

      filterPresenter.filtersModeChange(menuItem);

      tableButton.classList.add('trip-tabs__btn--active');
      statisticsButton.classList.remove('trip-tabs__btn--active');

      addButton.disabled = false;
      document.querySelectorAll('.page-body__container').forEach((item) => {
        item.classList.remove('page-body__container--no-after');
      });

      boardPresenter.init();
      remove(statisticsComponent);
      break;

    case MenuItem.STATISTICS:
      if (statisticsButton.classList.contains('trip-tabs__btn--active')) {
        return;
      }

      filterPresenter.filtersModeChange(menuItem);

      statisticsButton.classList.add('trip-tabs__btn--active');
      tableButton.classList.remove('trip-tabs__btn--active');

      addButton.disabled = true;
      document.querySelectorAll('.page-body__container').forEach((item) => {
        item.classList.add('page-body__container--no-after');
      });

      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(eventsModel.getEvents());
      render(tripEventsSection, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

Promise.all([apiWithProvider.getEvents(), apiWithProvider.getDestinations(), apiWithProvider.getOffers()])
  .then(([events, destinations, offers]) => {
    debugger
    offersData.setOffers(offers);
    destinationData.setDestination(destinations);
    eventsModel.setEvents(UpdateType.INIT, events);
    renderNavControls();
    addButton.disabled = false;
    filterPresenter.init();
    routeInfoPresenter.init();
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    destinationData.setDestination([]);
    eventsModel.setEvents(UpdateType.INIT, []);
    renderNavControls();
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

boardPresenter.init();

addButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (!isOnline()) {
    toast(OfflineMessage.NEW_EVENT);
    return;
  }
  boardPresenter.createEvent();
  addButton.disabled = true;
});

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(offlineTitle, '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  toast(OfflineMessage.DISCONNECT);
  document.title += offlineTitle;
});


