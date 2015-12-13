
var JenkinsService = require('../lib/jenkins.service').init();
var JenkinsAPI = JenkinsService.api();
var cronJob = require('cron').CronJob;
var moment = require('moment');

JenkinsService.config().jobs.forEach(function(job) {
    new cronJob(job.cronInterval, function(){
        JenkinsAPI[job.apiMethod](job.id, function(error, data) {
            if (error) return console.log(error);
            var eventArguments = {
                title: job.displayName,
                buildNumber: data['id'],
                result: JenkinsService.getResult(data),
                building: data['building'],
                timeAgo: JenkinsService.lastTimeOfExecution(data['timestamp']),
                duration: data['duration'],
                estimatedDuration: data['estimatedDuration'],
                displayDuration: moment(data['duration']).utc().format('HH:mm:ss'),
                displayEstimatedDuration: moment(data['estimatedDuration']).utc().format('HH:mm:ss')
            };

            if (job.parameterizedAttributes != undefined && job.parameterizedAttributes.length > 0) {
                job.parameterizedAttributes.forEach(function(parameter) {
                    var argumentName = parameter.attributeName;
                    var argumentValue = JenkinsService.parameterizedParameterValue(data['actions'], parameter.jenkinsParameterName);
                    eventArguments[argumentName] = argumentValue;
                });
            }

            eventArguments.title_isEnabled = job.displayArguments.title_isEnabled;
            eventArguments.buildNumber_isEnabled = job.displayArguments.buildNumber_isEnabled;
            eventArguments.timeAgo_isEnabled = job.displayArguments.timeAgo_isEnabled;
            eventArguments.branch_isEnabled = job.displayArguments.branch_isEnabled;
            eventArguments.displayDuration_isEnabled = job.displayArguments.displayDuration_isEnabled;

            send_event(job.eventName, eventArguments);
        });
    }, null, true, null);

    setInterval(function() {}, 5000);
});
