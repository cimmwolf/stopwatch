import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {dateMixin} from './date-behavior.js';

class HistorySlider extends dateMixin(PolymerElement) {
  /* eslint-disable */
  static get template() {
    return html`
{{formatTime(start)}}&ndash;{{formatTime(end)}} {{timeValue(start, end)}}
<paper-slider id="slider" min="[[min]]" max="[[max]]" value="{{value}}"></paper-slider>    
    `;
  }

  /* eslint-enable */

  static get properties() {
    return {
      start: Number,
      end: {
        type: Number,
        notify: true,
      },
      min: {
        type: Number,
        value: 0,
      },
      max: Number,
      value: Number,
    };
  }

  static get observers() {
    return [
      'calcParams(start)',
    ];
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.$.slider.removeEventListener(
        'immediate-value-changed',
        this.valueBack.bind(this)
    );
  }


  calcParams(start) {
    this.$.slider.removeEventListener(
        'immediate-value-changed',
        this.valueBack.bind(this)
    );
    const diff = this.end - start;
    this.max = diff;
    this.value = diff;
    this.$.slider.addEventListener(
        'immediate-value-changed',
        this.valueBack.bind(this)
    );
  }

  formatTime(seconds) {
    return moment(seconds * 60000).format('HH:mm');
  }

  timeValue(start, end) {
    if (start !== end) {
      return this.humanize((end - start) * 60000, 'meaning');
    } else {
      return '--';
    }
  }

  valueBack(e, details) {
    if (details.value != null) {
      return this.set('end', details.value + this.start);
    }
  }
}

customElements.define('history-slider', HistorySlider);
