app = window.app or (window.app = {})
document.addEventListener 'DOMContentLoaded', ->
  ng.core.enableProdMode();
  ng.platformBrowserDynamic.bootstrap(app.AppComponent);