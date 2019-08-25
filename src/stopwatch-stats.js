import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {dateMixin} from './date-behavior.js';
import '@google-web-components/google-chart/google-chart.js';
import '@polymer/iron-localstorage/iron-localstorage.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import './history-slider.js';

class StopwatchStats extends dateMixin(PolymerElement) {
  /* eslint-disable */
  static get template() {
    return html`<iron-localstorage name="history" value="{{history}}"
                   on-iron-localstorage-load="checkHistory"
                   on-iron-localstorage-load-empty="defaultHistory"></iron-localstorage>
<iron-localstorage name="statsTimeRange" value="{{timeRange}}"
                   on-iron-localstorage-load-empty="defaultTimeRange"></iron-localstorage>

<div class="text-right">
    <label id="timeRangeLabel">Показать за:</label>
    <paper-radio-group aria-labelledby="timeRangeLabel" selected="{{timeRange}}">
        <paper-radio-button name="week">неделю</paper-radio-button>
        <paper-radio-button name="month">месяц</paper-radio-button>
        <paper-radio-button name="quarter">квартал</paper-radio-button>
        <paper-radio-button name="year">год</paper-radio-button>
    </paper-radio-group>
</div>
<google-chart id="googleChart" type="column" on-google-chart-select="select" style="width: 100%"></google-chart>

[[selectedDay]]<br>
<template id="historySliders" is="dom-repeat" items="{{history}}" filter="{{filterSliders(selectedDay)}}">
    <history-slider start="[[item.s]]" end="{{item.e}}"></history-slider>
</template>
    
    `;
  }

  /* eslint-enable */
  static get properties() {
    return {
      history: Array,
      data: {
        type: Object,
      },
      timeRange: {
        type: String,
      },
      dateFormat: {
        type: String,
        value: 'D MMM',
      },
      selectedDay: {
        type: String,
        value: '',
      },
    };
  }

  static get observers() {
    return ['displayData(data.*, timeRange)', 'historyChanged(history.*)'];
  }

  ready() {
    super.ready();
    this.$.googleChart.options = {
      title: 'Статистика таймеров',
    };
    return this.$.googleChart.cols = [
      {
        label: 'День',
        type: 'string',
      }, {
        label: 'Часы',
        type: 'number',
      },
    ];
  }

  historyChanged() {
    return this.set('data', this.prepareData(this.history));
  }

  displayData() {
    const keys = Object.keys(this.data);
    keys.sort();
    const day = moment(parseInt(keys[0]));
    const today = moment().startOf('day');
    const start = moment().subtract(1, this.timeRange + 's');
    const rows = [];
    while (true) {
      if (day.isAfter(start)) {
        const duration = moment.duration(this.data[day.valueOf()]);
        rows.push([
          day.format(this.dateFormat), {
            v: duration.asHours(),
            f: this.humanize(duration, 'meaning'),
          },
        ]);
      }
      if (!(day.add(1, 'd').valueOf() <= today)) {
        break;
      }
    }
    return this.$.googleChart.rows = rows;
  }

  prepareData(history) {
    if (history[0][0] != null) {
      return;
    }
    let start = 0;
    let end = 0;
    const parsedHistory = {};
    for (let i = 0, len = history.length; i < len; i++) {
      const point = history[i];
      start = moment(point.s * 60000);
      end = moment(point.e * 60000);
      const startDay = start.clone().startOf('day').valueOf();
      const endDay = end.clone().startOf('day').valueOf();
      if (parsedHistory[startDay] == null) {
        parsedHistory[startDay] = 0;
      }
      if (startDay === endDay) {
        parsedHistory[startDay] += end.diff(start);
      } else {
        parsedHistory[startDay] += start.clone().endOf('day').diff(start);
        if (parsedHistory[endDay] == null) {
          parsedHistory[endDay] = 0;
        }
        parsedHistory[endDay] += end.diff(end.clone().startOf('day'));
      }
    }
    return parsedHistory;
  }

  defaultHistory() {
    this.history = [];
  }

  defaultTimeRange() {
    this.timeRange = 'month';
  }

  select(e, detail) {
    const dateString = this.$.googleChart.rows[detail.selection[0].row];
    const date = moment(dateString, this.dateFormat);
    this.selectedDay = date.format(this.dateFormat);
    return this.$.historySliders.render();
  }

  checkHistory() {
    if (this.history[0][0] != null) {
      const newHistory = [];
      const ref = this.history;
      for (let i = 0, len = ref.length; i < len; i++) {
        const point = ref[i];
        newHistory.push({
          s: point[0],
          e: point[1],
        });
      }
      return this.set('history', newHistory);
    }
  }

  filterSliders(selectedDay) {
    return (item) => {
      if (selectedDay != null) {
        return moment(selectedDay, this.dateFormat)
            .isSame(moment(item.s * 60000), 'day');
      } else {
        return false;
      }
    };
  }
}

customElements.define('stopwatch-stats', StopwatchStats);
