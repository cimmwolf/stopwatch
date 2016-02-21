Polymer
  is: 'stopwatch-lap'
  properties:
    value: Number
    shift: Number

  format: (duration)->
    if !moment.isDuration(duration)
      duration = moment.duration(duration)

    timeString = ''
    for value, index in [duration.hours(), duration.minutes(), duration.seconds()]
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

    units = ['ч.','мин.','сек.']
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