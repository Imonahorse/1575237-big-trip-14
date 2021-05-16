import dayjs from 'dayjs';
import {getRandomInteger} from './common.js';

const generateDate = () => {
  const maxDaysGap = 31;

  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const day = dayjs().add(daysGap, 'day').toDate();
  return dayjs(day);
};
const generateDateFrom = (day) => {
  const hour = getRandomInteger(1, 24);
  const minute = getRandomInteger(1, 60);
  const item = dayjs(day).add(hour, 'hour').add(minute, 'm').toDate();
  return dayjs(item);
};
const generateDateTo = (dateFrom) => {
  const day = getRandomInteger(0, 3);
  const hour = getRandomInteger(1, 24);
  const minute = getRandomInteger(1, 60);
  const dateTo = dayjs(dateFrom).add(day, 'day').add(hour, 'hour').add(minute, 'm').toDate();
  return dayjs(dateTo);

};
const humanizeTimeFormat = (time) => {
  return dayjs(time).format('HH:mm');
};
const humanizeDateFormat = (date) => {
  return dayjs(date).format('D MMMM');
};
const humanizeEditEventDateFormat = (date) => {
  return dayjs(date).format('DD/MM/YY HH:mm');
};
const isEventComing = (event) => {
  return dayjs().isBefore(event, 'D');

};
const isEventExpired = (event) => {
  return dayjs().isAfter(event, 'D');
};
const isDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');
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
  isDatesEqual
};
