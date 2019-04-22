var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * WindowScroller.js
 * https://github.com/bvaughn/react-virtualized/blob/9.21.0/source/WindowScroller/WindowScroller.js
 * Brian Vaughn
 *
 * Forked from version 9.21.0; includes the following modifications:
 * 1) Allow scrollElement to be queryable as a string using document.querySelector or passed as an element
 * */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { canUseDOM } from 'exenv';
import { registerScrollListener, unregisterScrollListener } from './utils/onScroll';
import { getDimensions, getPositionOffset, getScrollOffset } from './utils/dimensions';
import createDetectElementResize from './utils/detectElementResize';

/**
 * Specifies the number of miliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
export var IS_SCROLLING_TIMEOUT = 150;

var getWindow = function getWindow() {
  return typeof window !== 'undefined' ? window : undefined;
};

var WindowScroller = function (_React$PureComponent) {
  _inherits(WindowScroller, _React$PureComponent);

  function WindowScroller(props) {
    _classCallCheck(this, WindowScroller);

    var _this = _possibleConstructorReturn(this, (WindowScroller.__proto__ || Object.getPrototypeOf(WindowScroller)).call(this, props));

    _this._window = getWindow();
    _this._isMounted = false;
    _this._positionFromTop = 0;
    _this._positionFromLeft = 0;
    _this._detectElementResize = {
      addResizeListener: function addResizeListener() {
        return null;
      },
      removeResizeListener: function removeResizeListener() {
        return null;
      }
    };
    _this._child = null;

    _this._registerChild = function (element) {
      if (element && !(element instanceof Element)) {
        console.warn('WindowScroller registerChild expects to be passed Element or null');
      }
      _this._child = element;
      _this.updatePosition();
    };

    _this._onChildScroll = function (_ref) {
      var scrollTop = _ref.scrollTop;

      if (_this.state.scrollTop === scrollTop) {
        return;
      }
      var scrollElement = _this._getScrollElement();
      if (scrollElement) {
        if (typeof scrollElement.scrollTo === 'function') {
          scrollElement.scrollTo(0, scrollTop + _this._positionFromTop);
        } else {
          scrollElement.scrollTop = scrollTop + _this._positionFromTop;
        }
      }
    };

    _this._registerResizeListener = function (element) {
      if (element === window) {
        window.addEventListener('resize', _this.onResize, false);
      } else {
        _this._detectElementResize.addResizeListener(element, _this.onResize);
      }
    };

    _this._unregisterResizeListener = function (element) {
      if (element === window) {
        window.removeEventListener('resize', _this.onResize, false);
      } else if (element && element.__resizeListeners__) {
        _this._detectElementResize.removeResizeListener(element, _this.onResize);
      }
    };

    _this.__handleWindowScrollEvent = function () {
      if (!_this._isMounted) {
        return;
      }

      var onScroll = _this.props.onScroll;

      var scrollElement = _this._getScrollElement();

      if (scrollElement) {
        var scrollOffset = getScrollOffset(scrollElement);
        var scrollLeft = Math.max(0, scrollOffset.left - _this._positionFromLeft);
        var scrollTop = Math.max(0, scrollOffset.top - _this._positionFromTop);

        _this.setState({
          isScrolling: true,
          scrollLeft: scrollLeft,
          scrollTop: scrollTop
        });

        onScroll({
          scrollLeft: scrollLeft,
          scrollTop: scrollTop
        });
      }
    };

    _this.__resetIsScrolling = function () {
      _this.setState({
        isScrolling: false
      });
    };

    _this.state = _extends({}, getDimensions(_this._getScrollElement(), _this.props), {
      isScrolling: false,
      scrollLeft: 0,
      scrollTop: 0
    });
    _this.onResize = _this.onResize.bind(_this);
    _this.updatePosition = _this.updatePosition.bind(_this);
    return _this;
  }

  _createClass(WindowScroller, [{
    key: 'onResize',
    value: function onResize() {
      this.updatePosition();
    }
  }, {
    key: 'updatePosition',
    value: function updatePosition(scrollable) {
      if (!canUseDOM) {
        return null;
      }

      var onResize = this.props.onResize;
      var _state = this.state,
          height = _state.height,
          width = _state.width;

      var scrollElement = this._getScrollElement();

      var thisNode = this._child || ReactDOM.findDOMNode(this);
      if (thisNode instanceof Element && scrollElement) {
        var offset = getPositionOffset(thisNode, scrollElement);
        this._positionFromTop = offset.top;
        this._positionFromLeft = offset.left;
      }

      var dimensions = getDimensions(scrollElement, this.props);
      if (height !== dimensions.height || width !== dimensions.width) {
        this.setState({
          height: dimensions.height,
          width: dimensions.width
        });
        onResize({
          height: dimensions.height,
          width: dimensions.width
        });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var scrollElement = this._getScrollElement();
      this._detectElementResize = createDetectElementResize();

      this.updatePosition(scrollElement);

      if (scrollElement) {
        registerScrollListener(this, scrollElement);
        this._registerResizeListener(scrollElement);
      }

      this._isMounted = true;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (!canUseDOM) {
        return;
      }
      var prevScrollElement = document.getElementById(prevProps.scrollElement);
      var scrollElement = this._getScrollElement();

      if (prevScrollElement !== scrollElement && prevScrollElement != null && scrollElement != null) {
        this.updatePosition(scrollElement);

        unregisterScrollListener(this, prevScrollElement);
        registerScrollListener(this, scrollElement);

        this._unregisterResizeListener(prevScrollElement);
        this._registerResizeListener(scrollElement);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var scrollElement = this._getScrollElement();
      if (scrollElement) {
        unregisterScrollListener(this, scrollElement);
        this._unregisterResizeListener(scrollElement);
      }

      this._isMounted = false;
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;
      var _state2 = this.state,
          isScrolling = _state2.isScrolling,
          scrollTop = _state2.scrollTop,
          scrollLeft = _state2.scrollLeft,
          height = _state2.height,
          width = _state2.width;


      return children({
        onChildScroll: this._onChildScroll,
        registerChild: this._registerChild,
        height: height,
        isScrolling: isScrolling,
        scrollLeft: scrollLeft,
        scrollTop: scrollTop,
        width: width
      });
    }
  }, {
    key: '_getScrollElement',
    value: function _getScrollElement() {
      if (!canUseDOM) {
        return null;
      }

      var scrollElement = this.props.scrollElement;

      if (typeof scrollElement === 'string') {
        return document.querySelector(scrollElement);
      }
      // scrollElement defaults to Window
      return scrollElement;
    }

    // Referenced by utils/onScroll


    // Referenced by utils/onScroll

  }]);

  return WindowScroller;
}(React.PureComponent);

WindowScroller.defaultProps = {
  onResize: function onResize() {},
  onScroll: function onScroll() {},
  scrollingResetTimeInterval: IS_SCROLLING_TIMEOUT,
  scrollElement: getWindow(),
  serverHeight: 0,
  serverWidth: 0
};


WindowScroller.propTypes = {
  /**
   * Function responsible for rendering children.
   * This function should implement the following signature:
   * ({ height, isScrolling, scrollLeft, scrollTop, width }) => PropTypes.element
   */
  children: PropTypes.func.isRequired,

  /** Callback to be invoked on-resize: ({ height, width }) */
  onResize: PropTypes.func,

  /** Callback to be invoked on-scroll: ({ scrollLeft, scrollTop }) */
  onScroll: PropTypes.func,

  /** Query string for element to attach scroll event listeners. Defaults to window if no element query string provided. */
  scrollElement: PropTypes.string,
  /**
   * Wait this amount of time after the last scroll event before resetting child `pointer-events`.
   */
  scrollingResetTimeInterval: PropTypes.number,

  /** Height used for server-side rendering */
  serverHeight: PropTypes.number,

  /** Width used for server-side rendering */
  serverWidth: PropTypes.number
};

export default WindowScroller;