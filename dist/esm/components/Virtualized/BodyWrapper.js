var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { VirtualizedBodyContext } from './Body';
import { BodyWrapper as ReactTableBodyWrapper } from '@patternfly/react-table';
import { bodyWrapperContextTypes, bodyWrapperTypes } from './types';

import { virtualizedCss } from './css/virtualized-css';

virtualizedCss.inject();

var BodyWrapper = function (_Component) {
  _inherits(BodyWrapper, _Component);

  function BodyWrapper() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, BodyWrapper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = BodyWrapper.__proto__ || Object.getPrototypeOf(BodyWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.tr = function (props) {
      return React.createElement('tr', props);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(BodyWrapper, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          tbodyRef = _props.tbodyRef,
          startHeight = _props.startHeight,
          endHeight = _props.endHeight,
          showExtraRow = _props.showExtraRow,
          mappedRows = _props.mappedRows,
          props = _objectWithoutProperties(_props, ['children', 'tbodyRef', 'startHeight', 'endHeight', 'showExtraRow', 'mappedRows']);

      var startRow = this.tr({
        key: 'start-row',
        style: {
          height: startHeight
        },
        'aria-hidden': true,
        className: 'pf-virtualized-spacer'
      });
      var endRow = this.tr({
        key: 'end-row',
        style: {
          height: endHeight
        },
        'aria-hidden': true,
        className: 'pf-virtualized-spacer'
      });
      // Extra row to keep onRow indexing stable instead of even/odd. This is important
      // for styling.
      var rows = [startRow].concat(children).concat(endRow);

      if (showExtraRow) {
        rows.unshift(this.tr({
          key: 'extra-row',
          style: {
            height: 0
          },
          'aria-hidden': true,
          className: 'pf-virtualized-spacer'
        }));
      }

      return React.createElement(
        ReactTableBodyWrapper,
        _extends({}, props, { tbodyRef: tbodyRef }),
        rows
      );
    }
  }]);

  return BodyWrapper;
}(Component);

BodyWrapper.contextTypes = bodyWrapperContextTypes;
BodyWrapper.propTypes = _extends({}, bodyWrapperTypes, ReactTableBodyWrapper.propTypes);

var propTypes = {
  rows: PropTypes.array,
  tbodyRef: PropTypes.func
};
var defaultProps = {
  rows: [],
  tbodyRef: null
};

var VirtualizedBodyWrapper = function VirtualizedBodyWrapper(_ref2) {
  var props = _objectWithoutProperties(_ref2, []);

  return React.createElement(
    VirtualizedBodyContext.Consumer,
    null,
    function (_ref3) {
      var tbodyRef = _ref3.tbodyRef,
          startHeight = _ref3.startHeight,
          endHeight = _ref3.endHeight,
          showExtraRow = _ref3.showExtraRow;
      return React.createElement(BodyWrapper, _extends({}, props, {
        tbodyRef: tbodyRef,
        startHeight: startHeight,
        endHeight: endHeight,
        showExtraRow: showExtraRow
      }));
    }
  );
};
VirtualizedBodyWrapper.propTypes = propTypes;
VirtualizedBodyWrapper.defaultProps = defaultProps;

export default VirtualizedBodyWrapper;