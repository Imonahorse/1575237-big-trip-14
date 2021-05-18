const countTasksByColor = (events, type) => {
  return events.filter((event) => event.type === type).length;
};

