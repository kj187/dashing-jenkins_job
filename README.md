# Jenkins Job Dashing widget.

[Jenkins](https://jenkins-ci.org/) widget for [Dashing-JS](http://fabiocaseri.github.io/dashing-js).

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/kj187/dashing-jenkins_job/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

The Jenkins Job widget is a generic widget for Jenkins Jobs which provides a highly visible view of the build status and build progress of selected Jenkins jobs. Via configuration it is possible to add multiple widgets for different Jenkins jobs.

## Preview
![example 1](http://res.cloudinary.com/kj187/image/upload/v1450096022/example_01_wq47h5.png)
![example 2](http://res.cloudinary.com/kj187/image/upload/v1450095915/example_02_gudarm.png) 
## Installation

```shell
$ dashing-js install https://github.com/kj187/dashing-jenkins_job/archive/master.zip
```
Move the `widgets/jenkins_job/jenkins.config.sample.js` file to the dashboard root directory and rename it to `jenkins.config.js`. 

The progressbar requires the jQueryUI styles and javascript lib. Add the following lines to your `dashboards/layout.ejs`

```html
  <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.css">
```

Or if you use Jade as your favorite template engine
```jade
script(src='//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js')
link(rel='stylesheet', href='//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.css')
```

## Requirements
The following NPM packages are required
```shell
$ npm install jenkins-api
$ npm install cron
$ npm install moment
```

## Usage
To include the widget on your dashboard, add the following snippet to the dashboard layout file:

```html
    <li data-row="1" data-col="1" data-sizex="1" data-sizey="1" class="widget-jenkins_job">
      <div data-id="build" data-view="JenkinsJob" data-bind-class="result | append additionalclass" data-additionalclass=" widget"></div>
      <i class="fa fa-archive icon-background"></i>
    </li>
```
Or again, if you use Jade as your favorite template engine 
```jade
      li(data-row='1', data-col='1', data-sizex='1', data-sizey='1', class='widget-jenkins_job')
        div(data-id='build', data-view='JenkinsJob', data-bind-class='result | append additionalclass', data-additionalclass=' widget')
        i(class='fa fa-archive icon-background')
```

You can add multiple widgets for different Jenkins jobs. Each widget must have his own unqiue `data-id`. My suggestion is to get the jenkins job name for `data-id`. 

## Settings

To actually use the widget on your own Dashboard, you'll have to have an access token from your Jenkins server. If you don`t have an access token you can also use your username and password. 

```javascript
module.exports = {
    protocol: 'https',
    username: 'YOUR_JENKINS_USERNAME',
    token: 'YOUR_JENKINS_ACCESS_TOKEN',
    host: 'YOUR_JENKINS_HOST',

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
        
        // Multiple jenkins jobs
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
```
### Jenkins settings
| Setting       | Example           | Description |
| ------------- |-------------| -----|
| protocol      | https   | Protocol of your jenkins server |
| username      | julian.kleinhans   | Username for authentication |
| token         | ABCDEFG12345JHKLLAIJJ   | Access token or plaintext password for authentication |
| host      | jenkins-ci.kj187.de   | Host of your jenkins server |

##### jobs
Jobs is an array and can have multiple jobs

| Setting       | Example           | Description |
| ------------- |-------------| -----|
| id      | build   | The jenkins job name |
| displayName      | Build    | The widget title  |
| eventName      | build   | Event name, must be the same as the data-id attribute |
| cronInterval      | */1 * * * * *   |  |
| apiMethod      | last_build_info   | Jenkins API method. Don`t change this value! |

###### displayArguments
displayArguments gives you the possibility to show or hide some parts in your widget

| Setting       | Example           | Description |
| ------------- |-------------| -----|
| title_isEnabled      | true   | Show title |
| buildNumber_isEnabled      | true   | Show buildnumber |
| timeAgo_isEnabled      | true   | Show time of last execution  |
| branch_isEnabled      | false   | Don`t show the branch name  |
| displayDuration_isEnabled      | true   | Show the duration time  |

###### parameterizedAttributes
In Jenkins it is possible to create your own attributes (parameterized attributes). With this array it is possible to read this dynamical attributes and bind them onto an variable. 

| Setting       | Example           | Description |
| ------------- |-------------| -----|
| attributeName      | branch   | Attribute name which is available for data-bind |
| jenkinsParameterName      | BRANCH_TO_BUILD   | The name of your own jenkins parameter |
