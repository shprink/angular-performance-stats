# angular-memory-stats

This plugin is based on Paul Irish's [memory-stats](https://github.com/paulirish/memory-stats.js).

![image](http://i.imgur.com/eUCFcAH.gif)

Only 3.2Kb (minified version)!

## Install

```
npm i angular-memory-stats --save
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
    'angular-memory-stats'
])
```

### Insert the directive in the dom

```
<angular-memory-stats></angular-memory-stats>
```

### Disable

angular-memory-stats is enabled by default, if you wish to disable it use the ```angularMemoryStatsProvider``` Provider

```
angular.module('yourModule').config(function(angularMemoryStatsProvider){
    angularMemoryStatsProvider.enable(false)
});
```

## Contribute

```
sudo npm install webpack webpack-dev-server -g
npm install
webpack-dev-server --port 8080
```

Open ```http://localhost:8080```
