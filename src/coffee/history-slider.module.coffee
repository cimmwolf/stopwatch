Polymer
  is: 'history-slider'
  behaviors: [MyBehaviors.dateBehavior]
  properties:
    start: Number
    end:
      type: Number
      notify: true
    min:
      type: Number
      value: 0
    max: Number
    value: Number

  observers: [
    'calcParams(start)'
  ]

  detached: ->
    this.unlisten(this.$.slider, 'immediate-value-changed', 'valueBack');

  calcParams: (start)->
    this.unlisten(this.$.slider, 'immediate-value-changed', 'valueBack')
    diff = @end - start
    @max = diff
    @value = diff
    this.listen(this.$.slider, 'immediate-value-changed', 'valueBack')

  formatTime: (seconds)->
    moment(seconds * 60000).format('HH:mm')

  timeValue: (start, end)->
    if (start isnt end)
      @.humanize((end - start) * 60000, 'meaning')
    else 
      '--'

  valueBack: (e, details) ->
    if details.value?
      @.set 'end', details.value + @start