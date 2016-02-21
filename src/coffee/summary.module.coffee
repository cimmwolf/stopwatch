Polymer
  is: 'stopwatch-summary'
  getTime: (seconds) ->
    duration = moment.duration(seconds * 1000)
    timeString = ''
    for value, index in [duration.hours(), duration.minutes(), duration.seconds()]
      if value > 0 or timeString != ''
        if value < 10
          timeString += '0'
        timeString += value
        if index < 2
          timeString += ':'
    timeString