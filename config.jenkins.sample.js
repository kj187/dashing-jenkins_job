
module.exports = {

    protocol: 'https',
    username: '',
    token: '',
    host: '',

    jobs: [
        {
            id: 'build',
            displayName: 'Build',
            eventName: 'build',
            cronInterval: '*/1 * * * * *',
            apiMethod: 'last_build_info',

            displayArguments: {
                title_isEnabled: true,
                buildNumber_isEnabled: true,
                timeAgo_isEnabled: true,
                branch_isEnabled: true,
                displayDuration_isEnabled: true
            },

            //parameterizedAttributes: [
            //    {
            //        attributeName: 'branch',
            //        jenkinsParameterName: 'BRANCH_TO_BUILD'
            //    }
            //]
        },
        //{
        //    id: 'static_code_analysis',
        //    displayName: 'Static Code Analysis',
        //    eventName: 'static_code_analysis',
        //    cronInterval: '*/1 * * * * *',
        //    apiMethod: 'last_build_info',
        //
        //    displayArguments: {
        //        title_isEnabled: true,
        //        buildNumber_isEnabled: false,
        //        timeAgo_isEnabled: true,
        //        branch_isEnabled: false,
        //        displayDuration_isEnabled: true
        //    }
        //}
    ]
}