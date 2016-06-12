Polymer
  is: 'stopwatch-stats'
  behaviors: [MyBehaviors.dateBehavior]
  properties:
    history: Array
    data:
      type: Object
    timeRange:
      type: String
    dateFormat:
      type: String
      value: 'D MMM'
    selectedDay: 
      type: String
      value: ''

  observers: [
    'displayData(data.*, timeRange)'
    'historyChanged(history.*)'
  ]
  
  ready: ->
    @.$.googleChart.options =
      title: 'Статистика таймеров'
    @.$.googleChart.cols = [
      {label: 'День', type: 'string'},
      {label: 'Часы', type: 'number'}
    ]

  historyChanged: () ->
    @.set 'data', @.prepareData(@.history)
    
  displayData: ->
    keys = Object.keys(@.data)
    keys.sort()
    day = moment(parseInt(keys[0]))
    today = moment().startOf('day')
    start = moment().subtract(1, @.timeRange + 's')

    rows = []
    loop
      if day.isAfter start
        duration = moment.duration(@.data[day.valueOf()])
        rows.push [
          day.format(@.dateFormat)
          {
            v: duration.asHours()
            f: @.humanize duration, 'meaning'
          }
        ]
      unless day.add(1, 'd').valueOf() <= today
        break
    @.$.googleChart.rows = rows

  prepareData: (history)->
    if history[0][0]?
      return

    start = 0
    end = 0
    parsedHistory = {}
    for point in history
      start = moment(point.s * 60000)
      end = moment(point.e * 60000)
      startDay = start.clone().startOf('day').valueOf()
      endDay = end.clone().startOf('day').valueOf()
      if !parsedHistory[startDay]?
        parsedHistory[startDay] = 0
      if startDay == endDay
        parsedHistory[startDay] += end.diff(start)
      else
        parsedHistory[startDay] += start.clone().endOf('day').diff(start)
        if !parsedHistory[endDay]?
          parsedHistory[endDay] = 0
        parsedHistory[endDay] += end.diff(end.clone().startOf('day'))
    parsedHistory

  defaultHistory: ->
    @.history = []
  defaultTimeRange: ->
    @.timeRange = 'month'

  select: (e, detail)->
    date = moment @.$.googleChart.rows[detail.selection[0].row], @.dateFormat
    @.selectedDay = date.format @dateFormat
    @.$.historySliders.render()

  checkHistory: () ->
    if @history[0][0]?
      newHistory = []
      for point in @history
        newHistory.push s: point[0], e: point[1]
      @.set 'history', newHistory

  filterSliders: (selectedDay)->
    dateFormat = @dateFormat
    return (item) ->
      if selectedDay?
        moment(selectedDay, dateFormat).isSame(moment(item.s * 60000), 'day')
      else
        false