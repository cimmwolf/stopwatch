app = window.app or (window.app = {})
document.addEventListener 'DOMContentLoaded', ->
  ng.core.enableProdMode();
  ng.platform.browser.bootstrap app.AppComponent