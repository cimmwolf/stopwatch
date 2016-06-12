window.MyBehaviors = window.MyBehaviors || {}

MyBehaviors.dateBehavior =
  humanize: (duration, mode = 'verbose') ->
    if !moment.isDuration(duration)
      duration = moment.duration(duration)

    units = ['ч.', 'мин.', 'сек.']
    timeString = ''
    for value, index in [duration.hours(), duration.minutes(), duration.seconds()]
      unit = units.shift()
      if value > 0 or (mode is 'verbose' and timeString != '')
        timeString += value + ' ' + unit
        if index < 2
          timeString += ' '

      if index == 2 and timeString is ''
        timeString = '00 ' + unit
    timeString