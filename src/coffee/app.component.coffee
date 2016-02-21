app = window.app or (window.app = {})

app.AppComponent = ng.core.Component(
  selector: 'stopwatch-app'
  template: '
    <stopwatch-counter *ngFor="#item of items; #i = index"
        [beginning]="item.beginning" (beginning-changed)="item.beginning = $event.detail.value"
        [run]="item.run" (run-changed)="item.run = $event.detail.value"
        [name]="item.name" (name-changed)="item.name = $event.detail.value"
        [history]="item.history"
        [laps]="item.laps"
        [meted]="item.meted" (meted-changed)="item.meted = $event.detail.value"
        (delete)="delete(i)"
        (changed)="save()"
        (begin)="addItem()"
     ></stopwatch-counter>

    <stopwatch-summary today="{{getSummaryToday()}}" yesterday="{{getSummaryYesterday()}}"></stopwatch-summary>
  '
).Class(
  constructor: ->
    @items = []

    @addItem = ->
      @items.push prepare({})

    prepare = (item) ->
      item.beginning? or (item.beginning = false)
      item.run? or (item.run = false)
      item.name? or (item.name = '')
      item.history? or (item.history = [])
      item.laps? or (item.laps = [])
      item.meted? or (item.meted = 0)
      item

    try
      storage = window['localStorage']
      x = '__storage_test__'
      storage.setItem x, x
      storage.removeItem x
    catch e
      console.log 'Local storage is unsupported or unavailable'

    if storage?
      storedData = storage.getItem('stopwatches')

    if storedData?
      storedData = JSON.parse(storedData)
      @items = (prepare item for item in storedData)

    @addItem()

    @save = =>
      favicon()
      if storage?
        toSave = []
        for stopwatch in @items
          toSave.push(stopwatch) if stopwatch.beginning != false

        storage.setItem 'stopwatches', JSON.stringify(toSave)

    @delete = (index) =>
      @items.splice(index, 1)
      @save()

    @getSummaryToday = =>
      summary = start = end = 0
      today = moment().startOf('day')
      for stopwatch in @items
        for item, index in stopwatch.history
          if moment(item.time).isBefore today
            continue
          if start == 0
            if item.event isnt 'start'
              continue
            start = item.time

          if end == 0 and (item.event is 'pause' or item.event is 'stop')
            end = item.time

          if end == 0 and index == stopwatch.history.length - 1
            end = Date.now()

          if start > 0 and end > 0
            summary += end - start
            start = end = 0
      Math.round summary / 1000

    @getSummaryYesterday = =>
      summary = start = end = 0
      yesterdayStart = moment().subtract(1, 'days').startOf('day')
      yesterdayEnd = moment().subtract(1, 'days').endOf('day')
      for stopwatch in @items
        for item, index in stopwatch.history
          if moment(item.time).isBefore(yesterdayStart) or moment(item.time).isAfter(yesterdayEnd)
            continue
          if start == 0
            if item.event isnt 'start'
              continue
            start = item.time

          if end == 0 and (item.event is 'pause' or item.event is 'stop')
            end = item.time

          if end == 0 and index == stopwatch.history.length - 1
            end = Date.now()

          if start > 0 and end > 0
            summary += end - start
            start = end = 0
      Math.round summary / 1000

    favicon = =>
      href = 'dist/img/favicon.png'
      for item in @items
        if item.run
          href = 'dist/img/favicon-r.png'
          break

      link = document.getElementById('favicon');
      link.href = href

    favicon()

    return
)