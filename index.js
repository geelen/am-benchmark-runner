var browserPerf = require('browser-perf'),
  Promise = require('bluebird'),
  testUrl = 'https://twitter.com/glenmaddern',
  amBenchmarkUrl = 'http://am-benchmark.glenmaddern.com/',
  numRuns = 10;

var getTimingsForUrl = function (url, numRuns) {
  console.error("Fetching " + url + " num " + numRuns);
  return new Promise(function (resolve, reject) {
    browserPerf(url, function (err, res) {
      if (err) return reject(err);
      resolve(res);
    }, {actions: []});
  }).then(function (res) {
      if (numRuns > 1) {
        return getTimingsForUrl(url, numRuns - 1).then(function (results) {
          return [res].concat(results);
        });
      } else {
        return [res];
      }
    });
};
var getAllTimingsForSite = function (site) {
//  return Promise.all(['baseline', 'classes'].map(function (variant) {
//    return getTimingsForUrl(amBenchmarkUrl + variant + '/' + site, numRuns);
//  }))
  results = {};
  return getTimingsForUrl(amBenchmarkUrl + 'baseline/' + site, numRuns)
    .then(function (baseline) {
      results.baseline = baseline;
      return getTimingsForUrl(amBenchmarkUrl + 'classes/' + site, numRuns);
    }).then(function (classes) {
      results.classes = classes;
      return getTimingsForUrl(amBenchmarkUrl + 'attributes/' + site, numRuns);
    }).then(function (attributes) {
      results.attributes = attributes;
      return getTimingsForUrl(amBenchmarkUrl + 'values/' + site, numRuns);
    }).then(function (values) {
      results.values = values;
      return getTimingsForUrl(amBenchmarkUrl + 'am/' + site, numRuns);
    }).then(function (am) {
      results.am = am;
      return results;
    });
};

getAllTimingsForSite(testUrl).then(function (results) {
  console.log(JSON.stringify(results, null, 2));
});
