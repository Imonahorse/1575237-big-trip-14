import dayjs from 'dayjs';

const humanizeTimeFormat = (time) => {
  return dayjs(time).format('HH:mm');
};
const humanizeDateFormat = (date) => {
  return dayjs(date).format('MMMM D');
};
const humanizeEditEventDateFormat = (date) => {
  return dayjs(date).format('DD/MM/YY HH:mm');
};
const isEventComing = (event) => {
  return dayjs().isBefore(event);

};
const isEventExpired = (event) => {
  return dayjs().isAfter(event);
};
const isDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');
};
const isPriceEqual = (priceA, priceB) => {
  return (priceA === null && priceB === null) ? true : priceB === priceA;
};

export {
  humanizeTimeFormat,
  humanizeDateFormat,
  isEventComing,
  isEventExpired,
  humanizeEditEventDateFormat,
  isDatesEqual,
  isPriceEqual
};
