import moment from 'moment'

const filter = {
  formatTime: (time = '', format = 'YYYY-MM-DD hh:mm:ss') => {
    if (!time) {
      return '';
    }
    return moment(time).local().format(format);
  }
};
export default filter;