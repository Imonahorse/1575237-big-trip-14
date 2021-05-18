import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {msToTime} from '../utils/common.js';

const makeItemsUniq = (items) => [...new Set(items)];
const countEventsByType = (events, type) => {
  return events.filter((event) => event.type === type).length;
};
const countPriceByType = (events, type) => {
  const eventsByType = events.filter((event) => event.type === type);
  let totalPrice = 0;
  eventsByType.forEach((item) => totalPrice += item.basePrice);
  return totalPrice;
};
const countDurationByType = (events, type) => {
  const eventsByType = events.filter((event) => event.type === type);
  let duration = 0;
  eventsByType.forEach((item) => duration += item.dateTo - item.dateFrom);
  return duration;
};

const renderTypesChart = (typeCtx, events) => {
  const types = events.map((event) => event.type);
  const uniqTypes = makeItemsUniq(types);
  const eventsByTypeCounts = uniqTypes.map((item) => countEventsByType(events, item));
  const uniqTypesUpperCase = uniqTypes.map((item) => item.toUpperCase());

  const typeChart = new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypesUpperCase,
      datasets: [{
        data: eventsByTypeCounts,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
  return typeChart;
};
const renderMoneysChart = (moneyCtx, events) => {
  const types = events.map((event) => event.type);
  const uniqTypes = makeItemsUniq(types);
  const eventsByPriceCounts = uniqTypes.map((item) => countPriceByType(events, item));
  const uniqTypesUpperCase = uniqTypes.map((item) => item.toUpperCase());

  const moneyChart = new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypesUpperCase,
      datasets: [{
        data: eventsByPriceCounts,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return moneyChart;
};
const renderDurationChart = (timeCtx, events) => {
  const types = events.map((event) => event.type);
  const uniqTypes = makeItemsUniq(types);
  const eventsByDurationCounts = uniqTypes.map((item) => countDurationByType(events, item));
  const uniqTypesUpperCase = uniqTypes.map((item) => item.toUpperCase());

  const timeChart = new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqTypesUpperCase,
      datasets: [{
        data: eventsByDurationCounts,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${msToTime(val)}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return timeChart;
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
};

class Statistics extends SmartView {
  constructor(events) {
    super();
    this._data = events;
    this._typesChart = null;
    this._moneysChart = null;
    this._durationChart = null;

    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._typesChart !== null || this._moneysChart !== null || this._durationChart !== null) {
      this._typesChart = null;
      this._moneysChart = null;
      this._durationChart = null;
    }
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _setCharts() {
    if (this._typesChart !== null || this._moneysChart !== null || this._durationChart !== null) {
      this._typesChart = null;
      this._moneysChart = null;
    }

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 7.5;
    typeCtx.height = BAR_HEIGHT * 7.5;
    timeCtx.height = BAR_HEIGHT * 7.5;

    this._typesChart = renderTypesChart(typeCtx, this._data);
    this._moneysChart = renderMoneysChart(moneyCtx, this._data);
    this._durationChart = renderDurationChart(timeCtx, this._data);
  }
}

export default Statistics;
