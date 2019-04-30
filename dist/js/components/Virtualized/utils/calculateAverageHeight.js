"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * calculateAverageHeight.js
 * https://github.com/reactabular/reactabular/blob/v8.17.0/packages/reactabular-virtualized/src/calculate-average-height.js
 *
 * Forked from version 8.17.0
 * 
 * Changes:
 * - Use arrow-rowindex based measured amounts for simplicity
 * - prevent divide by zero exception
 * */
var calculateAverageHeight = function calculateAverageHeight(measuredRows) {
  var measuredAmounts = Object.keys(measuredRows).map(function (key) {
    return measuredRows[key];
  });
  var amountOfMeasuredRows = measuredAmounts.length;
  // prevent divide by zero exception
  return Math.max(measuredAmounts.reduce(function (a, b) {
    return a + b / amountOfMeasuredRows;
  }, 0), 1);
};

exports.default = calculateAverageHeight;