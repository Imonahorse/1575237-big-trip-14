import RouteInfoView from '../view/route-info.js';
import {render, replace, remove} from '../utils/render.js';
import {RenderPosition} from '../utils/constant.js';

class RouteInfo {
  constructor(container, eventsModel) {
    this._container = container;
    this._eventsModel = eventsModel;
    this._routeInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const events = this._getRoutInfo();

    const prevRoutInfoComponent = this._routeInfoComponent;
    this._routeInfoComponent = new RouteInfoView(events);

    if (prevRoutInfoComponent === null) {
      render(this._container, this._routeInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._routeInfoComponent, prevRoutInfoComponent);
    remove(prevRoutInfoComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _getRoutInfo() {
    const events = this._eventsModel.getEvents();
    return events;
  }
}

export default RouteInfo;
