export const dateMixin = (superClass) => class extends superClass {
  humanize(duration, mode) {
    if (mode == null) {
      mode = 'verbose';
    }
    if (!moment.isDuration(duration)) {
      duration = moment.duration(duration);
    }
    const units = ['ч.', 'мин.', 'сек.'];
    let timeString = '';
    const ref = [duration.hours(), duration.minutes(), duration.seconds()];
    for (let index = 0, i = 0, len = ref.length; i < len; index = ++i) {
      const value = ref[index];
      const unit = units.shift();
      if (value > 0 || (mode === 'verbose' && timeString !== '')) {
        timeString += value + ' ' + unit;
        if (index < 2) {
          timeString += ' ';
        }
      }
      if (index === 2 && timeString === '') {
        timeString = '00 ' + unit;
      }
    }
    return timeString;
  }
};
