import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';

import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
import '@polymer/iron-icon/iron-icon.js';

class IronIcons extends PolymerElement {
  /* eslint-disable */
  static get template() {
    return html`
        <iron-iconset-svg size="24" name="mi">
            <svg>
                <defs>
                   <g id="pause"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></g>
                   <g id="play-arrow"><path d="M8 5v14l11-7z"></path></g>
                   <g id="stop"><path d="M6 6h12v12H6z"></path></g>
                   <g id="email"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></g>
                   <g id="delete"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></g>
                   <g id="expand-more"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></g>
                   <g id="flag"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"></path></g>
                </defs>
            </svg>
        </iron-iconset-svg>
    `;
  }

  /* eslint-enable */
}

customElements.define('iron-icons', IronIcons);
