jQuery.fn.anim_progressbar = (aOptions, parentInterval) ->
  clearProgress = (vInterval) ->
    clearInterval vInterval
    $(vPb).children('.percent').html '<b>100%</b>'
    $(vPb).children('.elapsed').html 'Please wait ...'
    return
  # Reset latest interval
  if parentInterval != null
    clearProgress parentInterval
  # def values
  iCms = 1000
  iMms = 60 * iCms
  iHms = 3600 * iCms
  iDms = 24 * 3600 * iCms
  # def options
  aDefOpts =
    start: new Date
    finish: (new Date).setTime((new Date).getTime() + 60 * iCms)
    interval: 100
    onready: ->
  aOpts = jQuery.extend(aDefOpts, aOptions)
  vPb = this
  iDuration = aOpts.finish - (aOpts.start)
  # calling original progressbar
  $(vPb).children('.pbar').progressbar()
  # looping process
  vInterval = setInterval((->
    iLeftMs = aOpts.finish - (new Date)
    # left time in MS
    iElapsedMs = new Date - (aOpts.start)
    iDays = parseInt(iLeftMs / iDms)
    iHours = parseInt((iLeftMs - (iDays * iDms)) / iHms)
    iMin = parseInt((iLeftMs - (iDays * iDms) - (iHours * iHms)) / iMms)
    iSec = parseInt((iLeftMs - (iDays * iDms) - (iMin * iMms) - (iHours * iHms)) / iCms)
    iPerc = if iElapsedMs > 0 then iElapsedMs / iDuration * 100 else 0
    # percentages
    # display current positions and progress
    $(vPb).children('.percent').html '<b>' + iPerc.toFixed(1) + '%</b>'
    #$(vPb).children('.elapsed').html(iDays+' days '+iHours+'h:'+iMin+'m:'+iSec+'s</b>');
    $(vPb).children('.elapsed').html iHours + 'h:' + iMin + 'm:' + iSec + 's</b>'
    $(vPb).children('.pbar').children('.ui-progressbar-value').css 'width', iPerc + '%'
    # in case of Finish
    if iPerc >= 100
      clearProgress vInterval
      aOpts.onready.call this
    return
  ), aOpts.interval)
  vInterval


class Dashing.JenkinsJob extends Dashing.Widget
  ready: ->
    @progressState = 'open'
    @currentInterval = null
    @currentRunningBuildNumber = 0

  onData: (data) ->
    if data.loadCoffeeScript == true
      $(@node).parent().attr('onclick', 'window.open(\'' + data.url + '\')')

      if typeof @progressState != 'undefined' and @progressState != null
        self = this
        widgetNode = $(@node)
        progressbarNode = $(@node).find('.progress')

        hideProgressbar = ->
          progressbarNode.hide()

        startProgressbar = ->
          widgetNode.find('.duration').html('Estimated duration: ' + data.displayEstimatedDuration)
          progressbarNode.show()

          cssClass = "widget running"
          if (widgetNode.hasClass('two-row-widget'))
            cssClass = "widget two-row-widget running"
          widgetNode.attr('class', cssClass)

          estimatedDuration = data.estimatedDuration || 40000
          iNow = data.timestamp
          iEnd = data.timestamp + estimatedDuration

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

        if self.currentRunningBuildNumber != data.buildNumber
          self.currentRunningBuildNumber = data.buildNumber
          widgetNode.find('.duration').html('Duration: ' + data.displayDuration)
          self.progressState = 'open'
          hideProgressbar()

        if data.building and self.progressState != 'running'
          console.log 'start progress'
          self.progressState = 'running'
          startProgressbar()
          return