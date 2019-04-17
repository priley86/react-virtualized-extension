'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bodyWrapperTypes = exports.bodyWrapperContextTypes = exports.bodyRowContextTypes = exports.bodyChildContextTypes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bodyRowContextTypes = {
  initialMeasurement: _propTypes2.default.bool,
  updateHeight: _propTypes2.default.func
};

var bodyWrapperContextTypes = {
  startHeight: _propTypes2.default.number,
  endHeight: _propTypes2.default.number,
  showExtraRow: _propTypes2.default.bool
};
var bodyWrapperTypes = {
  children: _propTypes2.default.any
};
var bodyChildContextTypes = _extends({}, bodyRowContextTypes, bodyWrapperContextTypes);

exports.bodyChildContextTypes = bodyChildContextTypes;
exports.bodyRowContextTypes = bodyRowContextTypes;
exports.bodyWrapperContextTypes = bodyWrapperContextTypes;
exports.bodyWrapperTypes = bodyWrapperTypes;