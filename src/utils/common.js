const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const MILLISECONDS = 1000;
const SECONDS = 60;
const MINUTES = 60;
const HOURS = 24;
const DAYS = 30 ;
const TEN_MINUTES = 10;

const msToTime = (duration) => {
  const msPerDays = Math.floor(duration / (MILLISECONDS * MINUTES * SECONDS * HOURS) % DAYS);
  const msPerHours = Math.floor((duration / (MILLISECONDS * MINUTES * SECONDS)) % HOURS);
  const msPerMinutes = Math.floor((duration / (MILLISECONDS * SECONDS)) % MINUTES);

  const days = msPerDays < TEN_MINUTES ? '0' + msPerDays + 'D ' : msPerDays + 'D ';
  const hours = msPerHours < TEN_MINUTES ? '0' + msPerHours + 'H ' : msPerHours + 'H ';
  const minutes = msPerMinutes < TEN_MINUTES ? '0' + msPerMinutes + 'M' : msPerMinutes + 'M';

  if (!msPerDays && !msPerHours && !msPerMinutes) {
    return '00M';
  }

  if (!msPerDays && !msPerHours) {
    return '00H' + minutes;
  }

  if (!msPerDays) {
    return hours + minutes;
  }

  return days + hours + minutes;
};
const isOnline = () => {
  return window.navigator.onLine;
};

export {
  isEscEvent,
  msToTime,
  isOnline
};
