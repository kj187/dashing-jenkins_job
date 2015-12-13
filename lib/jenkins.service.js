
var jenkins_api = require('jenkins-api');
var config = require("../config.jenkins");
var moment = require('moment');
var API;

var init = exports.init = function() {

    API = jenkins_api.init(config.protocol + '://' + config.username + ':' + config.token + '@' + config.host, {
        rejectUnauthorized: false
    });

    return {
        api: function() {
            return API;
        },

        config: function() {
            return config;
        },

        getResult: function(data) {
            if (data['result'] == undefined || data['result'] == null) {
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