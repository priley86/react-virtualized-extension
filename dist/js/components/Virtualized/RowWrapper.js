'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _lodashEs = require('lodash-es');

var _reactabularTable = require('reactabular-table');

var _reactTable = require('@patternfly/react-table');

var _Body = require('./Body');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VirtualizedRowWrapper = function (_React$Component) {
  _inherits(VirtualizedRowWrapper, _React$Component);

  function VirtualizedRowWrapper() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, VirtualizedRowWrapper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = VirtualizedRowWrapper.__proto__ || Object.getPrototypeOf(VirtualizedRowWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.trRef = null, _this.setTrRef = function (element) {
      _this.trRef = element;
    }, _this.updateRowHeight = function () {
      if (_this.trRef) {
        var _this$props = _this.props,
            updateHeight = _this$props.updateHeight,
            rowProps = _this$props.rowProps;

        updateHeight(rowProps['data-rowkey'], _this.getAbsoluteHeight(_this.trRef));
      }
    }, _this.getAbsoluteHeight = function (el) {
      var styles = window.getComputedStyle(el);
      var margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
      return Math.ceil(el.offsetHeight + margin);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  // offsetHeight does not include margins, so we use this helper for better accuracy


  _createClass(VirtualizedRowWrapper, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateRowHeight();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      // update height every update since we have flex css that can change row heights after resize rendering
      this.updateRowHeight();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          updateHeight = _props.updateHeight,
          initialMeasurement = _props.initialMeasurement,
          row = _props.row,
          props = _objectWithoutProperties(_props, ['updateHeight', 'initialMeasurement', 'row']);

      return _react2.default.createElement(_reactTable.RowWrapper, _extends({ trRef: this.setTrRef, row: row, 'aria-rowindex': row['aria-rowindex'] }, props));
    }
  }], [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _props2 = this.props,
          columns = _props2.columns,
          rowData = _props2.rowData;
      // Update only if a row has not been measured and either
      // columns or rowData hasn't changed

      if (nextProps.rowData._measured) {
        return !((0, _reactabularTable.columnsAreEqual)(columns, nextProps.columns) && (0, _lodashEs.isEqual)(rowData, nextProps.rowData));
      }
      return true;
    }
  }]);

  return VirtualizedRowWrapper;
}(_react2.default.Component);

VirtualizedRowWrapper.propTypes = _extends({}, _reactTable.RowWrapper.propTypes, {
  rowProps: _propTypes2.default.shape({
    'data-rowkey': _propTypes2.default.string.isRequired
  }).isRequired,
  updateHeight: _propTypes2.default.func.isRequired,
  initialMeasurement: _propTypes2.default.bool.isRequired
});

var VirtualizedRowWrapperWithContext = function VirtualizedRowWrapperWithContext(props) {
  return _react2.default.createElement(
    _Body.VirtualizedBodyContext.Consumer,
    null,
    function (_ref2) {
      var updateHeight = _ref2.updateHeight,
          initialMeasurement = _ref2.initialMeasurement;
      return _react2.default.createElement(VirtualizedRowWrapper, _extends({}, props, { updateHeight: updateHeight, initialMeasurement: initialMeasurement }));
    }
  );
};

exports.default = VirtualizedRowWrapperWithContext;