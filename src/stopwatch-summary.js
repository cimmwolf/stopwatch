import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

class StopwatchSummary extends PolymerElement {
  static get template() {
    return html`<style>
    :host {
        display: block;
        padding-top: 15px; }

    .counter-wrapper {
        color: var(--secondary-text-color);
        overflow: hidden; 
    }

    .label {
        position: relative; }

    .counter {
        padding-top: 20px;
        text-align: right; }

    .counter:empty {
        display: none; }

    .counter:empty + .label {
        display: none; }

    .counter.today {
        font-size: 32.4px; }

    .counter.today + .label {
        top: -66.28571px; }

    .counter.yesterday {
        font-size: 28.8px; }

    .counter.yesterday + .label {
        top: -61.14286px; }


</style>
<div class="counter-wrapper">
    <div class="counter today">{{getTime(today)}}</div>
    <div class="label">Сегодня:</div>
    <div class="counter yesterday">{{getTime(yesterday)}}</div>
    <div class="label">Вчера:</div>
</div>
    `;
  }

  getTime(seconds) {
    const duration = moment.duration(seconds * 1000);
    let timeString = '';
    const ref = [duration.hours(), duration.minutes(), duration.seconds()];
    for (let index = 0, i = 0, len = ref.length; i < len; index = ++i) {
      const value = ref[index];
      if (value > 0 || timeString !== '') {
        if (value < 10) {
          timeString += '0';
        }
        timeString += value;
        if (index < 2) {
          timeString += ':';
        }
      }
    }
    return timeString;
  }
}

customElements.define('stopwatch-summary', StopwatchSummary);
