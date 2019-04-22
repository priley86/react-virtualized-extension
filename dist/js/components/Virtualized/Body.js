'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VirtualizedBodyContext = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.heightPropCheck = heightPropCheck;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactabularTable = require('reactabular-table');

var _reactTable = require('@patternfly/react-table');

var _calculateAverageHeight = require('./utils/calculateAverageHeight');

var _calculateAverageHeight2 = _interopRequireDefault(_calculateAverageHeight);

var _calculateRows = require('./utils/calculateRows');

var _calculateRows2 = _interopRequireDefault(_calculateRows);

var _detectElementResize = require('./utils/detectElementResize');

var _detectElementResize2 = _interopRequireDefault(_detectElementResize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var initialContext = {
  amountOfRowsToRender: 3, // First few rows for initial measurement
  startIndex: 0, // Index where to start rendering
  startHeight: 0, // Heights for extra rows to mimic scrolling
  endHeight: 0,
  showExtraRow: false // Show extra row (even/odd issue)
};
var VirtualizedBodyContext = exports.VirtualizedBodyContext = _react2.default.createContext(initialContext);

var Body = function (_React$Component) {
  _inherits(Body, _React$Component);

  // row key -> measurement
  function Body(props) {
    _classCallCheck(this, Body);

    var _this = _possibleConstructorReturn(this, (Body.__proto__ || Object.getPrototypeOf(Body)).call(this, props));

    _this.state = initialContext;
    _this.measuredRows = {};
    _this.tbodyRef = null;
    _this.initialMeasurement = true;
    _this.scrollTop = 0;
    _this.timeoutId = 0;

    _this.setTbodyRef = function (element) {
      _this.tbodyRef = element;
    };

    _this.scrollTo = function (index) {
      var _this$props = _this.props,
          rows = _this$props.rows,
          rowKey = _this$props.rowKey;

      var startIndex = parseInt(index, 10);

      if (startIndex >= 0) {
        var startHeight = (0, _calculateAverageHeight2.default)({
          measuredRows: _this.measuredRows,
          rows: rows,
          rowKey: rowKey
        }) * startIndex;

        _this.scrollTop = startHeight;
        _this.tbodyRef.scrollTop = startHeight;

        _this.setState(_this.calculateRows());
      }
    };

    _this.checkMeasurements = function (prevProps) {
      // If there are no valid measurements or the rows have changed,
      // calculate some after waiting a while. Without this some styling solutions
      // won't work as you might expect given they can take a while to set container height.
      if (_this.initialMeasurement || prevProps && prevProps.rows !== _this.props.rows) {
        // If the rows have changed, but the user has not scrolled, maintain the existing
        // scroll position
        if (_this.tbodyRef) {
          _this.tbodyRef.scrollTop = _this.scrollTop;
        }
        _this.timeoutId = setTimeout(function () {
          var rows = _this.calculateRows();

          if (!rows) {
            // Refresh the rows to trigger measurement.
            _this.forceUpdate();

            return;
          }

          _this.setState(rows, function () {
            _this.initialMeasurement = false;
          });
        }, 100);
      }
    };

    _this.getHeight = function () {
      var _this$props2 = _this.props,
          container = _this$props2.container,
          height = _this$props2.height,
          style = _this$props2.style;

      if (container && container()) {
        return container().clientHeight;
      }
      // If `props.height` is not defined, we use `props.style.maxHeight` instead.
      return height || style.maxHeight;
    };

    _this.rowsToRender = function (rows, startIndex, amountOfRowsToRender, rowKey) {
      var renderedRows = rows.slice(startIndex, startIndex + amountOfRowsToRender).map(function (rowData, rowIndex) {
        return _extends({}, rowData, {
          'aria-rowindex': startIndex + rowIndex + 1, // aria-rowindex should be 1-based, not 0-based.
          _measured: !!_this.measuredRows[(0, _reactabularTable.resolveRowKey)({ rowData: rowData, rowIndex: rowIndex, rowKey: rowKey })]
        });
      });
      return renderedRows;
    };

    _this.getBodyOffset = function (container) {
      return (
        // this is a bug in reactabular-virtualized, return this.tbodyRef.parentElement.offsetTop + this.tbodyRef.offsetTop;
        // simply returning the tbodyRef.offsetTop does not account for cases that other parent elements set position:relative
        // could be the offset parent. We want the offset from tbody to the passed container element. This can change as the
        // user scrolls so it should only be calculated initially or on resize after scroll position is reset.
        _this.tbodyRef.getBoundingClientRect().top - container.getBoundingClientRect().top
      );
    };

    _this.registerContainer = function () {
      setTimeout(function () {
        var element = _this.props.container();
        element && element.addEventListener('scroll', _this.onScroll);
        _this._detectElementResize = (0, _detectElementResize2.default)();
        _this._detectElementResize.addResizeListener(element, _this.onResize);
        _this.setContainerOffset();
      }, 0);
    };

    _this.setContainerOffset = function () {
      var element = _this.props.container && _this.props.container();
      if (element) {
        _this.containerOffset = _this.getBodyOffset(element);
      }
    };

    _this.calculateRows = function () {
      var _this$props3 = _this.props,
          rows = _this$props3.rows,
          rowKey = _this$props3.rowKey;

      return (0, _calculateRows2.default)({
        scrollTop: _this.scrollTop,
        measuredRows: _this.measuredRows,
        height: _this.getHeight(),
        rowKey: rowKey,
        rows: rows
      });
    };

    _this.onScroll = _this.onScroll.bind(_this);
    _this.onResize = _this.onResize.bind(_this);
    return _this;
  } // tbody ref used for gathering scroll position


  // Attach information about measuring status. This way we can implement
  // proper shouldComponentUpdate


  _createClass(Body, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.checkMeasurements();
      if (this.props.container) {
        this.registerContainer();
      } else {
        this._detectElementResize = (0, _detectElementResize2.default)();
        this._detectElementResize.addResizeListener(this.tbodyRef, this.onResize);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      this.checkMeasurements(prevProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.tbodyRef && this.tbodyRef.__resizeListeners__) {
        this.tbodyRef && this._detectElementResize.removeResizeListener(this.tbodyRef, this.onResize);
      }
      clearTimeout(this.timeoutId);
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      // if the containing element resizes reset all measurements & `measuredRows`
      this.initialMeasurement = true;
      this.scrollTop = 0;
      this.setState(initialContext);
      this.measuredRows = {};
      this.setContainerOffset();
      this.checkMeasurements();
    }
  }, {
    key: 'onScroll',
    value: function onScroll(e) {
      var _props = this.props,
          onScroll = _props.onScroll,
          container = _props.container;

      onScroll && onScroll(e);

      var scrollTop = e.target.scrollTop;

      // Y didn't change, bail to avoid rendering rows

      if (this.scrollTop === scrollTop) {
        return;
      }
      this.scrollTop = container ? scrollTop - this.containerOffset : scrollTop;
      this.setState(this.calculateRows());
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          _onRow = _props2.onRow,
          rows = _props2.rows,
          onScroll = _props2.onScroll,
          container = _props2.container,
          rowKey = _props2.rowKey,
          props = _objectWithoutProperties(_props2, ['onRow', 'rows', 'onScroll', 'container', 'rowKey']);

      var _state = this.state,
          startIndex = _state.startIndex,
          amountOfRowsToRender = _state.amountOfRowsToRender,
          startHeight = _state.startHeight,
          endHeight = _state.endHeight,
          showExtraRow = _state.showExtraRow;

      var height = this.getHeight();

      var rowsToRender = this.rowsToRender(rows, startIndex, amountOfRowsToRender, rowKey);
      if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined' && window.LOG_VIRTUALIZED) {
        console.log(
        // eslint-disable-line no-console
        'rendering', rowsToRender.length, '/', rows.length, 'rows to render', rowsToRender, 'start index', startIndex, 'amount of rows to render', amountOfRowsToRender);
      }

      var style = { height: height };
      if (!container) {
        // if we do not have a parent container to scroll, set the body to scroll
        style.display = 'block';
        style.overflow = 'auto';
      }
      var tableBodyProps = _extends({}, props, {
        height: height,
        style: style,
        onRow: function onRow(row, extra) {
          return _extends({
            // Pass index so that row heights can be tracked properly
            'data-rowkey': extra.rowKey
          }, _onRow ? _onRow(row, extra) : {});
        },
        rowsToRender: rowsToRender
      });

      // do not listen to tbody onScroll if we are using window scroller
      if (!container) {
        tableBodyProps.onScroll = this.onScroll;
      }

      return _react2.default.createElement(
        VirtualizedBodyContext.Provider,
        {
          value: {
            tbodyRef: this.setTbodyRef,
            startHeight: startHeight,
            endHeight: endHeight,
            showExtraRow: showExtraRow,
            updateHeight: function updateHeight(oneRowKey, rowHeight) {
              _this2.measuredRows[oneRowKey] = rowHeight;
            },
            // Capture height data only during the initial measurement or during resize
            initialMeasurement: this.initialMeasurement
          }
        },
        _react2.default.createElement(_reactTable.TableBody, tableBodyProps)
      );
    }
  }]);

  return Body;
}(_react2.default.Component);

Body.propTypes = _extends({}, _reactTable.TableBody.propTypes, {
  height: heightPropCheck,
  container: _propTypes2.default.func
});
Body.defaultProps = {
  height: undefined,
  container: undefined
};

var VirtualizedBody = function VirtualizedBody(_ref) {
  var tableBody = _ref.tableBody,
      props = _objectWithoutProperties(_ref, ['tableBody']);

  return _react2.default.createElement(
    _reactTable.TableContext.Consumer,
    null,
    function (_ref2) {
      var headerData = _ref2.headerData,
          rows = _ref2.rows;
      return _react2.default.createElement(Body, _extends({}, props, { ref: tableBody, headerData: headerData, rows: rows }));
    }
  );
};

VirtualizedBody.defaultProps = _reactTable.TableBody.defaultProps;
VirtualizedBody.propTypes = {
  /** Additional classes for table body. */
  className: _propTypes2.default.string,
  /** Specify key which should be used for labeling each row. */
  rowKey: _propTypes2.default.string,
  /** Function that is fired when user clicks on row.  */
  onRowClick: _propTypes2.default.func,
  /** Virtualized rows (optional provided in place of rows) */
  rowsToRender: _propTypes2.default.array,
  /** the height of the body or window container */
  height: heightPropCheck,
  /** a callback return the container ref */
  container: _propTypes2.default.func,
  /** a react ref that can be used by the consumer to scroll to a given index */
  tableBody: _propTypes2.default.object
};

function heightPropCheck(props, propName, componentName) {
  if (typeof props[propName] !== 'number' && (!props.style || typeof props.style.maxHeight !== 'number') && (!props.container || typeof props.container !== 'function')) {
    return new Error('height or style.maxHeight of type \'number\' or container of type \'function\' is marked as required in ' + componentName);
  }

  return undefined;
}

exports.default = VirtualizedBody;