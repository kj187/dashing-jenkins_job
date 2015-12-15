# Jenkins Job Dashing widget

Author: [Julian Kleinhans](https://github.com/kj187)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/kj187/dashing-jenkins_job/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[Dashing-JS](https://github.com/fabiocaseri/dashing-js) is a NodeJS port of [Dashing](http://dashing.io/), an Sinatra based framework that lets you build beautiful dashboards.

The [Jenkins](https://jenkins-ci.org/) Job widget is a generic widget for Jenkins jobs which provides a highly visible view of the build status and build progress of selected Jenkins jobs. Via configuration it is possible to add multiple widgets for different Jenkins jobs.

## Preview
![example 1](http://res.cloudinary.com/kj187/image/upload/v1450128665/example_01_xri70k.png)
![example 2](http://res.cloudinary.com/kj187/image/upload/v1450128664/example_02_lzhqfv.png) 

### Reallife example
Here you can see what you can achive only with Dashing-JS and this Jenkins Job widget.

![Dashboard example](http://res.cloudinary.com/kj187/image/upload/c_scale,w_890/v1450165072/KJ187_Dashboard_p6ej4o.png)

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

or if you use Jade as your favorite template engine
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

You can add multiple widgets for different Jenkins jobs. Each widget must have his own unqiue `data-id`. My suggestion is to get the Jenkins job name for `data-id`. 

## Settings

To actually use the widget on your own Dashboard, you'll have to have an access token from your Jenkins server. If you don`t have an access token you can also use your username and password. 

```javascript
module.exports = {

    protocol: 'https',
    username: 'YOUR_JENKINS_USERNAME',
    token: 'YOUR_JENKINS_ACCESS_TOKEN_OR_PLAINTEXT_PASSWORD',
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
        //},
        //{
        //    id: 'install_latest',
        //    displayName: 'Install Latest',
        //    eventName: 'install_latest',
        //    cronInterval: '*/1 * * * * *',
        //    apiMethod: 'last_build_info',
        //
        //    overwriteArguments: [
        //        {
        //            sourceJobId: 'build',
        //            sourceArgumentName: 'id',
        //            targetArgumentName: 'buildNumber'
        //        }
        //    ],
        //
        //    displayArguments: {
        //        title_isEnabled: true,
        //        buildNumber_isEnabled: true,
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
| protocol      | https   | Http protocol of your Jenkins server |
| username      | julian.kleinhans   | Username for authentication |
| token         | ABCDEFG12345JHKLLAIJJ   | Access token or plaintext password for authentication |
| host      | jenkins-ci.kj187.de   | Host of your Jenkins server |

##### jobs
You can define multiple jobs, keep in mind to add the html snippet in your dashboard layout file

| Setting       | Example           | Description |
| ------------- |-------------| -----|
| id      | build   | Jenkins job name |
| displayName      | Build    | Widget title  |
| eventName      | build   | Event name, must be the same as the `data-id` attribute |
| cronInterval      | */1 * * * * *   | Click [here](https://github.com/ncb000gt/node-cron) for available cron patterns |
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
In Jenkins it is possible to create your own attributes (parameterized attributes). With this array it is possible to read this dynamical attributes and bind them onto a variable. 

| Setting       | Example           | Description |
| ------------- |-------------| -----|
| attributeName      | branch   | Attribute name which is available for the `data-bind` argument |
| jenkinsParameterName      | BRANCH_TO_BUILD   | The name of your own Jenkins parameter |

###### overwriteArguments
Imagine that you have two Jenkins jobs. A build job, which creates an build artifact and an install job, which installs the build artifact on a server. Each job has his own buildnumber. But, for the second install job, we would like to know which build artifact - from the first jenkins job - was installed. With this setting you can get an specific argument from an other Jenkins job.

| Setting       | Example           | Description |
| ------------- |-------------| -----|
| sourceJobId      | build   | Jenkins job name |
| sourceArgumentName      | id   | Argument "id" from the sourceJobId Jenkins job |
| targetArgumentName      | buildNumber   | Variable which stores the value of sourceArgumentName |
