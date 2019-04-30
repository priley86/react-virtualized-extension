var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash-es';
import { columnsAreEqual } from 'reactabular-table';
import { RowWrapper } from '@patternfly/react-table';
import { VirtualizedBodyContext } from './Body';

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

        updateHeight(rowProps['aria-rowindex'], _this.getAbsoluteHeight(_this.trRef));
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
          rowProps = _props.rowProps,
          props = _objectWithoutProperties(_props, ['updateHeight', 'initialMeasurement', 'row', 'rowProps']);

      return React.createElement(RowWrapper, _extends({
        trRef: this.setTrRef,
        row: row,
        'aria-rowindex': row['aria-rowindex'],
        'data-id': rowProps['data-id']
      }, props));
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
        return !(columnsAreEqual(columns, nextProps.columns) && isEqual(rowData, nextProps.rowData));
      }
      return true;
    }
  }]);

  return VirtualizedRowWrapper;
}(React.Component);

VirtualizedRowWrapper.propTypes = _extends({}, RowWrapper.propTypes, {
  rowProps: PropTypes.shape({
    'data-id': PropTypes.string.isRequired,
    'aria-rowindex': PropTypes.number.isRequired
  }).isRequired,
  updateHeight: PropTypes.func.isRequired,
  initialMeasurement: PropTypes.bool.isRequired
});

var VirtualizedRowWrapperWithContext = function VirtualizedRowWrapperWithContext(props) {
  return React.createElement(
    VirtualizedBodyContext.Consumer,
    null,
    function (_ref2) {
      var updateHeight = _ref2.updateHeight,
          initialMeasurement = _ref2.initialMeasurement;
      return React.createElement(VirtualizedRowWrapper, _extends({}, props, { updateHeight: updateHeight, initialMeasurement: initialMeasurement }));
    }
  );
};

export default VirtualizedRowWrapperWithContext;