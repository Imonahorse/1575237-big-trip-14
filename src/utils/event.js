import dayjs from 'dayjs';
import {getRandomInteger} from './common.js';

const generateDate = () => {
  const maxDaysGap = 31;

  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const day = dayjs().add(daysGap, 'day').toDate();
  return dayjs(day);
};
const generateDateFrom = () => {
  const hour = getRandomInteger(1, 24);
  const minute = getRandomInteger(1, 60);
  const item = dayjs().add(hour, 'hour').add(minute, 'm').toDate();
  return dayjs(item);
};
const generateDateTo = (dateFrom) => {
  const hour = getRandomInteger(1, 24);
  const minute = getRandomInteger(1, 60);
  const dateTo = dayjs(dateFrom).add(hour, 'hour').add(minute, 'm').toDate();
  return dayjs(dateTo);

};
const humanizeTimeFormat = (time) => {
  return dayjs(time).format('HH:mm');
};
const humanizeDateFormat = (date) => {
  return dayjs(date).format('D MMMM');
};
const humanizeEditEventDateFormat = (date) => {
  return dayjs(date).format('DD/MM/YY');
};
const isEventComing = (event) => {
  return dayjs().isAfter(event, 'D');
};
const isEventExpired = (event) => {
  return dayjs().isBefore(event, 'D');
};
const calcPrice = (offers) => {
  let price = 0;
  offers.forEach((item) => price += item.price);
  return price;
};

export {
  generateDate,
  generateDateFrom,
  generateDateTo,
  humanizeTimeFormat,
  humanizeDateFormat,
  isEventComing,
  isEventExpired,
  humanizeEditEventDateFormat,
  calcPrice
};
