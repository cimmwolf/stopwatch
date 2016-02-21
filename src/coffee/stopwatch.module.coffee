Polymer
  is: 'stopwatch-counter'
  behaviors: [Polymer.NeonAnimationRunnerBehavior]
  properties:
    value:
      type: Number
      computed: "getValue(run, beginning, meted, timestamp)"
    beginning:
      type: Number, notify: true
    run:
      type: Boolean, notify: true
    name:
      type: String, notify: true
    meted:
      type: Number, notify: true
    timestamp:
      type: Number
      value: Date.now()
    laps: Array
    animationConfig:
      value: ->
        name: 'slide-from-bottom-animation',
        node: this

  attached: ->
    @.playAnimation()
    @timer()

  format: (duration)->
    if !moment.isDuration(duration)
      duration = moment.duration(duration)

    timeString = ''
    for value, index in [duration.hours(), duration.minutes(), duration.seconds()]
      if value > 0 or timeString != ''
        if value < 10
          timeString += '0'
        timeString += value
        if index < 2
          timeString += ':'

      if index == 2 and timeString is ''
        timeString = '00'
    timeString

  humanize: (duration) ->
    if !moment.isDuration(duration)
      duration = moment.duration(duration)

    units = ['ч.', 'мин.', 'сек.']
    timeString = ''
    for value, index in [duration.hours(), duration.minutes(), duration.seconds()]
      unit = units.shift()
      if value > 0 or timeString != ''
        timeString += value + ' ' + unit
        if index < 2
          timeString += ' '

      if index == 2 and timeString is ''
        timeString = '00 ' + unit
    timeString

  getValue: (run, beginning, meted)->
    if run != false
      duration = moment.duration Date.now() - beginning
    else
      duration = moment.duration()

    duration.add meted

    duration

  getStatus: (run, meted, history) ->
    if history.length == 0
      return 'new'

    if run == true
      status = 'running'
    else if meted == 0
      status = 'ready'
    else
      status = 'paused'

    if this.$.moreInfo.opened
      status += ' opened'

    return status

  getGroupedHistory: (e) ->
    history = e.base.slice(0)
    start = 0
    end = 0
    gHistory = [{day: 'Сегодня', history: []}, {day: 'Вчера', history: []}, {day: 'Ранее', history: []}]
    for point, index in history
      if start == 0 and point.event == 'start'
        start = moment point.time
        continue

      if end == 0 and (point.event == 'stop' or point.event == 'pause')
        end = moment point.time

      if start != 0 and end != 0
        group = 1
        if start.isSameOrAfter moment().startOf('day')
          group = 0
        else if start.isBefore moment().subtract(1, 'days').startOf('day')
          group = 2

        duration = end.diff start
        gHistory[group].history.unshift start.format('HH:mm') + ' -> ' + end.format('HH:mm') + ' (' + @humanize(duration) + ')'
        start = end = 0

    gHistory = gHistory.filter (item) ->
      return item.history.length != 0

    return gHistory

  timer: ->
    if @run
      @.async ->
        @timestamp = Date.now()
        @timer()
      , 300

  moreInfo: () ->
    moreInfo = this.$.moreInfo
    moreInfo.toggle()
    this.$.wrapper.toggleClass('opened', moreInfo.opened)

  toggle: ->
    if !@run
      if @beginning == false
        @.fire 'begin'

      @beginning = Date.now()
      @.push 'history', time: Date.now(), event: 'start'
      @run = true

      @timer()
    else
      @run = false
      @meted += Date.now() - @beginning

      @.push 'history', time: Date.now(), event: 'pause'
    @.fire 'changed'

  stop: ->
    @run = false
    @meted = 0
    @.push 'history', time: Date.now(), event: 'stop'
    @.splice 'laps', 0, 9999

  delete: ->
    this.fire 'delete'

  lap: ->
    info = {}
    info.value = @meted
    info.value += Date.now() - @beginning if @run != false

    if(@laps.length == 0)
      info.shift = 0
    else
      info.shift = info.value - @laps[0].value

    if @laps.length == 0 or info.value != @laps[0].value
      @.unshift 'laps', info
      TweenLite.from this.$.laps, 0.5, marginTop: '-24px', ease: Power2.easeOut
      @.fire 'changed'

  onNameChange: ->
    @fire 'changed'

  asMinutes: (duration)->
    n = Math.round duration.asMinutes()
    return '' if n < 1

    forms = ['минута', 'минуты', 'минут']
    n + ' ' +forms[if n % 10 == 1 and n % 100 != 11 then 0 else if n % 10 >= 2 and n % 10 <= 4 and (n % 100 < 10 or n % 100 >= 20) then 1 else 2]