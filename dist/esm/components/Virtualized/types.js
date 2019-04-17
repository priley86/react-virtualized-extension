var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import PropTypes from 'prop-types';

var bodyRowContextTypes = {
  initialMeasurement: PropTypes.bool,
  updateHeight: PropTypes.func
};

var bodyWrapperContextTypes = {
  startHeight: PropTypes.number,
  endHeight: PropTypes.number,
  showExtraRow: PropTypes.bool
};
var bodyWrapperTypes = {
  children: PropTypes.any
};
var bodyChildContextTypes = _extends({}, bodyRowContextTypes, bodyWrapperContextTypes);

export { bodyChildContextTypes, bodyRowContextTypes, bodyWrapperContextTypes, bodyWrapperTypes };