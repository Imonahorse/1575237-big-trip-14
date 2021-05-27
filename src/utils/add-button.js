const enableAddButton = () => {
  return document.querySelector('.trip-main__event-add-btn').disabled = false;
};
const disableAddButton = () => {
  return document.querySelector('.trip-main__event-add-btn').disabled = true;
};

export {enableAddButton, disableAddButton};
