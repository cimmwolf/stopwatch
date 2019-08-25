import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import './stopwatch-counter.js';
import './stopwatch-lap.js';
import './stopwatch-summary.js';

let storage;
try {
  storage = window['localStorage'];
  const x = '__storage_test__';
  storage.setItem(x, x);
  storage.removeItem(x);
} catch (error) {
  console.log('Local storage is unsupported or unavailable');
}

class StopwatchApp extends PolymerElement {
  /* eslint-disable */
  static get template() {
    return html`
<style>
    .main-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .counter-wrapper {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        flex-grow: 1;
    }

    @media (min-width: 768px) {
        .main-wrapper {
            flex-wrap: nowrap;
        }
    }
</style>
<div class="main-wrapper">
    <div class="counter-wrapper">
        <template is="dom-repeat" items="{{items}}">
            <stopwatch-counter beginning="{{item.beginning}}"
                               run="{{item.run}}"
                               name="{{item.name}}"
                               history="{{item.history}}"
                               laps="{{item.laps}}"
                               meted="{{item.meted}}"
                               on-delete="delete"
                               on-changed="save"
                               on-begin="addItem"
                               on-end="pushHistory"
                               on-bit="_touchClock"></stopwatch-counter>
        </template>
    </div>
    <stopwatch-summary today="{{getSummaryToday(items.*, _clock)}}"
                       yesterday="{{getSummaryYesterday(items.*, _clock)}}"></stopwatch-summary>
</div>    
    `;
  }

  /* eslint-enable */

  static get properties() {
    return {
      items: {
        type: Array,
        value: function() {
          return [];
        },
      },
      _clock: {type: String, value: ''},
    };
  }

  ready() {
    super.ready();
    if (storage != null) {
      let storedData;
      if ((storedData = storage.getItem('stopwatches')) != null) {
        storedData = storedData
            .replace(/(\["end",(\d+)]),\["end",(\d+)]/g, '$1');
        storedData = JSON.parse(storedData);
      }
      if (!Array.isArray(storedData)) {
        storedData = [];
      }
      const results = [];
      for (let i = 0, len = storedData.length; i < len; i++) {
        const item = storedData[i];
        results.push(this._prepare(item));
      }
      this.items = results;
      this.history = JSON.parse(storage.getItem('history'));
      if (!Array.isArray(this.history)) {
        this.history = [];
      } else if (this.history[0][0] != null) {
        const newHistory = [];
        const ref = this.history;
        for (let i = 0, len = ref.length; i < len; i++) {
          const point = ref[i];
          newHistory.push({
            s: point[0],
            e: point[1],
          });
        }
        this.history = newHistory;
      }
    }
    this.addItem();
    this.favicon();
  }

  addItem() {
    this.push('items', this._prepare({}));
  }

  save() {
    this.favicon();
    if (storage != null) {
      const toSave = [];
      const ref1 = this.items;
      for (let j = 0, len1 = ref1.length; j < len1; j++) {
        const stopwatch = ref1[j];
        if (stopwatch.beginning !== false) {
          toSave.push(stopwatch);
        }
      }
      return storage.setItem('stopwatches', JSON.stringify(toSave));
    }
  }

  pushHistory(e) {
    if ((e.detail.bgn != null) && (e.detail.end != null)) {
      const bgn = Math.round(e.detail.bgn / 60000);
      const end = Math.round(e.detail.end / 60000);
      this.history.push({
        s: bgn,
        e: end,
      });
      return storage.setItem('history', JSON.stringify(this.history));
    }
  }

  getSummaryToday() {
    let end;
    let start;
    let summary;
    summary = start = end = 0;
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const ref1 = this.items || [];
    for (let j = 0, len1 = ref1.length; j < len1; j++) {
      const stopwatch = ref1[j];
      const ref2 = stopwatch.history;
      for (let index = 0, k = 0, len2 = ref2.length; k < len2; index = ++k) {
        const item = ref2[index];
        if (moment(item[1]).isBefore(today)) {
          if (item[0] === 'bgn'
              && moment(item[1]).isSameOrAfter(yesterday)
              && (stopwatch.history[index + 1] != null)
              && moment(stopwatch.history[index + 1][1]).isSameOrAfter(today)) {
            start = today.valueOf();
          }
          continue;
        }
        if (start === 0) {
          if (item[0] !== 'bgn') {
            continue;
          }
          start = item[1];
        }
        if (end === 0 && item[0] === 'end') {
          end = item[1];
        }
        if (end === 0 && index === stopwatch.history.length - 1) {
          end = Date.now();
        }
        if (start > 0 && end > 0) {
          summary += end - start;
          start = end = 0;
        }
      }
    }
    return Math.round(summary / 1000);
  }

  getSummaryYesterday() {
    let end;
    let index;
    let k;
    let len2;
    let ref2;
    let start;
    let stopwatch;
    let summary;
    summary = start = end = 0;
    const yesterdayStart = moment().subtract(1, 'days').startOf('day');
    const yesterdayEnd = moment().subtract(1, 'days').endOf('day');
    const ref1 = this.items || [];
    for (let j = 0, len1 = ref1.length; j < len1; j++) {
      stopwatch = ref1[j];
      ref2 = stopwatch.history;
      for (index = k = 0, len2 = ref2.length; k < len2; index = ++k) {
        const item = ref2[index];
        if (moment(item[1]).isBefore(yesterdayStart)) {
          if (item[0] === 'bgn'
              && (stopwatch.history[index + 1] != null)
              && moment(stopwatch.history[index + 1][1])
                  .isBetween(yesterdayStart, yesterdayEnd, null, '[]')) {
            start = yesterdayStart.valueOf();
          }
          continue;
        }
        if (moment(item[1]).isAfter(yesterdayEnd)) {
          if (start !== 0) {
            end = yesterdayEnd.valueOf();
          } else {
            continue;
          }
        }
        if (start === 0) {
          if (item[0] !== 'bgn') {
            continue;
          }
          start = item[1];
        }
        if (end === 0 && item[0] === 'end') {
          end = item[1];
        }
        if (end === 0 && index === stopwatch.history.length - 1) {
          end = Date.now();
        }
        if (start > 0 && end > 0) {
          summary += end - start;
          start = end = 0;
        }
      }
    }
    return Math.round(summary / 1000);
  }

  favicon() {
    let href;
    href = '/img/favicon.png';
    const ref1 = this.items;
    for (let j = 0, len1 = ref1.length; j < len1; j++) {
      const item = ref1[j];
      if (item.run) {
        href = '/img/favicon-r.png';
        break;
      }
    }
    const link = document.getElementById('favicon');
    link.href = href;
  }

  delete(e) {
    const index = this.items.indexOf(e.model.item);
    this.splice('items', index, 1);
    this.save();
  }

  _touchClock() {
    this._clock = this._clock === 'tick' ? 'tock' : 'tick';
  }

  _prepare(item) {
    (item.beginning != null) || (item.beginning = false);
    (item.run != null) || (item.run = false);
    (item.name != null) || (item.name = '');
    (item.history != null) || (item.history = []);
    (item.laps != null) || (item.laps = []);
    (item.meted != null) || (item.meted = 0);
    return item;
  }
}

customElements.define('stopwatch-app', StopwatchApp);
