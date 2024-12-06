import moment from 'moment';

// ----------------------------------------------------------------------

export function fDate(date) {
  return moment(new Date(date)).format('DD MMM YYYY');
}

export function fDateTime(date) {
  return moment(new Date(date)).format('DD MMM yyyy hh:mm A');
}

export function fTimestamp(date) {
  return moment(new Date(date)).unix();
}

export function fDateTimeSuffix(date) {
  return moment(new Date(date)).format('DD/MM/yyyy hh:mm A');
}

export function fToNow(date) {
  const now = moment();
  const logDate = moment(new Date(date));
  if (now.diff(logDate, 'hours') <= 3) {
    return logDate.fromNow();
  }
  return logDate.format('DD MMM yyyy hh:mmA');
}

export function fTime(date) {
  return moment(date, 'HH:mm:ss').format('hh:mm A');
}
