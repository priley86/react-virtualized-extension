'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _calculateAverageHeight = require('./calculateAverageHeight');

var _calculateAverageHeight2 = _interopRequireDefault(_calculateAverageHeight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var calculateRows = function calculateRows(_ref) {
  var measuredRows = _ref.measuredRows,
      height = _ref.height,
      rowKey = _ref.rowKey,
      rows = _ref.rows,
      _ref$scrollTop = _ref.scrollTop,
      scrollTop = _ref$scrollTop === undefined ? 0 : _ref$scrollTop;

  // used exact measured row heights for determining `startIndex` for smooth scroll
  // average heights are not accurate when there is lots of variation in row heights
  var startIndex = 0;
  var startHeight = 0;
  var accruedHeight = 0;
  for (var i = 0; i < Object.keys(measuredRows).length; i++) {
    accruedHeight += measuredRows[i + '-row'];
    if (scrollTop < accruedHeight) {
      startIndex = i;
      break;
    } else {
      startHeight = accruedHeight;
    }
  }

  // averageHeight of measuredRows can still be used to closely approximate amount of rows to render
  // if this causes issues w/ row visibility, exact heights can still be used
  var averageHeight = (0, _calculateAverageHeight2.default)({ measuredRows: measuredRows, rows: rows, rowKey: rowKey });
  var amountOfRowsToRender = Math.ceil(height / averageHeight) + 2;

  var zeroedIndex = startIndex;
  var rowsToRender = rows.slice(zeroedIndex, Math.max(startIndex + amountOfRowsToRender, 0));

  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && window.LOG_VIRTUALIZED) {
    console.log(
    // eslint-disable-line no-console
    'update rows to render', 'scroll top', scrollTop, 'measured rows', measuredRows, 'amount of rows to render', amountOfRowsToRender, 'rows to render', rowsToRender, 'start index', startIndex);
  }

  // Escape if there are no rows to render for some reason
  if (!rowsToRender.length) {
    return null;
  }

  // Calculate the padding of the last row so we can match whole height. This
  // won't be totally accurate if row heights differ but should get close
  // enough in most cases.
  var endHeight = Math.max((rows.length - amountOfRowsToRender) * averageHeight - startHeight, 0);

  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && window.LOG_VIRTUALIZED) {
    console.log(
    // eslint-disable-line no-console
    'average height', averageHeight, 'body height', height, 'scroll top', scrollTop, 'start height', startHeight, 'end height', endHeight);
  }

  return {
    amountOfRowsToRender: amountOfRowsToRender,
    startIndex: zeroedIndex,
    showExtraRow: !(zeroedIndex % 2),
    startHeight: startHeight,
    endHeight: endHeight
  };
}; /**
    * calculateRows.js
    * https://github.com/reactabular/reactabular/blob/v8.17.0/packages/reactabular-virtualized/src/calculate-rows.js
    *
    * Forked from version 8.17.0; includes the following modifications:
    * 1) Calculate actual row heights in determining startIndex. This allows dynamic row heights.
    * */
exports.default = calculateRows;