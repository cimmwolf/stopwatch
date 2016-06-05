Polymer
  is: 'stopwatch-stats'

  properties:
    history: Array
    data:
      type: Object
      computed: 'prepareData(history)'
    timeRange:
      type: String

  observers: [
    'displayData(data, timeRange)'
  ],

  ready: ->
    @.$.googleChart.options =
      title: 'Статистика таймеров'
    @.$.googleChart.cols = [
      {label: 'День', type: 'string'},
      {label: 'Часы', type: 'number'}
    ]

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
          day.format('D MMM')
          {
            v: duration.asHours()
            f: duration.humanize()
          }
        ]
      unless day.add(1, 'd').valueOf() <= today
        break
    @.$.googleChart.rows = rows

  prepareData: (history)->
    start = 0
    end = 0
    parsedHistory = {}
    for point in history
      start = moment(point[0] * 60000)
      end = moment(point[1] * 60000)
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