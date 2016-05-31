
var jenkins_api = require('jenkins-api');
var config = require("../config/config.jenkins_job");
var moment = require('moment');
var JenkinsAPI;

var init = function() {

    JenkinsAPI = jenkins_api.init(config.protocol + '://' + config.username + ':' + config.token + '@' + config.host, config.request.defaults);

    return {
        getResult: function(data) {
            if (data['building'] == true || data['result'] == undefined || data['result'] == null) {
                return 'running';
            }

            return data['result'].toLowerCase();
        },

        parameterizedParameterValue: function(actions, parameterName) {
            var result = '';
            actions.forEach(function(action) {
                if (action['parameters'] === undefined) return;
                action['parameters'].forEach(function(parameter) {
                    if(parameter['name'] != parameterName) {
                        return;
                    }
                    result = parameter['value'];
                });
            });
            return result;
        },

        lastTimeOfExecution: function(timestamp) {
            var now = moment(moment().toDate().getTime());
            var lastBuildDate = moment(timestamp).utc();
            return lastBuildDate.from(now);
        }
    }
};

var JenkinsService = init();
var cronJob = require('cron').CronJob;
var request = require('request');
var cache = require('memory-cache');

if (config.request.defaults) {
    request = request.defaults(config.request.defaults);
}

config.jobs.forEach(function(job) {
    new cronJob(job.cronInterval, function(){
        JenkinsAPI[job.apiMethod](job.id, function(error, data) {
            if (error) return console.log('Error:', error);
            var eventArguments = {
                loadCoffeeScript: true,
                title: job.displayName,
                buildNumber: data['id'],
                result: JenkinsService.getResult(data),
                building: data['building'],
                timestamp: data['timestamp'],
                timeAgo: JenkinsService.lastTimeOfExecution(data['timestamp']),
                duration: data['duration'],
                estimatedDuration: data['estimatedDuration'],
                displayDuration: moment(data['duration']).utc().format('HH:mm:ss'),
                displayEstimatedDuration: moment(data['estimatedDuration']).utc().format('HH:mm:ss'),
                url: data['url']
            };

            if (job.externalBuildNumber != undefined) {
                var lastBuildTimestamp = cache.get(job.id + '_timestamp');
                var externalBuildNumber = cache.get(job.id + '_externalBuildNumber');
                if (externalBuildNumber != null) {
                    eventArguments.buildNumber = externalBuildNumber;
                }
                if (externalBuildNumber == null || (eventArguments.building == false && data['timestamp'] != lastBuildTimestamp)) {
                    delete eventArguments.buildNumber;
                    request({
                        url: job.externalBuildNumber.url,
                        headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache'
                        }
                    }, function (error, response, externalBuildNumber) {
                        if (error || response.statusCode != 200) {
                            externalBuildNumber = 'Error';
                            console.log(job.externalBuildNumber.url + ' not found: ', error, response.statusCode)
                        }

                        cache.put(job.id + '_externalBuildNumber', externalBuildNumber, 180000);
                        cache.put(job.id + '_timestamp', data['timestamp'], 180000);
                        send_event(job.eventName, {buildNumber: externalBuildNumber});
                    })
                }
            }

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
