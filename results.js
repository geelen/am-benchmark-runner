"use strict";

var ss = require('simple-statistics');

var report = function (name) {
  console.log("\n\n## " + name);
  var data = require('./' + name + '.json');
  Object.keys(data).forEach(function (variant) {
    console.log("\n" + variant);
    var timings = {
      firstPaint: [],
      Layout: [],
      RecalculateStyles: []
    };
    data[variant].forEach(function (run) {
      Object.keys(timings).forEach(function (timing) {
        timings[timing].push(run[0][timing].value);
      });
    });
    Object.keys(timings).forEach(function (timing) {
      console.log("# " + timing);
      console.log("Median: " + ss.median(timings[timing]));
      console.log("Median Abs Dev: " + ss.median_absolute_deviation(timings[timing]));
    });
  });
};

report('twitter');
//console.log(Object.keys(data.values[0][0]))
