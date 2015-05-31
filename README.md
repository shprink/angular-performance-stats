Only 7Kb (minified version)!

## Install

```
npm i angular-performance-stats --save
```

### Start Chrome with `--enable-precise-memory-info`

```
# Linux
google-chrome --enable-precise-memory-info --enable-memory-info

#MacOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-precise-memory-info --enable-memory-info
```

Otherwise the results from performance.memory are bucketed and less useful.

### Add the module to your Angular's dependencies

```
angular.module('yourModule', [
    'angular-performance-stats'
])
```

### Disable

angular-memory-stats is enabled by default, if you wish to disable it use the ```angularMemoryStatsProvider``` Provider

```
angular.module('yourModule')
.config(function(angularPerformanceStatsProvider){
    angularPerformanceStatsProvider.enable(false)
})
.run(function(angularPerformanceStats){
    angularPerformanceStats.run(); // Insert angularPerformanceStats in the DOM if enabled
});
```

## Contribute

```
sudo npm install webpack webpack-dev-server -g
npm install
webpack-dev-server --port 8080
```

Open ```http://localhost:8080```
