class Dashing.JenkinsJob extends Dashing.Widget

  ready: ->
    @progressState = 'open'
    @currentInterval = null

  onData: (data) ->
    if typeof @progressState != 'undefined' and @progressState != null
      self = this
      widgetNode = $(@node)
      progressbarNode = $(@node).find('.progress')

      hideProgressbar = ->
        progressbarNode.hide()

      startProgressbar = ->
        widgetNode.find('.duration').html('Estimated duration: ' + data.displayEstimatedDuration)
        progressbarNode.show()
        widgetNode.attr('class', 'widget running')
        estimatedDuration = data.estimatedDuration || 40000
        iNow = (new Date).setTime((new Date).getTime() + 1000)
        iEnd = (new Date).setTime((new Date).getTime() + estimatedDuration)
        self.currentInterval = progressbarNode.anim_progressbar {
          start: iNow
          finish: iEnd
          interval: 100
          onready: ->
            if !data.building
              self.progressState = 'finish'
        }, self.currentInterval

      if !data.building and self.progressState == 'running'
        console.log 'finish early progress'
        self.progressState = 'finish'
        hideProgressbar()
        return

      else if !data.building and self.progressState == 'finish'
        console.log 'finish progress'
        widgetNode.find('.duration').html('Duration: ' + data.displayDuration)
        self.progressState = 'open'
        hideProgressbar()
        return

      if data.building and self.progressState != 'running'
        console.log 'start progress'
        self.progressState = 'running'
        startProgressbar()
        return