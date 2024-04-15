export function getShortDate(stringSystemDate) {
  if (stringSystemDate.length === 10) return stringSystemDate;
  let date = new Date(stringSystemDate);
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let year = date.getYear() + 1900;
  return day + "/" + month + "/" + year;
}
export function getHour(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
}
export function setDate(stringDate) {
  let sections = stringDate.split("/");
  return new Date(sections[1] + "/" + sections[0] + "/" + sections[2]);
}
export function cloneJson(json) {
  if (typeof json === "object") {
    if (Array.isArray(json)) {
      return json.map((element) => cloneJson(element));
    } else if (json.getDate) {
      return new Date(json);
    } else {
      let obj = {};
      const keys = Object.keys(json);
      const values = Object.values(json);
      keys.map((key, index) => (obj[key] = cloneJson(values[index])));
      return obj;
    }
  } else {
    return json;
  }
}

export function BuildFilters(array) {
  function BuildFilter(list, field) {
    let filter = [];
    list.forEach((element) => {
      if (!filter.includes(element[field])) filter.push(element[field]);
    });
    return filter.sort();
  }

  if (array.length === 0) {
    console.error("function BuildFilters - empty array");
    return [];
  } else {
    let filters = {};
    let keys = Object.keys(array[0]);
    for (let key of keys) {
      filters[key] = BuildFilter(array, key);
    }
    return filters;
  }
}

export function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export function filterByWorker(worker, cylinders) {
  let stateFiltered = cylinders.filter(
    (element) => element.assignedTo === worker
  );
  return stateFiltered;
}

export function filterByRefrigerant(refrigerant, cylinders) {
  let stateFiltered = cylinders.filter(
    (element) => element.refrigerant === refrigerant
  );
  return stateFiltered;
}

export function filterByStatus(status, cylinders) {
  let stateFiltered = cylinders.filter((element) => element.status === status);
  return stateFiltered;
}

export function buildFilters(json, values = {}, ranges = {}) {
  let check = true;
  for (let key of Object.keys(values))
    if (json[key] !== values[key]) check = false;
  for (let key of Object.keys(ranges))
    if (json[key] < ranges[key].min || json[key] > ranges[key].max)
      check = false;
  return check;
}

export function colorByPercent(completed) {
  let zero = [139, 0, 0];
  let half = [255, 255, 0];
  let full = [0, 128, 0];
  let color = [];
  let percent = completed >= 50 ? completed - 50 : completed;
  for (let i = 0; i <= 2; i++) {
    let start = completed >= 50 ? [...half] : [...zero];
    let end = completed >= 50 ? [...full] : [...half];
    color[i] = Math.floor(start[i] + ((end[i] - start[i]) / 50) * percent);
  }
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

export function excelDateToJSDate(serial) {
  var utc_days = Math.floor(serial - 25569);
  var utc_value = utc_days * 86400;
  var date_info = new Date(utc_value * 1000);

  var fractional_day = serial - Math.floor(serial) + 0.0000001;

  var total_seconds = Math.floor(86400 * fractional_day);

  var seconds = total_seconds % 60;

  total_seconds -= seconds;

  var hours = Math.floor(total_seconds / (60 * 60));
  var minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
}

export function datesByYear(value) {
  const [year, month] = `${value}`.split("-").map(Number);
  // Creamos un objeto de fecha para el primer día del año
  const dateMin = new Date(year, month ? month - 1 : 0, 1)
    .toISOString()
    .slice(0, 10);
  // Creamos un objeto de fecha para el último día del año
  const lastDay = month ? new Date(year, month, 0) : null;
  const dateMax = new Date(
    year,
    month ? month - 1 : 11,
    month ? lastDay.getDate() : 31
  )
    .toISOString()
    .slice(0, 10);

  return {
    dateMin,
    dateMax,
  };
}
