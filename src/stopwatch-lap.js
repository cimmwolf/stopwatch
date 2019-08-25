import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

class StopwatchLap extends PolymerElement {
  static get template() {
    return html`<style>
    .shift {
        position: absolute;
        transform: translateX(-100%) translateY(15px);
    }
</style>
<div class="lap">
    <template is="dom-if" if="{{shift}}">
        <span class="shift">+ [[humanize(shift)]]</span>
    </template>
    <iron-icon icon="mi:flag"></iron-icon>
    <span>[[format(value)]]</span>
</div>    
    `;
  }

  static get properties() {
    return {
      value: Number,
      shift: Number,
    };
  }

  format(duration) {
    let index;
    let i;
    let len;
    if (!moment.isDuration(duration)) {
      duration = moment.duration(duration);
    }
    let timeString = '';
    const ref = [duration.hours(), duration.minutes(), duration.seconds()];
    for (index = 0, i = 0, len = ref.length; i < len; index = ++i) {
      const value = ref[index];
      if (value < 10) {
        timeString += '0';
      }
      timeString += value;
      if (index < 2) {
        timeString += ':';
      }
    }
    if (index === 2 && timeString === '') {
      timeString = '00';
    }
    return timeString;
  }

  humanize(duration) {
    if (!moment.isDuration(duration)) {
      duration = moment.duration(duration);
    }
    const units = ['ч.', 'мин.', 'сек.'];
    let timeString = '';
    const ref = [duration.hours(), duration.minutes(), duration.seconds()];
    for (let index = 0, i = 0, len = ref.length; i < len; index = ++i) {
      const value = ref[index];
      const unit = units.shift();
      if (value > 0 || timeString !== '') {
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
}

customElements.define('stopwatch-lap', StopwatchLap);
